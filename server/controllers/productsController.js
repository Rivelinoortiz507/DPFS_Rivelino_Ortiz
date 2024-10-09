const path = require('path');
const fs = require('fs');
const { Product, Category } = require('../sequelize');
const multer = require('multer');
const { Op } = require('sequelize'); 


// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en la fecha y la extensión
    }
});

const upload = multer({ storage: storage });

// Mostrar formulario de creación de producto
exports.showCreateProductForm = async (req, res) => {
    try {
        const categories = await Category.findAll(); // Obtener todas las categorías
        res.render('products/create-product', { categories, errorMessages: {} }); // Pasar categorías y un objeto vacío para los mensajes de error
    } catch (error) {
        console.error('Error al cargar el formulario de creación:', error);
        res.status(500).send('Error al cargar el formulario de creación');
    }
};



// Leer todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }]
        });

        // Convertir el precio a número
        products.forEach(product => {
            product.price = parseFloat(product.price); // Asegúrate de que sea un número
        });

        res.render('products/productList', { products });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }] // Incluye la categoría
        });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        product.price = parseFloat(product.price);

        res.render('products/productDetail', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Mostrar el formulario de edición
exports.showEditProductForm = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByPk(productId);
        const categories = await Category.findAll();

        // Aquí se inicializa errorMessages como un objeto vacío
        const errorMessages = {};

        res.render('products/edit-product', {
            product,
            categories,
            errorMessages // Pasamos errorMessages a la vista
        });
    } catch (error) {
        console.error('Error al mostrar el formulario de edición:', error);
        res.render('products/edit-product', {
            product: null,
            categories: [],
            errorMessages: { general: 'Error al cargar el producto.' } // Puedes definir un mensaje de error general si lo deseas
        });
    }
};

// Crear un producto
exports.createProduct = async (req, res) => {
    const { name, description, price, categoryId } = req.body; 
    let errorMessages = {};
    let imageUrl = null; // Inicializa imageUrl

    try {
        // Validaciones
        if (!name || name.length < 5) {
            errorMessages.name = 'El nombre del producto es obligatorio y debe tener al menos 5 caracteres.';
        }

        if (!description || description.length < 20) {
            errorMessages.description = 'La descripción del producto es obligatoria y debe tener al menos 20 caracteres.';
        }

        if (!categoryId) {
            errorMessages.category = 'La categoría es obligatoria.';
        }

        if (!price || price <= 0) {
            errorMessages.price = 'El precio es obligatorio y debe ser mayor que 0.';
        }

        // Si hay errores, renderiza el formulario con mensajes de error
        if (Object.keys(errorMessages).length > 0) {
            const categories = await Category.findAll();
            return res.render('products/create-product', { categories, errorMessages });
        }

        // Manejo de la subida de la imagen
        if (req.file) {
            const originalName = req.file.originalname;
            const productImagesPath = path.join(__dirname, '../public/images/product');

            // Asegúrate de que la carpeta exista
            await fs.promises.mkdir(productImagesPath, { recursive: true });

            // Construye la ruta completa para guardar la imagen
            imageUrl = `/images/product/${originalName}`; 

            // Guarda el archivo en la carpeta adecuada
            await fs.promises.copyFile(req.file.path, path.join(productImagesPath, originalName));
        }

        // Crea el producto en la base de datos
        await Product.create({
            name,
            description,
            price,
            categoryId, 
            imageUrl
        });

        res.redirect('/products');
    } catch (error) {
        console.error('Error al crear el producto:', error);
        const categories = await Category.findAll();
        res.render('products/create-product', {
            categories,
            errorMessages: { general: 'Error al crear el producto' }
        });
    }
};


// Actualizar un producto
exports.editProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, categoryId } = req.body;
    let errorMessages = {};

    // Validaciones
    if (!name || name.length < 5) {
        errorMessages.name = 'El nombre del producto es obligatorio y debe tener al menos 5 caracteres.';
    }

    if (!description || description.length < 20) {
        errorMessages.description = 'La descripción del producto es obligatoria y debe tener al menos 20 caracteres.';
    }

    if (!categoryId) {
        errorMessages.category = 'La categoría es obligatoria.';
    }

    if (!price || price <= 0) {
        errorMessages.price = 'El precio es obligatorio y debe ser mayor que 0.';
    }

    // Si hay errores, renderiza el formulario con mensajes de error
    if (Object.keys(errorMessages).length > 0) {
        const categories = await Category.findAll();
        // Recupera el producto actual
        const product = await Product.findByPk(productId);
        return res.render('products/edit-product', { product, categories, errorMessages });
    }

    // Si no hay errores, actualiza el producto
    try {
        const product = await Product.findByPk(productId);

        // Si hay una nueva imagen, actualiza; de lo contrario, mantiene la imagen existente
        const imageUrl = req.file ? req.file.filename : product.imageUrl;

        await Product.update(
            { name, description, price, categoryId, imageUrl },
            { where: { id: productId } }
        );

        res.redirect(`/products/${productId}`); // Redirigir a la vista del producto actualizado
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto.');
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            // Elimina el archivo de imagen si existe
            if (product.imageUrl) {
                const imagePath = path.join(__dirname, '../public/images', path.basename(product.imageUrl));
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error al eliminar la imagen:', err);
                    }
                });
            }

            // Elimina el producto de la base de datos
            await product.destroy();
            res.redirect('/products');
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send('Error al eliminar el producto');
    }
};

// Búsqueda de productos
exports.searchProducts = async (req, res) => {
    const searchTerm = req.query.q || '';

    if (!searchTerm) {
        return res.redirect('/products');
    }

    try {
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: [{ model: Category, as: 'category' }]
        });

        const message = products.length === 0 ? 'Producto no encontrado' : null;
        res.render('products/productList', { products, message });
    } catch (err) {
        console.error('Error al realizar la búsqueda:', err);
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
    }
};

exports.fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category', // Asegúrate de usar el alias correcto
                attributes: ['id', 'name'] // Ajusta los atributos según lo necesario
            }]
        });

        // Para depuración: imprime los productos obtenidos
        console.log(products);

        // Devuelve los productos como JSON
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Función para obtener los detalles de un producto específico
exports.getProductDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({
            where: { id },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'] // Ajusta los atributos según lo necesario
            }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Asegúrate de que el precio sea un número
        product.price = parseFloat(product.price); // Asegúrate de que sea un número

        // Devuelve el producto como JSON
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el detalle del producto:', error);
        res.status(500).json({ message: 'Error al obtener el detalle del producto' });
    }
};
const path = require('path');
const fs = require('fs');
const { Product, Category } = require('../sequelize');
const multer = require('multer');
const { Op } = require('sequelize'); // Asegúrate de importar Op para las consultas

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
        res.render('products/create-product', { categories }); // Pasar categorías a la vista
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

        res.render('products/edit-product', {
            product,
            categories,
            error: null // Asegúrate de pasar `error` aquí
        });
    } catch (error) {
        console.error('Error al mostrar el formulario de edición:', error);
        res.render('products/edit-product', {
            product: null,
            categories: [],
            error: 'Error al cargar el producto.'
        });
    }
};

// Crear un producto
exports.createProduct = async (req, res) => {
    const { name, description, price, categoryId } = req.body; 

    try {
        let imageUrl = null; // Inicializa imageUrl

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
        res.render('products/create-product', {
            error: 'Error al crear el producto'
        });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        let imageUrl = product.imageUrl; // Mantiene la imagen existente

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

        await Product.update(
            { name, description, price, imageUrl },
            { where: { id } }
        );

        res.redirect('/products');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.render('products/edit-product', {
            error: 'Error al actualizar el producto',
            product: { id, name, description, price, imageUrl: product.imageUrl }
        });
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

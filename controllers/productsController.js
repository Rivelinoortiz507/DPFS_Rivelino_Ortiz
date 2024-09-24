const path = require('path');
const Product = require('../database/models/product');
const multer = require('multer');

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
exports.showCreateProductForm = (req, res) => {
    res.render('products/create-product'); // Muestra el formulario de creación
};

// Crear un producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = req.file ? `/images/${req.file.filename}` : ''; // Ajusta la URL de la imagen

        // Verifica que los campos necesarios no estén vacíos
        if (!name || !price) {
            return res.status(400).send('Faltan campos requeridos');
        }

        // Crea un nuevo producto
        const newProduct = {
            name,
            description,
            price,
            imageUrl
        };

        // Guarda el producto en la base de datos
        await Product.create(newProduct);

        // Redirige a la lista de productos o a la vista de detalles
        res.redirect('/products');
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send('Error al crear el producto');
    }
};

// Leer todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.render('products/productList', { products: products, message: null });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
};

// Leer un producto
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.render('products/productDetail', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener el producto');
    }
};

// Mostrar el formulario de edición
exports.showEditProductForm = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.render('products/edit-product', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el producto para editar:', error);
        res.status(500).send('Error al obtener el producto para editar');
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        let imageUrl = req.body.imageUrl; // Mantén la URL actual de la imagen por defecto

        if (req.file) {
            // Si se sube una nueva imagen, actualiza la URL de la imagen
            imageUrl = `/images/${req.file.filename}`;
        }

        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update({ name, description, price, imageUrl });
            res.redirect(`/products/${req.params.id}`);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            // Elimina el archivo de imagen si existe
            if (product.imageUrl) {
                const fs = require('fs');
                const path = require('path');
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
            }
        });

        const message = products.length === 0 ? 'Producto no encontrado' : null;
        res.render('productList', { products, message });
    } catch (err) {
        console.error('Error al realizar la búsqueda:', err);
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
    }
};


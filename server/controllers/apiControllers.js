const { User, Product, Category } = require('../sequelize');
const bcrypt = require('bcrypt');

// ==================== Usuario ====================

// Función para obtener todos los usuarios y devolver solo JSON
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'profileImageUrl'] // Campos a incluir en la respuesta
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Función para obtener los detalles de un usuario específico y devolver solo JSON
exports.getUserDetails = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'age', 'country', 'profileImageUrl'] // Asegúrate de incluir solo los campos necesarios
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el detalle del usuario:', error);
        res.status(500).json({ message: 'Error al obtener el detalle del usuario' });
    }
};

// ==================== Producto ====================

// Función para obtener los productos
exports.fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category', // Asegúrate de usar el alias correcto
                attributes: ['id', 'name'] // Ajusta los atributos según lo necesario
            }]
        });
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
        product.price = parseFloat(product.price); // Asegúrate de que el precio sea un número
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el detalle del producto:', error);
        res.status(500).json({ message: 'Error al obtener el detalle del producto' });
    }
};

// ==================== Categoría ====================

// Función para obtener todas las categorías
exports.listCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};

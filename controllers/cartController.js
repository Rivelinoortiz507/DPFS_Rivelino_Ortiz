const Product = require('../database/models/product');

// Mostrar el carrito
exports.showCart = (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
};

exports.addToCart = async (req, res) => {
    try {
        const productId = req.body.productId; // Asumiendo que envías el ID desde el formulario

        // Buscar el producto en la base de datos
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Inicializar el carrito si no existe
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Buscar si el producto ya está en el carrito
        const existingProductIndex = req.session.cart.findIndex(item => item.product.id === product.id);

        if (existingProductIndex >= 0) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            req.session.cart[existingProductIndex].quantity += 1;
        } else {
            // Si no está, añadir el producto al carrito
            req.session.cart.push({
                product: product,  // Información del producto
                quantity: 1        // Inicializamos con cantidad 1
            });
        }

        // Respuesta al cliente
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ message: 'Error al añadir producto al carrito' });
    }
};

// Eliminar producto del carrito
exports.removeFromCart = (req, res) => {
    const { productId } = req.body;
    let cart = req.session.cart || [];

    // Filtra el carrito para eliminar el producto con el ID especificado
    cart = cart.filter(item => item.product.id !== productId);
    req.session.cart = cart;

    res.redirect('/cart');
};

// Vaciar el carrito
exports.clearCart = (req, res) => {
    req.session.cart = [];  // Vacía el carrito
    res.redirect('/cart');
};

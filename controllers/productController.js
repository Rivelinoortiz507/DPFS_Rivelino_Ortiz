// controllers/productController.js

// Ejemplo de datos de productos (esto normalmente vendría de una base de datos)
const products = [
    {
        id: 1,
        name: 'Producto 1',
        description: 'Descripción del Producto 1',
        price: 100,
        imageUrl: ''
    },

    {
        id: 2,
        name: 'Producto 2',
        description: 'Descripción del Producto 2',
        price: 200
    },

    // Agrega más productos según sea necesario
];

exports.productDetail = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.render('productDetail', { product });
    } else {
        res.status(404).send('Producto no encontrado');
    }
};
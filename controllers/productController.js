const path = require('path');
const fs = require('fs');

exports.listProducts = (req, res) => {
    const productsPath = path.join(__dirname, '../data/products.json');
    
    if (!fs.existsSync(productsPath)) {
        return res.status(404).send('No se encontraron productos');
    }

    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const categories = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = { name: product.category, products: [] };
        }
        acc[product.category].products.push(product);
        return acc;
    }, {});

    const categoriesArray = Object.values(categories);

    res.render('products/productList', { categories: categoriesArray });
};

exports.productDetail = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productsPath = path.join(__dirname, '../data/products.json');
    let products = [];

    if (fs.existsSync(productsPath)) {
        products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }

    res.render('products/productDetail', { product });
};


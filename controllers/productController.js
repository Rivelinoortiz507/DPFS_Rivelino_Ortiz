// controllers/productController.js
const { Product } = require('../database/models');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    // Categoriza los productos
    const categories = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { name: product.category, products: [] };
      }
      acc[product.category].products.push(product);
      return acc;
    }, {});

    const categoriesArray = Object.values(categories);

    res.render('products/productList', { categories: categoriesArray });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).send('Error al listar productos');
  }
};

exports.productDetail = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('products/productDetail', { product });
  } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    res.status(500).send('Error al obtener detalles del producto');
  }
};

// Añade métodos para crear, editar y eliminar productos aquí si es necesario

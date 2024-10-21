const Product = require('../models/product');

const productService = {
    getAllProducts: async () => {
        return await Product.findAll();
    },

    createProduct: async (data) => {
        return await Product.create({
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl
        });
    },

    getProductById: async (id) => {
        return await Product.findByPk(id);
    }
};

module.exports = productService;

const { Category } = require('../database/models');

async function listCategories(req, res) {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name']
        });

        // Renderiza la vista si no es una solicitud AJAX
        res.render('products/categories', { categories });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).send('Error al cargar las categorías');
    }
}

module.exports = { listCategories };

const { Category } = require('../database/models');

async function listCategories(req, res) {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name']
        });

        // Devuelve las categorías en formato JSON
        res.json(categories);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al cargar las categorías' });
    }
}

module.exports = { listCategories };

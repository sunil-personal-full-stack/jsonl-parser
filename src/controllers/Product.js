const { Product, Variant } = require('../models');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Variant, as: 'variants' }],
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Variant, as: 'variants' }],
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
};

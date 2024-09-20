const db = require('../models');
const logger = require('../helpers/winston')

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [{ model: db.Variant, as: 'variants' }]
        });
        res.json(products);
    } catch (error) {
        console.log(error)
        logger.error(`Error fetching products: ${error.message}`, error)
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id, {
            include: [{ model: db.Variant, as: 'variants' }]
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`Error fetching product: ${error.message}`, error)
        res.status(500).json({ error: 'Error fetching product' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = await db.Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        logger.error(`Error creating product: ${error.message}`, error)
        res.status(500).json({ error: 'Error creating product' });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`Error updating product: ${error.message}`, error)
        res.status(500).json({ error: 'Error updating product' });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`Error deleting product: ${error.message}`, error)
        res.status(500).json({ error: 'Error deleting product' });
    }
};

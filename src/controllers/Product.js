const db = require('../models');
const logger = require('../helpers/winston')

// Get all products
exports.getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    try {
        const offset = (page - 1) * limit; // Calculate offset for pagination

        const { count, rows } = await db.Product.findAndCountAll({
            include: [{ model: db.Variant, as: 'variants' }],
            limit: parseInt(limit, 10), // Set the limit
            offset: parseInt(offset, 10) // Set the offset
        });

        // Create a response object with pagination information
        const response = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page, 10),
            products: rows,
        };

        res.json(response);
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`, error);
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

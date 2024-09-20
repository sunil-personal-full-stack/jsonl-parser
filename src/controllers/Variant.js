const db = require('../models');
const logger = require('../helpers/winston')

// Get all variants of a product
exports.getAllVariantsByProductId = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    try {
        const offset = (page - 1) * limit; // Calculate offset for pagination

        const { count, rows } = await db.Variant.findAndCountAll({
            where: { productId: req.params.productId },
            limit: parseInt(limit, 10), // Set the limit
            offset: parseInt(offset, 10) // Set the offset
        });

        // Create a response object with pagination information
        const response = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page, 10),
            variants: rows,
        };

        res.json(response);
    } catch (error) {
        logger.error(`Error get variant: ${error.message}`, error);
        res.status(500).json({ error: 'Error fetching variants' });
    }
};


// Create a new variant for a product
exports.createVariant = async (req, res) => {
    try {
        const variant = await db.Variant.create({
            ...req.body,
            productId: req.params.productId,
        });
        res.status(201).json(variant);
    } catch (error) {
        logger.error(`Error creating variant: ${error.message}`, error)
        res.status(500).json({ error: 'Error creating variant' });
    }
};

// Update a variant by ID
exports.updateVariant = async (req, res) => {
    try {
        const variant = await db.Variant.findByPk(req.params.id);
        if (variant) {
            await variant.update(req.body);
            res.json(variant);
        } else {
            res.status(404).json({ error: 'Variant not found' });
        }
    } catch (error) {
        logger.error(`Error updating variant: ${error.message}`, error)
        res.status(500).json({ error: 'Error updating variant' });
    }
};

// Delete a variant by ID
exports.deleteVariant = async (req, res) => {
    try {
        const variant = await db.Variant.findByPk(req.params.id);
        if (variant) {
            await variant.destroy();
            res.json({ message: 'Variant deleted successfully' });
        } else {
            res.status(404).json({ error: 'Variant not found' });
        }
    } catch (error) {
        logger.error(`Error delete variant: ${error.message}`, error)
        res.status(500).json({ error: 'Error deleting variant' });
    }
};

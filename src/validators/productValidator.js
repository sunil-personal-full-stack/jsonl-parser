const Joi = require('joi');

const productSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1024).required(),
    vendor: Joi.string().min(2).max(100).required(),
    options: Joi.array().items(
        Joi.array().ordered(
            Joi.string().valid('color', 'size', 'material'),  // Valid options keys
            Joi.array().items(Joi.string()).min(1)            // List of option values
        )
    ).required(),
});

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

module.exports = validateProduct;

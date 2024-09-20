const Joi = require('joi');

const variantSchema = Joi.object({
    variantTitle: Joi.string().required(),
    price: Joi.string().regex(/^\$\d+(\.\d{2})?$/).required(),  // e.g., "$123.00"
    availableQuantity: Joi.number().integer().min(0).required(),
    availableForSale: Joi.boolean().required(),
    variantPosition: Joi.number().integer().min(1).required(),
});

const validateVariant = (req, res, next) => {
    const { error } = variantSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

module.exports = validateVariant;

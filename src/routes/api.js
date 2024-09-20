const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const variantController = require('../controllers/Variant');
const tokenController = require('../controllers/Token');
const validateProduct = require('../validators/productValidator');
const validateVariant = require('../validators/variantValidator');

const logger = require('../helpers/winston')
router.use((req, res, next) => {
    logger.info(`Request Params :: ${JSON.stringify(req.params)}`)
    logger.info(`Request URL :: ${JSON.stringify(req.url)}`)
    logger.info(`Request BODY :: ${JSON.stringify(req.body)}`)
    next()
})

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', validateProduct, productController.createProduct);
router.put('/products/:id', validateProduct, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Variant routes
router.get('/products/:productId/variants', variantController.getAllVariantsByProductId);
router.post('/products/:productId/variants', validateVariant, variantController.createVariant);
router.put('/variants/:id', validateVariant, variantController.updateVariant);
router.delete('/variants/:id', variantController.deleteVariant);

// Token generation route
router.post('/api/token', tokenController.generateToken);

module.exports = router;


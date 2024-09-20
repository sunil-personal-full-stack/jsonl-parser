const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const variantController = require('../controllers/Variant');
const tokenController = require('../controllers/Token');
const validateProduct = require('../validators/productValidator');
const validateVariant = require('../validators/variantValidator');
const authenticateRequest = require('../middleware/authenticateRequest')

const logger = require('../helpers/winston')
router.use((req, res, next) => {
    logger.info(`Request Params :: ${JSON.stringify(req.params)}`)
    logger.info(`Request URL :: ${JSON.stringify(req.url)}`)
    logger.info(`Request BODY :: ${JSON.stringify(req.body)}`)
    next()
})

// Product routes
router.get('/products', authenticateRequest, productController.getAllProducts);
router.get('/products/:id', authenticateRequest, productController.getProductById);
router.post('/products', authenticateRequest, validateProduct, productController.createProduct);
router.put('/products/:id', authenticateRequest, validateProduct, productController.updateProduct);
router.delete('/products/:id', authenticateRequest, productController.deleteProduct);

// Variant routes
router.get('/products/:productId/variants', authenticateRequest, variantController.getAllVariantsByProductId);
router.post('/products/:productId/variants', validateVariant, variantController.createVariant);
router.put('/variants/:id', authenticateRequest, validateVariant, variantController.updateVariant);
router.delete('/variants/:id', authenticateRequest, variantController.deleteVariant);

// Token generation route
router.post('/api/token', tokenController.generateToken);

module.exports = router;


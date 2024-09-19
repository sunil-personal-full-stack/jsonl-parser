const express = require('express');
const router = express.Router();
const authenticateRequest = require('../middleware/authenticateRequest');
const productController = require('../controllers/Product');

// Apply authentication middleware to all routes
router.use(authenticateRequest);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;

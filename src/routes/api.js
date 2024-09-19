const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/Token');
const productRoutes = require('./products');

router.get('/token', tokenController.generateToken);
router.use('/products', productRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
router.use('/',require('./swagger'));
router.use('/employees',require('./employee'));
router.use('/products',require('./product'));
module.exports = router;

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { generateComparisonPDF } = require('../controllers/pdf.controller');

const router = express.Router();

router.post('/comparison', protect, generateComparisonPDF);

module.exports = router;
const express = require('express');
const { getGeneratedContent } = require('../controllers/contentController');
const router = express.Router();

// Route for generating content
router.post('/generate-content', getGeneratedContent);

module.exports = router;

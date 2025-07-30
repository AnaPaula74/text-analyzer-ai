const express = require('express');
const analyzeTextController = require('../controllers/analyzeText.controller');

const router = express.Router();

router.post('/', analyzeTextController.analyzeText);

router.get('/search-term', analyzeTextController.searchTerm);

module.exports = router;

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/advanced', searchController.advancedSearch);

router.get('/full-text', searchController.fullTextSearch);

router.post('/match-skills', searchController.matchSkills);

module.exports = router;

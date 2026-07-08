const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');

router.get('/', authorsController.getAllAuthors);

module.exports = router;
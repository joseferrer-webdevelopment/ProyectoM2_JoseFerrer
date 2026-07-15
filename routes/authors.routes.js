const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');
const validateAuthor = require('../middlewares/validateAuthor');
const { validatePositiveId } = require('../middlewares/validateParams');

router.get('/', authorsController.getAllAuthors);
router.get('/:id', validatePositiveId('id'), authorsController.getAuthorById);
router.post('/', validateAuthor, authorsController.createAuthor);
router.put('/:id', validatePositiveId('id'), validateAuthor, authorsController.updateAuthor);
router.delete('/:id', validatePositiveId('id'), authorsController.deleteAuthorById);

module.exports = router;

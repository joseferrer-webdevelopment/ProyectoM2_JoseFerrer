const authorsService = require('../services/authors.service');

async function getAllAuthors(req, res, next) {
  try {
    const authors = await authorsService.getAllAuthors();
    res.json(authors);
  } catch (error) {
    next(error);
  }
}

async function getAuthorById(req, res, next) {
  try {
    const author = await authorsService.getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
}

async function createAuthor(req, res, next) {
  try {
    const { name, email, bio } = req.body;
    const newAuthor = await authorsService.createAuthor(name, email, bio);
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
}

async function updateAuthor(req, res, next) {
  try {
    const { name, email, bio } = req.body;
    const updatedAuthor = await authorsService.updateAuthor(req.params.id, name, email, bio);

    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }

    res.json(updatedAuthor);
  } catch (error) {
    next(error);
  }
}

async function deleteAuthorById(req, res, next) {
  try {
    const author = await authorsService.deleteAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthorById };

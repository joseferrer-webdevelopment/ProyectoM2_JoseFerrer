const authorsService = require('../services/authors.service');

async function getAllAuthors(req, res) {
  try {
    const authors = await authorsService.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getAuthorById(req, res) {
  try {
    const { id } = req.params;
    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAuthor(req, res) {
  try {
    const { name, email, bio } = req.body;
    const newAuthor = await authorsService.createAuthor(name, email, bio);
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateAuthor(req, res) {
  try {
    const { id } = req.params
    const { name, email, bio } = req.body
    const updateAuthor = await authorsService.updateAuthor (id, name, email, bio);
    res.status(200).json(updateAuthor);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor };
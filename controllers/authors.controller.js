const authorsService = require('../services/authors.service');

async function getAllAuthors(req, res) {
  try {
    const authors = await authorsService.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllAuthors };

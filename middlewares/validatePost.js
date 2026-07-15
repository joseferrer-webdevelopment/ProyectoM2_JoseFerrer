function validatePost(req, res, next) {
  const { authorId, title, content, published } = req.body;
  const isCreation = req.method === 'POST';

  if (isCreation && (!Number.isInteger(Number(authorId)) || Number(authorId) <= 0)) {
    return res.status(400).json({ error: 'authorId debe ser un número entero positivo' });
  }

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title es obligatorio y no puede estar vacío' });
  }

  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'content es obligatorio y no puede estar vacío' });
  }

  if (!isCreation && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published debe ser booleano' });
  }

  if (isCreation && published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published debe ser booleano' });
  }

  req.body.title = title.trim();
  req.body.content = content.trim();

  if (isCreation) {
    req.body.authorId = Number(authorId);
    req.body.published = published ?? false;
  }

  next();
}

module.exports = validatePost;

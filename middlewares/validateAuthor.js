const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAuthor(req, res, next) {
  const { name, email, bio } = req.body;
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name es obligatorio y no puede estar vacío' });
  }

  if (!soloLetras.test(name)) { 
    return res.status(400).json({ error: 'El nombre solo puede contener letras y espacios' });

  }

  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'email es obligatorio y no puede estar vacío' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return res.status(400).json({ error: 'email debe tener un formato válido' });
  }

  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ error: 'bio debe ser un texto' });
  }

  req.body.name = name.trim();
  req.body.email = normalizedEmail;

  if (typeof bio === 'string') {
    req.body.bio = bio.trim();
  }

  next();
}

module.exports = validateAuthor;

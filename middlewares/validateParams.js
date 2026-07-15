function validatePositiveId(paramName) {
  return (req, res, next) => {
    const value = Number(req.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({ error: `${paramName} debe ser un número entero positivo` });
    }

    req.params[paramName] = value;
    next();
  };
}

module.exports = { validatePositiveId };

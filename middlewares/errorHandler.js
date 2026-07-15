function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed' || error.code === '22P02') {
    return res.status(400).json({ error: 'La solicitud contiene datos inválidos' });
  }

  if (error.code === '23505') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos únicos' });
  }

  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { errorHandler, notFoundHandler };

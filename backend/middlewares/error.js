function notFound(req, res, next) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador invalido' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Datos invalidos' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'El recurso ya existe' });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };

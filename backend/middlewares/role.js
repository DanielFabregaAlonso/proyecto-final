function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'No tienes permisos para esta accion' });
    }
    next();
  };
}

module.exports = { requireRole };

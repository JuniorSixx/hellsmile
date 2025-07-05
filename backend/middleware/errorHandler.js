const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Dados inválidos',
      details: err.message
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Registro duplicado'
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  });
};

module.exports = errorHandler;

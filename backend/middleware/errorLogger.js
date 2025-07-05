const errorLogger = (err, req, res, next) => {
  console.error('Error occurred at:', new Date().toISOString());
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Error:', err);
  
  next(err);
};

module.exports = errorLogger;

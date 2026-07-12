const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'ERROR',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = notFoundHandler;

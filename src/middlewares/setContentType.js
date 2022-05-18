const setContentType = (req, res, next) => {
  res.header('Content-Type', 'application/json');

  return next();
};

module.exports = setContentType;

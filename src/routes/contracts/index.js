const v1 = require('./v1/index');

module.exports = (app) => {
  // v1
  app.get('/v1/contracts/:id', v1.getById);
};

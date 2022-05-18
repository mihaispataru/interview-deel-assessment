const v1 = require('./v1/index');

module.exports = (app) => {
  // v1
  app.get('/v1/admin/best-profession', v1.getBestProfession);
  app.get('/v1/admin/best-clients', v1.getBestClients);
};

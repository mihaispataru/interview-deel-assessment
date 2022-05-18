const v1 = require('./v1/index');

module.exports = (app) => {
  // v1
  app.get('/v1/jobs/unpaid', v1.getUnpaid);
  app.post('/v1/jobs/:id/pay', v1.postJobIdPay);
};

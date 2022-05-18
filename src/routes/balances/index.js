const v1 = require('./v1/index');

module.exports = (app) => {
  // v1
  app.post('/v1/balances/deposit', v1.postBalancesDeposit);
};

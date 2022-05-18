const express = require('express');
const bodyParser = require('body-parser');

const authentication = require('./middlewares/authentication');

const app = express();

app.use(bodyParser.json());
app.use(authentication);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;

  const contract = await Contract.findOne({ where: { id } });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);

  return true;
});

module.exports = app;

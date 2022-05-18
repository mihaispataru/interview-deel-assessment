const express = require('express');
const bodyParser = require('body-parser');
const { queryParser } = require('express-query-parser');

const authentication = require('./middlewares/authentication');
const setContentType = require('./middlewares/setContentType');
const applyRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(queryParser({
  parseNull: true,
  parseBoolean: true,
  parseUndefined: true,
  parseNumber: true,
}));
app.use(setContentType);
app.use(authentication);

applyRoutes(app);

module.exports = app;

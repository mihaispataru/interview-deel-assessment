const express = require('express');
const bodyParser = require('body-parser');

const authentication = require('./middlewares/authentication');
const applyRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(authentication);

applyRoutes(app);

module.exports = app;

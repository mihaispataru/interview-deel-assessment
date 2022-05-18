const express = require('express');
const bodyParser = require('body-parser');

const authentication = require('./middlewares/authentication');
const setContentType = require('./middlewares/setContentType');
const applyRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(setContentType);
app.use(authentication);

applyRoutes(app);

module.exports = app;

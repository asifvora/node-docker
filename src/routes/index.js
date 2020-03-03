const allRoutes = require('express').Router();
const v1Routes = require('./v1');

allRoutes.use('/api/v1', v1Routes);

module.exports = allRoutes;

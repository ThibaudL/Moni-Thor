#!/usr/bin/env node
const express = require('express'),
    app = express(),
    port = 9003;
const DeployDb = require('./DeployDB');
const bodyParser = require('body-parser');
const settingsService = require('./services/settingsService');
const serversService = require('./services/serversService');
const servicesService = require('./services/servicesService');
const statsService = require('./services/statsService');
const LOGGER = require('./utils/logger');
const path = require('path');

DeployDb.init().then(() => {
    LOGGER.info("db initialized");
    app.listen(port);
    app.use(bodyParser.json()); // for parsing application/json
    app.use('/', express.static(path.join(__dirname, '../static')));
    settingsService.registerService(app,DeployDb);
    serversService.registerService(app,DeployDb);
    servicesService.registerService(app,DeployDb);
    statsService.registerService(app,DeployDb);

    LOGGER.info("Service started on port : "+port);
    LOGGER.info("http://localhost:"+port);
});
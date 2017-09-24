const express = require('express'),
    app = express(),
    port = 9000;
const DeployDb = require('./DeployDB');
const bodyParser = require('body-parser');
const settingsService = require('./services/settingsService');
const serversService = require('./services/serversService');
const LOGGER = require('./utils/logger');

DeployDb.init().then(() => {
    LOGGER.info("db initialized");
    app.listen(port);
    app.use(bodyParser.json()); // for parsing application/json
    settingsService.registerService(app,DeployDb);
    serversService.registerService(app,DeployDb);
});
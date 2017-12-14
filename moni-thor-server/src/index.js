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
const jenkinsService = require('./services/jenkinsService');
const LOGGER = require('./utils/logger');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);

app.use(bodyParser.json()); // for parsing application/json
app.use('/', express.static(path.join(__dirname, '../static')));

let wsServer = new WebSocket.Server({server});
// console.log(wsServer);
// wsServer.on('connection', (ws) => {
    console.log('connection');
    DeployDb.init().then(() => {
        LOGGER.info("db initialized");
        settingsService.registerService(app, DeployDb);
        serversService.registerService(app, DeployDb);
        servicesService.registerService(app, DeployDb);
        statsService.registerService(app, DeployDb);
        jenkinsService.registerService(app, DeployDb);
        // jenkinsService.registerService(app, DeployDb, ws);

        LOGGER.info("Service started on port : " + port);
        LOGGER.info("http://localhost:" + port);
    });
// });
server.listen(port, () => console.log('listening'));

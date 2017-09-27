const LOGGER = require('../utils/logger');
const fetch = require('node-fetch');
const auth = require('../../secret/auth');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : services service');
        app.route('/api/services')
            .get((req, res) => {
                    LOGGER.debug('received : ', 'GET', '/api/services');
                    let data = DeployDb.getServices().data;
                    if (data.length > 0) {
                        res.send(data);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
            .post((req, res) => {
                    LOGGER.debug('received : ', 'POST', '/api/services');
                    if (req.body && (req.body.serverHost ||
                            req.body.serviceToCall ||
                            req.body.serviceName)) {
                        DeployDb.save(DeployDb.getServices(), req.body);
                        res.send(DeployDb.getServices().data);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
        ;

        app.route('/api/services/ping')
            .get(async (req, res) => {
                // DeployDb.getServers().
                const service = req.query.service;
                let token = await fetch(service+auth.url)
                    .then(response => response.text())
                    .then((token) => token);
                LOGGER.debug('received : ', 'GET', '/api/services/ping/all?service='+service);
                let services = DeployDb.getServices().data;
                if (services && services.length > 0) {
                    for (const service of services) {
                        service.serverHost = service;
                        const start = Date.now();
                        await fetch(service + (service.serviceName || '') + (service.serviceToCall || ''), {headers : { 'x-auth-token' : token}})
                            .then(response => response.json())
                            .then((info) => {
                                if (!info) {
                                    throw 'Failed to reach';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK : ",service + (service.serviceName || '') + (service.serviceToCall || ''), end - start);
                                service.responseTime = end - start;
                                service.responding = true;
                                service.info = info;
                            })
                            .catch(() => {
                                service.responding = false;
                                LOGGER.info("Failed to reach : ", service + (service.serviceName || '') + (service.serviceToCall || ''))
                            });
                    }
                    DeployDb.save(DeployDb.getStats(),services.map((service) => {
                        return {
                            url : service + (service.serviceName || '') + (service.serviceToCall || ''),
                            responseTime : service.responseTime,
                            responding : service.responding
                        }
                    }));
                    res.send(services);
                } else {
                    res.sendStatus(204);
                }
            });

        app.route('/api/services/ping/all')
            .get(async (req, res) => {
                const server = req.query.server;
                let token = await fetch(server+auth.url)
                    .then(response => response.text())
                    .then((token) => token);
                LOGGER.debug('received : ', 'GET', '/api/services/ping/all?server='+server);
                let services = DeployDb.getServices().data;
                if (services && services.length > 0) {
                    for (const service of services) {
                        service.serverHost = server;
                        const start = Date.now();
                        await fetch(server + (service.serviceName || '') + (service.serviceToCall || ''), {headers : { 'x-auth-token' : token}})
                            .then(response => response.json())
                            .then((info) => {
                                if (!info) {
                                    throw 'Failed to reach';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK : ",server + (service.serviceName || '') + (service.serviceToCall || ''), end - start);
                                service.responseTime = end - start;
                                service.responding = true;
                                service.info = info;
                            })
                            .catch(() => {
                                service.responding = false;
                                LOGGER.info("Failed to reach : ", server + (service.serviceName || '') + (service.serviceToCall || ''))
                            });
                    }
                    DeployDb.save(DeployDb.getStats(),services.map((service) => {
                        return {
                            url : server + (service.serviceName || '') + (service.serviceToCall || ''),
                            responseTime : service.responseTime,
                            responding : service.responding
                        }
                    }));
                    res.send(services);
                } else {
                    res.sendStatus(204);
                }
            });


        app.route('/api/services/:id')
            .get((req, res) => {
                LOGGER.debug('received : ', 'GET', '/api/services/' + req.params.id);
                let find = DeployDb.getServices().data.find(
                    (server) => {
                        return '' + server.$loki === '' + req.params.id
                    }
                );
                if (find) {
                    res.send(find);
                } else {
                    res.sendStatus(204);
                }
            })
            .delete((req, res) => {
                LOGGER.debug('received : ', 'DELETE', '/api/services/' + req.params.id);
                let find = DeployDb.getServices().data.find(
                    (server) => {
                        return '' + server.$loki === '' + req.params.id
                    }
                );
                if (find) {
                    DeployDb.getServices().remove(find);
                    res.send(find);
                } else {
                    res.sendStatus(204);
                }
            });


    }
};
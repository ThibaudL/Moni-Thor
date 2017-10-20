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
                const serviceName = req.query.service;
                LOGGER.debug('received : ', 'GET', '/api/services/ping/all?service=' + serviceName);
                const service = DeployDb.getServices().data.find((service) => service.serviceName === serviceName);
                service.servers = [];
                const fetchs = [];
                if (DeployDb.getServers().data && DeployDb.getServers().data.length > 0) {
                    const services = [];
                    for (const server of DeployDb.getServers().data[0].servers) {
                        let token = await fetch(server + auth.url)
                            .then(response => response.text())
                            .then((token) => token);
                        const serverResult = {
                            host: server
                        };
                        const innerFetch = [];
                        const start = Date.now();
                        let afetchInfo = fetch(server + (service.serviceName || '') + (service.serviceToCall || ''), {headers: {'x-auth-token': token}});
                        fetchs.push(afetchInfo);
                        innerFetch.push(afetchInfo);
                        afetchInfo
                            .then(response => response.json())
                            .then((info) => {
                                if (!info) {
                                    throw 'Failed to reach';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK /info : ", server + (service.serviceName || '') + (service.serviceToCall || ''), end - start);
                                serverResult.responseTime = end - start;
                                serverResult.responding = true;
                                serverResult.info = info;
                            })
                            .catch(() => {
                                serverResult.responding = false;
                                LOGGER.info("Failed to reach /info : ", server + (service.serviceName || '') + (service.serviceToCall || ''))
                            });
                        let afetchMetrics = fetch(server + (service.serviceName || '') + '/metrics', {headers: {'x-auth-token': token}});
                        fetchs.push(afetchMetrics);
                        innerFetch.push(afetchMetrics);
                        afetchMetrics
                            .then(response => response.json())
                            .then((metrics) => {
                                if (!metrics) {
                                    throw 'Failed to reach ';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK /metrics : ", server + (service.serviceName || '') + '/metrics', end - start);
                                serverResult.metrics = metrics;
                            })
                            .catch(() => {
                                LOGGER.info("Failed to reach /metrics : ", server + (service.serviceName || '') + '/metrics')
                            });
                        let aFetchEnv = fetch(server + (service.serviceName || '') + '/env', {headers: {'x-auth-token': token}});
                        fetchs.push(aFetchEnv);
                        innerFetch.push(aFetchEnv);
                        aFetchEnv
                            .then(response => response.json())
                            .then((env) => {
                                if (!env) {
                                    throw 'Failed to reach ';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK /env : ", server + (service.serviceName || '') + '/env', end - start);
                                serverResult.env = env;
                            })
                            .catch(() => {
                                LOGGER.info("Failed to reach /env : ", server + (service.serviceName || '') + '/env')
                            });
                        Promise.all(innerFetch).then(() => {
                            service.servers.push(serverResult);
                        });
                    }
                    Promise.all(fetchs).then(() => {
                        DeployDb.save(DeployDb.getServices(), service);
                        res.send(service);
                    });
                } else {
                    res.sendStatus(204);
                }
            });

        app.route('/api/services/ping/all')
            .get(async (req, res) => {
                const server = req.query.server;
                let token = await fetch(server + auth.url)
                    .then(response => response.text())
                    .then((token) => token);
                LOGGER.debug('received : ', 'GET', '/api/services/ping/all?server=' + server);
                let services = DeployDb.getServices().data;
                const fetchs = [];
                if (services && services.length > 0) {
                    for (const service of services) {
                        service.serverHost = server;
                        const start = Date.now();
                        let afetch = fetch(server + (service.serviceName || '') + (service.serviceToCall || ''), {headers: {'x-auth-token': token}});
                        fetchs.push(afetch);
                        afetch
                            .then(response => response.json())
                            .then((info) => {
                                if (!info) {
                                    throw 'Failed to reach';
                                }
                                const end = Date.now();
                                LOGGER.info("Service is OK : ", server + (service.serviceName || '') + (service.serviceToCall || ''), end - start);
                                service.responding = true;
                                service.info = info;
                            })
                            .catch(() => {
                                service.responding = false;
                                LOGGER.info("Failed to reach : ", server + (service.serviceName || '') + (service.serviceToCall || ''))
                            });
                    }
                    Promise.all(fetchs).then(() => {
                        DeployDb.save(DeployDb.getStats(), services.map((service) => {
                            return {
                                url: server + (service.serviceName || '') + (service.serviceToCall || ''),
                                responding: service.responding
                            }
                        }));
                        res.send(services);
                    });
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
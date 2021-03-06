const LOGGER = require('../utils/logger');
const fetch = require('node-fetch');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : stats service');
        app.route('/api/stats')
            .get((req, res) => {
                    const serviceName = req.query.service;
                    LOGGER.debug('received : ', 'GET', '/api/stats&service=' + serviceName);

                    let data = DeployDb.getStats().data;
                    if (data.length > 0) {
                        res.send(data.filter((service) => service.url
                            .includes(serviceName))
                            .map((service) => {
                                service.server = service.url.split('/')[2];
                                return service;
                            })
                        );
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
            .delete((req, res) => {
                    LOGGER.debug('received : ', 'DELETE', '/api/stats');

                    let data = DeployDb.getStats().data;
                    if (data.length > 0) {
                        data.forEach((d) => {
                           LOGGER.debug('Deleted : ',d.$loki);
                           DeployDb.remove(DeployDb.getStats(), d.$loki);
                        });
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
        ;
    }
};
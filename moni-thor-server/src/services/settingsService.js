const LOGGER = require('../utils/logger');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : settings service');
        app.route('/api/settings')
            .get((req, res) => {
                    LOGGER.debug('received : ', 'GET', '/api/settings');
                    let data = DeployDb.getSettings().data;
                    if (data.length > 0) {
                        res.send(data[0]);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
            .post((req, res) => {
                    LOGGER.debug('received : ', 'POST', '/api/settings');
                    if (req.body && (req.body.serverHost ||
                            req.body.serviceToCall ||
                            req.body.serviceName)) {
                        DeployDb.save(DeployDb.getSettings(), req.body);
                        res.send(DeployDb.getSettings().data[0]);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
        ;
    }
};
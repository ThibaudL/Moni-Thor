const LOGGER = require('../utils/logger');
const fetch = require('node-fetch');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : stats service');
        app.route('/api/stats')
            .get((req, res) => {
                    LOGGER.debug('received : ', 'GET', '/api/stats');
                    let data = DeployDb.getStats().data;
                    if (data.length > 0) {
                        res.send(data);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
        ;
    }
};
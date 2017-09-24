const LOGGER = require('../utils/logger');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : servers service');
        app.route('/api/servers')
            .get((req, res) => {
                    LOGGER.debug('received : ', 'GET', '/api/servers');
                    let data = DeployDb.getServers().data;
                    if (data.length > 0) {
                        res.send(data);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
            .post((req, res) => {
                    LOGGER.debug('received : ', 'POST', '/api/servers');
                    if (req.body && (req.body.serverHost ||
                            req.body.serviceToCall ||
                            req.body.serviceName)) {
                        DeployDb.save(DeployDb.getServers(), req.body);
                        res.send(DeployDb.getServers().data);
                    } else {
                        res.sendStatus(204);
                    }
                }
            )
        ;
    app.route('/api/servers/:id').get((req,res) => {
            LOGGER.debug('received : ', 'GET', '/api/servers/'+req.params.id);
            let find = DeployDb.getServers().data.find(
                (server) => {
                    return ''+server.$loki === ''+req.params.id
                }
            );
            if(find){
                res.send(find);
            }else{
                res.sendStatus(204);
            }
        })

    }
};
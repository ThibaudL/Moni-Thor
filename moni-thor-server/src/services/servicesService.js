const LOGGER = require('../utils/logger');

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
    app.route('/api/services/:id').get((req,res) => {
            LOGGER.debug('received : ', 'GET', '/api/services/'+req.params.id);
            let find = DeployDb.getServices().data.find(
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
        .delete((req, res) => {
            LOGGER.debug('received : ', 'DELETE', '/api/services/'+req.params.id);
            let find = DeployDb.getServices().data.find(
                (server) => {
                    return ''+server.$loki === ''+req.params.id
                }
            );
            if(find){
                DeployDb.getServices().remove(find);
                res.send(find);
            }else{
                res.sendStatus(204);
            }
        })

    }
};
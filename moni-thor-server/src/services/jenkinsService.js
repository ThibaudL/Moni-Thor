const LOGGER = require('../utils/logger');
const fetch = require('node-fetch');
const jenkins = require('../../secret/jenkins');

const connectedUsers = [];

function getViewData(user,viewName, DeployDb) {
    let promises = [];
    return fetch(`${jenkins.url}/user/${user}/my-views/view/${encodeURIComponent(viewName)}/api/json`)
        .then(response => response.json())
        .then((view) => {
            let savedBuilds = DeployDb.getJenkins().data
                .find(b => b.name === view.name);
            view.jobs.forEach((job) => {
                promises.push(fetch(job.url + '/api/json')
                    .then((response) => response.json())
                    .then((infos) => {
                        job.infos = infos;
                        let lastBuildForJob;
                        if (savedBuilds) {
                            lastBuildForJob = savedBuilds.jobs
                                .find(
                                    (j) => {
                                        return j && j.infos && j.infos.lastBuild && j.infos.lastBuild.number === job.infos.lastBuild.number
                                    }
                                );
                        }
                        if (!lastBuildForJob && infos) {
                            let promisesInfos = [];
                            promisesInfos.push(fetch(infos.lastBuild.url + '/api/json')
                                .then((response) => response.json())
                                .then((lastBuild) => {
                                    view.hasChanged = true;
                                    job.infos.lastBuild = lastBuild;
                                    return job;
                                }).catch(() => {
                                    console.log("Pas de lastBuild pour : ", job.name)
                                })
                            );
                            promisesInfos.push(fetch(infos.lastBuild.url + '/mavenArtifacts/api/json')
                                .then((response) => response.json())
                                .then((mavenInfos) => {
                                    view.hasChanged = true;
                                    job.infos.maven = mavenInfos;
                                    return job;
                                })
                                .catch(() => {
                                    console.log("Pas de mavenArtifact pour : ", job.name)
                                })
                            );
                            return Promise.all(promisesInfos);
                        } else {
                            job.infos = lastBuildForJob.infos;
                        }
                    })
                    .catch((e) => {
                        console.log("Pas d'infos pour : ", job.name, e)
                    })
                );
            });
            return Promise.all(promises).then(() => {
                if (savedBuilds && savedBuilds.$loki) {
                    DeployDb.remove(DeployDb.getJenkins(), savedBuilds.$loki);
                }
                DeployDb.save(DeployDb.getJenkins(), view);
                return view;
            })
        });
}

module.exports = {
    registerService(app, DeployDb,wsServer) {
        wsServer.on('connection', (ws) => {
            console.log('connection');
            ws.on('message', (message) => {
                if(message.startsWith('register:')){
                    connectedUsers.push(message.split(':')[1]);
                }
            });
        });

        wsServer.broadcast = (view) => {
            wsServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(view));
                }
            });
        };

        setInterval(() => {
            DeployDb.getJenkins().data
                .forEach((view) => {
                    getViewData(view.name,view.user,DeployDb)
                        .then((v) => {
                            if(v.hasChanged){
                                wsServer.broadcast(v);
                            }
                        })
                });

        },60000);


        LOGGER.info('registered : jenkins service');
        app.route('/api/jenkins/build/user/:user/view/:view')
            .get((req, res) => {
                LOGGER.debug('received : ', 'GET', '/api/jenkins/build/user/', req.params.user, '/view/', req.params.view);
                    getViewData(req.params.user,req.params.view, DeployDb)
                    .then((build) => {
                        res.send(build);
                    })
                    .catch((e) => {
                        LOGGER.error(e);
                        res.sendStatus(500);
                    });
            });

        app.route('/api/jenkins/infos')
            .get((req, res) => {
                    LOGGER.debug('received : ', 'GET', '/api/jenkins/builds');
                    fetch(`${req.query.url}`)
                        .then(response => response.json())
                        .then((build) => {
                            res.send(build);
                        })
                        .catch((e) => {
                            LOGGER.error(e);
                            res.sendStatus(500);
                        });
                }
            )
        ;
    }
};
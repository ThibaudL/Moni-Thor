const LOGGER = require('../utils/logger');
const fetch = require('node-fetch');
const jenkins = require('../../secret/jenkins');

module.exports = {
    registerService(app, DeployDb) {
        LOGGER.info('registered : jenkins service');
        app.route('/api/jenkins/build/user/:user/view/:view')
            .get((req, res) => {
                LOGGER.debug('received : ', 'GET', '/api/jenkins/build/user/',req.params.user,'/view/',req.params.view);
                let promises = [];
                fetch(`${jenkins.url}/user/${req.params.user}/my-views/view/${encodeURIComponent(req.params.view)}/api/json`)
                    .then(response => response.json())
                    .then((build) => {
                        build.jobs.forEach((job) => {
                            promises.push(fetch(job.url + '/api/json')
                                .then((response) => response.json())
                                .then((infos) => {
                                    job.infos = infos;
                                    let lastBuild = DeployDb.getJenkins().data.find(
                                        (jenkins) => {
                                            return jenkins && jenkins.infos && jenkins.infos.lastBuild && jenkins.infos.lastBuild.number === job.infos.lastBuild.number
                                        }
                                    );
                                    if (!lastBuild && infos) {
                                        let promisesInfos = [];
                                        promisesInfos.push(fetch(infos.lastBuild.url + '/api/json')
                                            .then((response) => response.json())
                                            .then((lastBuild) => {
                                                job.infos.lastBuild = lastBuild;
                                                return job;
                                            }).catch(() => {
                                                console.log("Pas de lastBuild pour : ", job.name)
                                            })
                                        );
                                        promisesInfos.push(fetch(infos.lastBuild.url + '/mavenArtifacts/api/json')
                                            .then((response) => response.json())
                                            .then((mavenInfos) => {
                                                job.infos.maven = mavenInfos;
                                                return job;
                                            })
                                            .catch(() => {
                                                console.log("Pas de mavenArtifact pour : ", job.name)
                                            })
                                        );
                                        return Promise.all(promisesInfos);
                                    }else{
                                        build = lastBuild;
                                    }
                                })
                                .catch((e) => {
                                    console.log("Pas d'infos pour : ", job.name, e)
                                })
                            );
                        });
                        Promise.all(promises).then(() => {
                            DeployDb.save(DeployDb.getJenkins(), build);
                            res.send(build);
                        })
                        .catch((e) => {
                            LOGGER.error(e);
                            res.sendStatus(500);
                        });
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
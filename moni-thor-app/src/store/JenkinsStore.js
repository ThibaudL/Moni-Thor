let instance;
import axios from 'axios';

class JenkinsStore {
    constructor() {
        this.builds = [];
        this.ldapUser = "";
        if (instance) {
            return instance;
        }
        instance = this;
    }

    initUser() {
        return new Promise((resolve, reject) => {
            if (this.ldapUser) {
                resolve(this.ldapUser);
            } else {
                chrome.runtime.sendMessage('ohaiaamkoajhocfibmnlcnbjlgjmgaeh', {"getUser": 1},
                    (response) => {
                        this.ldapUser = response.user;
                        this.initWs(this.ldapUser);
                        resolve(this.ldapUser);
                    }
                );
            }
        });
    }

    getLastBuilds(user, view) {
        return axios.get(`api/jenkins/build/user/${user}/view/${view}`).then((response) => response.data);
    }

    getInfos(url) {
        return axios.get(`api/jenkins/infos?url=${encodeURIComponent(url)}`).then((response) => response.data);
    }


    initWs(user) {
        const BrowserWebSocket = require('browser-websocket');
        const ws = new BrowserWebSocket('ws://mdpa-10984:9003', {
            rejectUnauthorized: false
        });

        ws.on('open', () => {
            ws.emit('register:' + user);
        });

        ws.on('message', (e) => {
            // console.log(e);
            let view = JSON.parse(e.data);
            let eqView = this.builds.find((v) => v.name === view.name && v.user === view.user);
            if (eqView) {
                eqView.jobs = view.jobs;
            }
            if (view.jobs
                    .filter((job) => job.infos)
                    .filter((job) => job.infos.lastBuild)
                    .filter((job) => job.infos.lastBuild.culprits)
                    .filter((job) => job.infos.lastBuild.culprits[0])
                    .filter((job) => this.isConnectedUser(job.infos.lastBuild.culprits[0].fullName))) {
                chrome.notifications.create(job.name, {
                    title: 'Tu as fait planter le job : ' + job.name
                });
            }
        });
    }

    launchBuild(job) {
        axios.post(job.url + 'build');
        job.color = 'blue_anime';
    }

    isConnectedUser(user) {
        return user.includes(this.ldapUser);
    }

    initJenkins(forceReload) {
        if (this.builds && this.builds.length > 0 && !forceReload) {
            return new Promise((resolve) => resolve(this.builds));
        }
        this.builds = [];
        let jenkinsSettings = window.localStorage.getItem('jenkinsSettingsV2');
        if (jenkinsSettings) {
            let parsedJenkinsSettings = JSON.parse(jenkinsSettings);
            this.views = parsedJenkinsSettings.views;
        } else {
            this.views = ['Sinistre@T_LAMARCHE', 'Contrats@T_LAMARCHE', 'Ged@T_LAMARCHE', 'Directives@T_LAMARCHE', 'Partenaires@T_LAMARCHE', 'Siveer@T_LAMARCHE', 'Framework@T_LAMARCHE'];
        }

        const promises = [];

        this.views.forEach((view) => {
                let splitted = view.split('@');
                let viewName = splitted[0];
                let user = splitted[1];
                let build = {name: viewName, jobs: []};
                this.builds.push(build);
                promises.push(this.getLastBuilds(user, viewName)
                    .then(
                        (data) => {
                            build.user = data.user;
                            build.jobs = data.jobs;
                            this.$forceUpdate();
                        }
                    ).catch((error) => {
                    })
                );
            }
        );
        this.builds.push({name: 'My Builds', jobs: []});
        return Promise.all(promises).then(() => {
            this.builds[this.builds.length - 1].jobs = [
                ...this.builds
                    .map((build) => build.jobs)
                    .reduce((a, b) => [...a, ...b], [])
                    .filter((job) => job.infos)
                    .filter((job) => job.infos.lastBuild)
                    .filter((job) => job.infos.lastBuild.culprits)
                    .filter((job) => job.infos.lastBuild.culprits[0])
                    .filter((job) => this.isConnectedUser(job.infos.lastBuild.culprits[0].fullName))
            ];
        });
    }


}

export default new JenkinsStore();
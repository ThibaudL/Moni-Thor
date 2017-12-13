<template>
    <div class="jenkins ">
        <md-app-toolbar class=" md-toolbar" style="height: 50px;">
            <span>
                <h2>Jenkins</h2>
            </span>
        </md-app-toolbar>
        <div>
            <md-progress-bar class="md-primary" md-mode="indeterminate" v-if="loading"></md-progress-bar>
            <md-tabs @md-changed="initView">
                <md-tab v-for="build in builds"
                        :id="build.name"
                        :md-label="build.name"
                        :md-icon="getIcon(build)"
                >
                    <md-list v-if="build">
                        <md-list-item>
                            <div class="md-layout" style="font-weight: bold;width: 100%;">
                                <div class="md-layout-item md-size-40">
                                    Job
                                </div>
                                <div class="md-layout-item md-size-20">
                                    Time of build
                                </div>
                                <div class="md-layout-item md-size-20">
                                    Version
                                </div>
                                <div class="md-layout-item md-size-2">
                                    Build by Me
                                </div>
                                <div class="md-layout-item md-size-18">
                                    Last builder
                                </div>
                            </div>
                        </md-list-item>
                        <md-list-item v-for="job in build.jobs">
                            <div class="md-layout" style="width: 100%">
                                <div class="md-layout-item md-size-40"
                                     v-if="job.infos && job.infos.lastBuild && job.infos.lastBuild.url">
                                    <span class="state" v-bind:class="job.color">
                                            <i class="material-icons" v-if="job.color === 'blue'">check</i>
                                            <i class="material-icons"
                                               v-if="job.color === 'yellow' || job.color === 'red'">add_alert</i>
                                            <i class="material-icons" v-if="job.color.includes('anime')">refresh</i>
                                            <a class="terminal" title="console" target="_blank"
                                               :href="getConsoletUrl(job)">
                                                <i class="material-icons">video_label</i>
                                            </a>
                                    </span>
                                    <span>
                                        <a target="_blank" :href="job.url">{{job.name}}</a>
                                    </span>
                                </div>
                                <div class="md-layout-item md-size-20">
                                    <span v-if="job.infos.lastBuild && job.infos.lastBuild.timestamp">{{formatDate(job.infos.lastBuild.timestamp)}}</span>
                                </div>
                                <div class="md-layout-item md-size-20">
                                    <span v-if="job.infos">
                                        <label class="version"
                                               v-if="job.infos.maven && job.infos.maven.moduleRecords && job.infos.maven.moduleRecords[0]">
                                          {{job.infos.maven.moduleRecords[0].pomArtifact.version}}
                                        </label>
                                    </span>
                                </div>
                                <div class="md-layout-item md-size-2">
                                    <div v-if="job.infos.lastBuild && job.infos.lastBuild.culprits && job.infos.lastBuild.culprits[0]">
                                        <i v-if="isConnectedUser(job.infos.lastBuild.culprits[0].fullName)"
                                           class="material-icons">star</i>
                                    </div>
                                </div>
                                <div class="md-layout-item md-size-18">
                                    <span v-if="job.infos.lastBuild && job.infos.lastBuild.culprits && job.infos.lastBuild.culprits[0]">
                                        <label class="culprit">
                                            {{job.infos.lastBuild.culprits[0].fullName}}
                                        </label>
                                    </span>
                                </div>
                            </div>
                        </md-list-item>
                    </md-list>
                </md-tab>
            </md-tabs>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Vue from 'vue'
    import * as VueMaterial from "vue-material";

    export default {
        name: 'jenkins',
        data() {
            return {
//                url : '/jenkins',
                user: '',
                views: [],
                builds: [],
                tab: {
                    data: ''
                },
                loading: true,
                ldapUser: ''
            }
        },
        computed: {},
        methods: {
            getConsoletUrl(job) {
                return job.infos.lastBuild.url + 'console';
            },
            formatDate(timestamp) {
                let date = new Date(timestamp);
                return this.twoDigits(date.getDate()) + '/' +
                    this.twoDigits((date.getMonth() + 1)) + '/' +
                    date.getFullYear() + ' ' +
                    this.twoDigits(date.getHours()) + ':' +
                    this.twoDigits(date.getMinutes());
            },
            twoDigits(time) {
                return time < 10 ? '0' + time : time;
            },
            getLastBuilds(user, view) {
                return axios.get(`api/jenkins/build/user/${user}/view/${view}`).then((response) => response.data);
            },
            getInfos(url) {
                return axios.get(`api/jenkins/infos?url=${encodeURIComponent(url)}`).then((response) => response.data);
            },
//            getExecutors() {
//                return axios.get(`/ajaxExecutors`).then((response) => response.data);
//            },
            getIcon(build) {
                if (build.jobs.filter((job) => job.color !== 'blue' && job.color !== 'blue_anime').length > 0) {
                    return 'add_alert';
                }
                return 'done';
            },
            initView(id) {

            },
            isConnectedUser(username) {
                if (username && this.ldapUser) {
                    return username.includes(this.ldapUser);
                }
            }
        },
        mounted() {
            chrome.runtime.sendMessage('ohaiaamkoajhocfibmnlcnbjlgjmgaeh', {"getUser": 1},
                (response) => {
                    this.ldapUser = response.user;
                }
            );

            this.loading = true;
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
                                build.jobs = data.jobs;
                                this.$forceUpdate();
                            }
                        ).catch((error) => {
                        })
                    );
                }
            );
            this.builds.push({name: 'My Builds', jobs: []});
            setTimeout(() => {
                Promise.all(promises).then(() => {
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
                    this.loading = false;
                }).catch(() => this.loading = false);
            }, 250);
        }
    }
</script>
<style>
    h1, h2 {
        font-weight: normal;
    }

    nav.div.md-tabs-navigation {
        padding: 0px;
    }

    .jenkins span.state.blue {
        color: cornflowerblue;
    }

    .jenkins span.state.yellow {
        color: #ffcc3c;
    }

    .add_alert {
        color: darkred;
    }

    .jenkins span.state.red {
        color: darkred;
    }

    .jenkins span.state.red_anime > i,
    .jenkins span.state.yellow_anime > i,
    .jenkins span.state.blue_anime > i {
        /*background-image: -webkit-radial-gradient(20px 20px, circle cover, white, cornflowerblue);*/
        animation-name: spin;
        animation-duration: 3s; /* 3 seconds */
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .md-list-item .md-list-item-container:hover {
        text-decoration: none;
        background-color: whitesmoke;
    }

    .md-list-item:last-child .md-list-item-container {
        border-bottom: none;
    }

    .md-list-item .md-list-item-container {
        border-bottom: 1px solid lightgrey;
    }

    .connected {
        font-weight: bold;
    }

    .jenkins .md-tabs .md-tabs-container {
        transition: none;
    }

    .jenkins a.terminal {
        color: #000;
    }

    .jenkins .md-layout {
        align-items: center;
    }

    .jenkins .md-tabs .md-tabs-navigation .md-button:last-of-type {
        position: absolute;
        right: 0px;
        height: 100%;
    }

    .jenkins .md-tabs > .md-tabs-navigation .md-tab-header.md-active, .md-tabs > .md-tabs-navigation .md-tab-header:focus {
        background-color: #ff5722;
    }

    .md-app .jenkins .md-content.md-theme-default {
        height: auto !important;
    }

</style>

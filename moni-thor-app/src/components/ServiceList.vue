<template>
    <div class="list">
        <div class=" md-toolbar" style="height: 50px;">
            <span>
                <h2>Services</h2>
            </span>
        </div>
        <div>
            <div class="md-layout" md-gutter>
                <div class="md-layout-item" md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                    <md-field>
                        <label>Filter</label>
                        <md-input v-model="filter"></md-input>
                        {{filteredServices.length}} results
                    </md-field>
                </div>
                <div class="md-layout-item" md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                </div>
                <div class="md-layout-item" md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                    <md-field>
                        <label for="server">Server</label>
                        <md-select id="server" v-model="serverFilter" name="server">
                            <md-option :value="null"></md-option>
                            <md-option v-for="server in serverWrapper.servers" :value="server">{{server}}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout-item" md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                </div>
                <div class="md-layout-item" md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                    <md-button class="md-raised md-accent" v-on:click="serverFilter = null;filter = null;">
                        Clear filters
                        <md-icon>clear</md-icon>
                    </md-button>
                </div>
            </div>
        </div>
        <div>
            <md-list>
                <div class="md-layout" md-gutter style="background-color: #f7f7f7;">
                    <div class="md-layout-item md-xsmall-size-100 md-small-size-50 md-medium-size-50 md-large-size-33 md-xlarge-size-20"
                               md-gutter v-for="service,idx in filteredServices"
                               style="padding-bottom: 15px;padding-right: 15px;">
                        <md-card style="width: 100%;">
                            <md-card-header class="  md-toolbar">
                                <div class="md-title">{{service.serviceName}}
                                </div>
                                <span style="position: absolute;right: 10px;top: 2px;">{{formatDate(service.meta.updated)}}</span>
                                <md-button class="md-fab md-mini md-fab-bottom-right md-accent"
                                           v-on:click="openService(service)"
                                           style="margin: -15px;    right: 70px;">
                                    <md-tooltip>Zoom</md-tooltip>
                                    <md-icon>more_horiz</md-icon>
                                </md-button>
                                <md-button class="md-fab md-mini md-fab-bottom-right md-accent"
                                           v-on:click="pingService(service)"
                                           style="margin: -15px;">
                                    <md-tooltip>Refresh data</md-tooltip>
                                    <md-icon>refresh</md-icon>
                                </md-button>
                            </md-card-header>
                            <md-card-content>
                                <div style="padding-top: 20px;">
                                    <md-progress md-indeterminate class="md-primary"
                                                 v-if="service.loading"></md-progress>
                                </div>
                                <md-list v-if="!service.loading">
                                    <md-list-item v-for="server in service.servers"
                                                  v-bind:class="{'md-accent' : service.showGraph === server.host}"
                                                  v-on:click="changeServer(service,server)">
                                        <label>
                                            {{server.host}}
                                        </label>
                                        <span style="flex: 1 1 0%;"></span>
                                        <md-button class="md-raised md-primary"
                                                   v-if="server.responding && server.info.build"
                                        >{{server.info.build.version}}
                                            <md-tooltip>{{getCounter(server.metrics)}}</md-tooltip>
                                        </md-button>
                                        <md-button class=""
                                                   v-if="server.responding && !server.info.build"
                                        > No Version
                                        </md-button>
                                        <span>
                                            <span>
                                              <md-icon v-if="server.responding" class="green">graphic_eq</md-icon>
                                              <md-icon v-if="!server.responding" class="red">portable_wifi_off</md-icon>
                                              <md-spinner :md-size="20" v-if="server.pending"
                                                          md-indeterminate></md-spinner>
                                            </span>
                                        </span>
                                    </md-list-item>
                                </md-list>
                            </md-card-content>
                        </md-card>
                    </div>
                </div>
            </md-list>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Vue from 'vue'
    import ResponseTimeChart from './charts/ResponseTimeChart';

    export default {
        components: {
            ResponseTimeChart
        },
        name: 'list',
        data() {
            return {
                services: null,
                filterResponding: null,
                serverFilter : null,
                filter: '',
                server: 'http://intranettestinfo7/',
                serverWrapper: {
                    servers: []
                },
                loading: false
            }
        },
        computed: {
            filteredServices() {
                if (this.services) {
                    return this.services.filter((service) => {
                        return ((this.filterResponding === null) || service.responding === this.filterResponding)
                            && ((!this.filter) || this.getUrl(service).includes(this.filter))
                            && ((!this.serverFilter) || service.servers.filter((server) => server.host === this.serverFilter && server.responding).length > 0)
                    });
                }
                return [];
            }
        },
        methods: {
            changeServer(service, server) {
                service.showGraph = server.host
                this.$forceUpdate();
            },
            formatDate(timestamp) {
                let date = new Date(timestamp);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
            },
            getUrl(service) {
                return (service.serverHost || '') + (service.serviceName || '') + (service.serviceToCall || '');
            },
            clearFilters() {
                this.filterResponding = null;
                this.filter = '';
            },
            pingService(service) {
                service.loading = true;
                this.$forceUpdate();
                axios.get(`/api/services/ping?service=${service.serviceName}`)
                    .then((response) => {
                        service.servers = response.data.servers;
                        service.meta = response.data.meta;
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .then(() => {
                        service.loading = false;
                        this.$forceUpdate();
                    })
            },
            openService(service){
                this.$router.push('/services/'+service.$loki);
            },
            getCounter(metrics) {
                if(metrics) {
                    let asArray = Object.keys(metrics).filter((key) => key.startsWith('counter'))
                        .reduce((obj, key) => {
                            obj.push(metrics[key]);
                            return obj;
                        }, []);
                    if(asArray.length === 0){
                        return null;
                    }
                    return asArray
                        .reduce((a, b) => a + b);
                }
            },

        },
        mounted() {
            axios.get(`/api/services`)
                .then((response) => {
                    this.services = response.data || [];
                })
                .catch((error) => console.error(error));
            axios.get(`/api/servers`)
                .then((response) => {
                    this.serverWrapper = response.data || {
                        servers: []
                    };
                })
                .catch((error) => console.error(error));

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .md-list-item .md-icon.green,
    .green{
        color: #00cb4b;
    }

    .md-list-item .md-icon.red,
    .red{
        color: #cb2832;
    }

    li.md-list-item.odd {
        background-color: #f7f7f7;
    }

    li.md-list-item {
        margin: 0px;
    }
</style>

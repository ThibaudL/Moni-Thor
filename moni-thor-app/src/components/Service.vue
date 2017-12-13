<template>
    <div class="list">
        <md-layout md-gutter>
            <md-layout md-flex-xsmall="100" md-flex-large="40" md-flex-xlarge="40" md-row>
                <div style="width: 100%">
                    <md-card style="width: 100%;">
                        <md-card-header class="  md-toolbar">
                            <div class="md-title">{{service.serviceName}}
                            </div>
                            <span style="position: absolute;right: 10px;top: 2px;"
                                  v-if="service.meta">{{formatDate(service.meta.updated)}}</span>
                            <md-button class="md-fab md-mini md-fab-bottom-right md-accent"
                                       v-on:click="deleteService(service)"
                                       style="margin: -15px;    right: 70px;top: 40px;">
                                <md-tooltip>Supprimer</md-tooltip>
                                <md-icon>delete</md-icon>
                            </md-button>
                            <md-button class="md-fab md-mini md-fab-bottom-right md-accent"
                                       v-on:click="pingService(service)"
                                       style="margin: -15px;top: 40px;">
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
                                        <md-tooltip md-direction="left">
                                            {{server.info.build}}
                                        </md-tooltip>
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
                            <div v-for="server in service.servers" style="text-align: left"
                                           v-if="service.showGraph === server.host && !service.loading && server.env && service.servers.length > 0">
                                <div >
                                    <ul style="display: grid">
                                        <li>Profiles : {{arrayToStringList(server.env.profiles)}}</li>
                                        <li v-for="config in getApplicationConfig(server.env)">
                                            <span style="text-decoration: underline">{{config.key}}</span>
                                            <ul style="display: grid">
                                                <li v-for="property in config.value" style="word-break: break-all;">
                                                    <strong>{{property.key}}:</strong>{{property.value}}
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </md-card-content>
                    </md-card>
                </div>
            </md-layout>
            <md-layout md-flex-xsmall="100" md-flex-large="60" md-flex-xlarge="60" md-row>
                <div v-for="server in service.servers" style="width: 100%;"
                     v-if="service.showGraph === server.host && !service.loading && server.metrics">
                    <div>
                        <h3>{{server.host}}</h3>
                        <span>Metrics last update : {{formatDate(service.meta.updated)}}</span>
                    </div>
                    <div>
                        <md-layout md-gutter>
                            <md-layout md-flex-xsmall="100" md-flex-large="30" md-flex-xlarge="30" md-row>
                                Nb request : {{getCounter(server.metrics)}}
                                &nbsp;/&nbsp;
                                Distinct request : {{getDistinctCounter(server.metrics)}}
                            </md-layout>
                            <md-layout md-flex-xsmall="100" md-flex-large="10" md-flex-xlarge="10"
                                       md-row></md-layout>
                            <md-layout md-flex-xsmall="100" md-flex-large="20" md-flex-xlarge="20" md-row>
                                Uptime : {{uptime(server.metrics.uptime)}}
                            </md-layout>
                            <md-layout md-flex-xsmall="100" md-flex-large="10" md-flex-xlarge="10"
                                       md-row></md-layout>
                            <md-layout md-flex-xsmall="100" md-flex-large="30" md-flex-xlarge="30" md-row>
                                Cache : {{getCache(server.metrics)}}
                            </md-layout>
                        </md-layout>
                    </div>
                    <div
                            v-if="service.showGraph === server.host && !service.loading && server.metrics">
                        <div style="margin: 25px;">
                            Response time :
                        </div>

                        <response-time-chart :service="service.serviceName" :server="server"
                                             :limit="limit"></response-time-chart>

                        <div style="margin: 25px;">
                            Counters :
                        </div>
                        <counter-chart :service="service.serviceName" :server="server"
                                       :limit="limit"></counter-chart>
                        <div v-if="service.showGraph === server.host && !service.loading && !server.metrics">
                            No metrics, you might need to refresh datas.
                        </div>
                    </div>
                </div>

            </md-layout>
        </md-layout>
    </div>
</template>

<script>
    import axios from 'axios';
    import Vue from 'vue'
    import ResponseTimeChart from './charts/ResponseTimeChart';
    import CounterChart from './charts/CounterChart';

    export default {
        components: {
            ResponseTimeChart,
            CounterChart
        },
        name: 'Service',
        props: ['serviceId'],
        data() {
            return {
                limit: null,
                service: {},
                filterResponding: null,
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
//                return date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes();
                return date.toLocaleString();
            },
            uptime(timestamp) {
                let date = new Date(timestamp);
                return (date.getDate() - 1) + ' days, ' + (date.getHours() - 1) + ' hours and ' + (date.getMinutes() - 1) + ' minutes';
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
            getCounter(metrics) {
                if (metrics) {
                    let asArray = Object.keys(metrics).filter((key) => key.startsWith('counter'))
                        .reduce((obj, key) => {
                            obj.push(metrics[key]);
                            return obj;
                        }, []);
                    if (asArray.length === 0) {
                        return null;
                    }
                    return asArray
                        .reduce((a, b) => a + b);
                }
            },
            getDistinctCounter(metrics) {
                return Object.keys(metrics).filter((key) => key.startsWith('counter')).length
            },
            getCache(metrics) {
                let map = Object.keys(metrics).filter((key) => key.startsWith('cache'))
                    .reduce((obj, key) => {
                        obj.push({key: key.replace('cache.', '').replace('.size', ''), value: metrics[key]});
                        return obj;
                    }, [])
                    .map((cache) => cache.key + ':' + cache.value);
                let asArrayOfString = Object.keys(metrics).filter((key) => key.startsWith('cache'))
                    .reduce((obj, key) => {
                        obj.push({key: key.replace('cache.', '').replace('.size', ''), value: metrics[key]});
                        return obj;
                    }, [])
                    .map((cache) => cache.key + ':' + cache.value);
                if (asArrayOfString.length > 0) {
                    return asArrayOfString
                        .reduce((a, b) => a + ', ' + b);
                }
            },
            deleteService(service) {
                axios.delete(`/api/services/${service.$loki}`)
                    .catch((error) => console.error(error))
                    .then(() => this.$router.push('/services'));
            },
            arrayToStringList(anArray){
                return anArray.reduce((a,b) => a+', '+b);
            },
            getApplicationConfig(env){
                return Object.keys(env)
                    .filter((key) => key.startsWith("applicationConfig"))
                    .reduce((obj,key) => {
                        obj.push({key: key, value: this.objectToArray(env[key])});
                        return obj;
                    }, [])
            },
            objectToArray(obj){
                return Object.keys(obj)
                    .reduce((o,key) => {
                        o.push({key,value : obj[key]})
                        return o;
                    }, []);
            }
        },
        mounted() {
            axios.get(`/api/services/${this.serviceId}`)
                .then((response) => {
                    this.service = response.data;
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
    .green {
        color: #00cb4b;
    }

    .md-list-item .md-icon.red,
    .red {
        color: #cb2832;
    }

    li.md-list-item.odd {
        background-color: #f7f7f7;
    }

    li.md-list-item {
        margin: 0px;
    }
</style>

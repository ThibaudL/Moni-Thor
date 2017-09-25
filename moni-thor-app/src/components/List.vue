<template>
    <div class="list">
        <md-whiteframe class="md-theme-default md-toolbar" style="height: 50px;">
            <span>
                <h2>Services</h2>
            </span>
            <md-button md-open="hover" md-direction="left"
                           class="md-fab md-mini md-fab-bottom-right md-warn"
                           style="top: 10px;"
                           v-on:click="pingAll(services)">
                <md-tooltip md-direction="top">Refresh</md-tooltip>
                <md-icon>refresh</md-icon>
            </md-button>
        </md-whiteframe>
        <md-whiteframe>
            <md-layout md-gutter>
                <md-layout md-flex-xsmall="100" md-flex-large="15" md-row>
                    <md-input-container>
                        <label>Filter</label>
                        <md-input v-model="filter"></md-input>
                    </md-input-container>
                    <md-input-container>
                        <label for="server">Server</label>
                        <md-select id="server" v-model="server" v-on:change="serverChanged()">
                            <md-option value="http://intranettestinfo4/">intranet test info 4</md-option>
                            <md-option value="http://intranettestinfo7/">intranet test info 7</md-option>
                            <md-option value="http://intranettestinfo8/">intranet test info 8</md-option>
                        </md-select>
                    </md-input-container>
                </md-layout>
            </md-layout>
            <md-speed-dial md-open="hover" md-direction="left"
                           class="md-fab-bottom-right "
                           style="top: 20px;">
                <md-button class="md-fab md-warn md-mini" md-fab-trigger
                           v-on:click="filterResponding = null"
                >
                    <md-tooltip md-direction="top">Connection filter</md-tooltip>
                    <md-icon md-icon-morph>close</md-icon>
                    <md-icon>filter_list</md-icon>
                </md-button>

                <md-button class="md-fab md-mini md-clean"
                           v-on:click="filterResponding = false"
                           v-bind:class="{'md-warn' : filterResponding === false}">
                    <md-tooltip md-direction="top">Offline</md-tooltip>
                    <md-icon class="red">portable_wifi_off</md-icon>
                </md-button>

                <md-button class="md-fab md-mini md-clean"
                           v-on:click="filterResponding =true"
                           v-bind:class="{'md-warn' : filterResponding === true}">
                    <md-tooltip md-direction="top">Online</md-tooltip>
                    <md-icon class="green">graphic_eq</md-icon>
                </md-button>
            </md-speed-dial>
        </md-whiteframe>
        <md-whiteframe>
            <md-list>
                <md-divider></md-divider>
                <md-list-item v-for="service,idx in filteredServices" v-bind:class="{odd : idx%2}">
                    <label>
                        {{getUrl(service)}}
                    </label>
                    <span style="flex: 1 1 0%;"></span>
                    <span>
            <span v-if="service.responding && service.time">{{service.time}} ms</span>
            <span>
              <md-icon v-if="!service.pending && service.responding" class="green">graphic_eq</md-icon>
              <md-icon v-if="!service.pending && !service.responding" class="red">portable_wifi_off</md-icon>
              <md-spinner :md-size="20" v-if="service.pending" md-indeterminate></md-spinner>
              <router-link :to="{ name: 'edit', params: { id: service.$loki }}">
                <md-icon>mode_edit</md-icon>
              </router-link>
              </span>
            </span>
                    <md-divider></md-divider>
                </md-list-item>
            </md-list>
        </md-whiteframe>
    </div>
</template>

<script>
    import axios from 'axios';
    import Vue from 'vue'

    export default {
        name: 'list',
        data() {
            return {
                services: null,
                filterResponding: null,
                filter: '',
                server: 'http://intranettestinfo7/'
            }
        },
        computed: {
            filteredServices() {
                return this.services.filter((service) => {
                    return ((this.filterResponding === null) || service.responding === this.filterResponding)
                        && ((!this.filter) || this.getUrl(service).includes(this.filter))
                });
            }
        },
        methods: {
            getUrl(service) {
                return (this.server || '') + (service.serviceName || '') + (service.serviceToCall || '');
            },
            clearFilters(){
                this.filterResponding = null;
                this.filter = '';
            },
            serverChanged(){
              this.clearFilters();
              this.pingAll(this.services);
            },
            async pingAll(services) {
                if (services && services.length > 0) {
                    for (const service of services) {
                        service.pending = true;
                        service.start = null;
                        service.end = null;
                        const start = new Date().getTime();
                        await axios.get(this.getUrl(service))
                            .then(() => {
                                const end = new Date().getTime();
                                service.time = end - start;
                                service.responding = true;
                            })
                            .catch(() => {
                                service.responding = false;
                            })
                            .then(() => {
                                service.pending = false;
                                this.$forceUpdate();
                            })
                    }
                }
            }
        },
        mounted() {
            axios.get(`/api/services`)
                .then((response) => {
                    this.services = response.data;
                    this.pingAll(this.services);
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

    .green {
        color: #00cb4b;
    }

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

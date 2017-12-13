<template>
  <div class="list">
    <md-app-toolbar>
            <span>
              <h2>Servers infos > Services > States</h2>
            </span>
      <md-button md-open="hover" md-direction="left"
                 class="md-fab md-mini md-fab-bottom-right md-accent"
                 style="top: 10px;"
                 v-on:click="pingAll(services)">
        <md-tooltip md-direction="top">Refresh</md-tooltip>
        <md-icon>refresh</md-icon>
      </md-button>
    </md-app-toolbar>
    <div>
      <div class="md-layout" md-gutter>
        <div class="md-layout-item">
          <md-field>
            <label>Filter</label>
            <md-input v-model="filter"></md-input>
            {{filteredServices.length}} results
          </md-field>
        </div>
        <div class="md-layout-item">
        </div>
        <div class="md-layout-item" v-if="serverWrapper.servers.length > 0">
          <md-field>
            <label for="s">Server</label>
            <md-select id="s" name="s" v-model="server" v-on:change="serverChanged()">
              <md-option v-for="server in serverWrapper.servers" :label="server" :value="server">{{server}}</md-option>
            </md-select>
          </md-field>
        </div>
      </div>
      <md-speed-dial md-open="hover" md-direction="left"
                     class="md-fab-bottom-right "
                     style="top: 20px;">

        <md-speed-dial-target @click="filterResponding">
          <md-icon class="md-morph-initial">filter_list</md-icon>
          <md-icon class="md-morph-final">close</md-icon>
        </md-speed-dial-target>


        <md-speed-dial-content>
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
        </md-speed-dial-content>
      </md-speed-dial>
    </div>
    <div>
      <div>
        <md-progress md-indeterminate class="md-primary" v-if="loading"></md-progress>
      </div>
      <md-list v-if="!loading">
        <md-divider></md-divider>
        <md-list-item v-for="service,idx in filteredServices" v-bind:class="{odd : idx%2}">
          <label>
            {{getUrl(service)}}
          </label>
          <span style="flex: 1 1 0%;"></span>
          <md-button class="md-raised md-primary"
                     v-if="service.responding && service.info.build"
          >{{service.info.build.version}}
            <md-tooltip md-direction="left">
              {{service.info.build}}
            </md-tooltip>
          </md-button>
          <span>
                        <span>
                          <md-icon v-if="!service.pending && service.responding" class="green">graphic_eq</md-icon>
                          <md-icon v-if="!service.pending && !service.responding"
                                   class="red">portable_wifi_off</md-icon>
                          <md-spinner :md-size="20" v-if="service.pending" md-indeterminate></md-spinner>
                          <router-link :to="{ name: 'edit', params: { id: service.$loki }}">
                            <md-icon>mode_edit</md-icon>
                          </router-link>
                        </span>
                    </span>
          <md-divider></md-divider>
        </md-list-item>
      </md-list>
    </div>
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
      getUrl(service) {
        return (service.serverHost || '') + (service.serviceName || '') + (service.serviceToCall || '');
      },
      clearFilters() {
        this.filterResponding = null;
        this.filter = '';
      },
      serverChanged() {
        this.clearFilters();
        this.pingAll(this.services);
      },
      pingAll() {
        this.loading = true;
        axios.get(`/api/services/ping/all?server=${this.server}`)
          .then((response) => {
            this.services = response.data;
          })
          .catch((error) => {
            console.error(error);
          })
          .then(() => {
            this.loading = false;
          })
      }
    },
    mounted() {
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

<template>
  <div class="list">
    <md-list>
      <md-divider></md-divider>
      <md-list-item v-for="server,idx in servers" v-bind:class="{odd : idx%2}">
        <label>
          Server : {{getUrl(server)}}
        </label>
        <span style="flex: 1 1 0%;"></span>
        <span>
          <md-icon v-if="!server.pending && server.responding" class="green">graphic_eq</md-icon>
          <md-icon v-if="!server.pending && !server.responding" class="red">portable_wifi_off</md-icon>
          <md-spinner :md-size="20" v-if="server.pending" md-indeterminate></md-spinner>
          <router-link :to="{ name: 'edit', params: { id: server.$loki }}">
            <md-icon>mode_edit</md-icon>
          </router-link>
          </span>
        <md-divider></md-divider>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue'

  export default {
    name: 'list',
    data() {
      return {
        servers: null
      }
    },
    methods: {
      getUrl(server) {
        return (server.serverHost || '') + (server.serviceName || '') + (server.serviceToCall || '');
      }
    },
    mounted() {
      axios.get(`/api/servers`)
        .then((response) => {
          this.servers = response.data;
          if (this.servers && this.servers.length > 0) {
            this.servers.forEach((server) => {
              server.pending = true;
              axios.get(this.getUrl(server))
                .then(() => {
                  server.responding = true;
                })
                .catch(() => {
                  server.responding = false;
                })
                .then(() => {
                  server.pending = false;
                  this.$forceUpdate();
                })
            });
          }
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
</style>

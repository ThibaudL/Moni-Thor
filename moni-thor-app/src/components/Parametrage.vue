<template>
  <div class="hello">
    <md-layout>
      <md-layout md-flex="10"></md-layout>
      <md-layout md-flex="35">
        <md-card style="width:100%;">
          <form v-on:submit="onSubmit()" @submit.prevent="">
            <md-card-header class=" md-theme-default  md-toolbar">
              <div class="md-title">Valeurs par défaut</div>
            </md-card-header>
            <md-card-content>
              <md-input-container>
                <label>Service name</label>
                <md-input v-model="settings.serviceName"></md-input>
              </md-input-container>

              <md-input-container>
                <label>Service to call</label>
                <md-input v-model="settings.serviceToCall"></md-input>
              </md-input-container>

            </md-card-content>
            <md-card-actions>
              <md-button class="md-raised md-warn" type="submit">
                Sauvegarder
              </md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-layout>
      <md-layout md-flex="5"></md-layout>
      <md-layout md-flex="45">
        <md-card style="width: 100%;">
          <md-card-header class=" md-theme-default  md-toolbar">
            <div class="md-title">Serveurs</div>
          </md-card-header>
          <md-card-content>
            <form @submit.prevent="">
              <md-chips v-model="serverWrapper.servers" md-input-placeholder="Add a server"></md-chips>
            </form>
          </md-card-content>
          <md-input-container>

          </md-input-container>

          <md-card-actions>
            <md-button md-align="end" md-vertical-align="end" class="md-raised md-warn" type="button" v-on:click="onSubmitServers()">
              Sauvegarder
            </md-button>
          </md-card-actions>
        </md-card>
      </md-layout>
      <md-layout md-flex="10"></md-layout>
    </md-layout>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'add-server',
    data() {
      return {
        settings: {
          serviceToCall: '',
          serviceName: ''
        },
        serverWrapper: {
          servers : []
        }
      }
    },
    mounted() {
      axios.get(`/api/settings`)
        .then((response) => {
          this.settings = response.data || {};
        })
        .catch((error) => console.error(error));
      axios.get(`/api/servers`)
        .then((response) => {
          this.serverWrapper= response.data || {
            servers : []
          };
        })
        .catch((error) => console.error(error));
    },
    methods: {
      onSubmit() {
        axios.post(`/api/settings`, this.settings)
          .catch((error) => console.error(error))
          .then(() => this.$router.push('/'));
      },
      onSubmitServers() {
        axios.post(`/api/servers`, this.serverWrapper)
          .catch((error) => console.error(error))
          .then(() => this.$router.push('/'));
      }
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
</style>

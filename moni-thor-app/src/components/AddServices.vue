<template>
  <div class="hello">
    <md-layout>
      <md-layout md-flex="20"></md-layout>
      <md-layout md-flex="20">
        <md-card>
          <form v-on:submit="onSubmit()" @submit.prevent="">
            <md-card-header class=" md-theme-default md-toolbar">
              <div class="md-title">Ajouter un service</div>
            </md-card-header>

            <md-card-content>

              <md-input-container>
                <label>Service name</label>
                <md-input v-model="serviceName"></md-input>
              </md-input-container>

              <md-input-container>
                <label>Service to call</label>
                <md-input v-model="serviceToCall"></md-input>
              </md-input-container>
            </md-card-content>
            <md-card-actions>
              <md-button class="md-fab md-mini" type="submit">
                <md-icon>add</md-icon>
                <md-tooltip md-direction="top">Ajouter</md-tooltip>
              </md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-layout>
      <md-layout md-flex="60">
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
  import MdCardContent from "../../node_modules/vue-material/src/components/mdCard/mdCardContent.vue";
  import axios from 'axios';

  export default {
    components: {MdCardContent},
    name: 'add-server',
    data() {
      return {
        serviceToCall: '',
        serviceName: ''
      }
    },
    mounted() {
      axios.get(`/api/settings`)
        .then((response) => {
          this.serviceToCall = response.data.serviceToCall || '';
          this.serviceName = response.data.serviceName || '';
        })
        .catch((error) => console.error(error));
    },
    methods: {
      onSubmit: function () {
        axios.post(`/api/services`, {
          serviceToCall: this.serviceToCall,
          serviceName: this.serviceName
        })
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

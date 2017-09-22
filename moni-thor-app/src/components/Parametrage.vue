<template>
    <div class="hello">
        <md-layout>
            <md-layout md-flex="20"></md-layout>
            <md-layout md-flex="60">
                <md-card>
                    <form v-on:submit="onSubmit()">
                        <md-card-header class=" md-theme-default  md-toolbar">
                            <div class="md-title">Valeurs par défaut</div>
                        </md-card-header>

                        <md-card-content>

                            <md-input-container>
                                <label>Server host</label>
                                <md-input v-model="settings.serverHost"></md-input>
                            </md-input-container>

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
                            <md-button class="md-raised md-accent" type="submit">
                                Sauvegarder
                            </md-button>
                        </md-card-actions>
                    </form>
                </md-card>
            </md-layout>
            <md-layout md-flex="20"></md-layout>
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
                settings: {
                    serverHost: '',
                    serviceToCall: '',
                    serviceName: ''
                }
            }
        },
        mounted() {
            axios.get(`/api/settings`)
                .then((response) => {
                    this.settings = response.data || {};
                })
                .catch((error) => console.error(error));
        },
        methods: {
            onSubmit() {
                console.log(this.settings);
                axios.post(`/api/settings`, this.settings)
                .then((response) => {
                    this.settings = response.data;
                })
                .catch((error) => console.error(error));
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

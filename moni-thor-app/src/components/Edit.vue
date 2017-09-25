<template>
    <div class="hello">
            <md-layout>
                <md-layout md-flex="20"></md-layout>
                <md-layout md-flex="60">
                    <md-card>
                        <form v-on:submit="onSubmit()" @submit.prevent="">
                            <md-card-header class=" md-theme-default md-toolbar">
                                <div class="md-title">Service {{id}}</div>
                            </md-card-header>

                            <md-card-content>

                                <md-input-container>
                                    <label>Service name</label>
                                    <md-input v-model="server.serviceName"></md-input>
                                </md-input-container>

                                <md-input-container>
                                    <label>Service to call</label>
                                    <md-input v-model="server.serviceToCall"></md-input>
                                </md-input-container>
                            </md-card-content>
                            <md-card-actions>
                                <md-button class="md-raised md-accent" type="button" v-on:click="deleteServer()">
                                    <span>Supprimer</span>
                                </md-button>
                                <md-button class="md-raised md-primary" type="submit">
                                    <span>Sauvegarder</span>
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
        name: 'edit-service',
        props: ['id'],
        data() {
            return {
                server: {}
            }
        },
        mounted() {
            axios.get(`/api/services/${this.id}`)
                .then((response) => {
                    this.server = response.data;
                })
                .catch((error) => console.error(error));
        },
        methods: {
            onSubmit() {
                axios.post(`/api/services`, this.server)
                    .catch((error) => console.error(error))
                    .then(() => this.$router.push('/'));
            },
            deleteServer() {
                axios.delete(`/api/services/${this.id}`)
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

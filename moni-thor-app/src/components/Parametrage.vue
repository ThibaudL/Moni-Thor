<template>
    <div class="hello">
        <div class="md-layout">
            <div class="md-layout-item md-size-10" ></div>
            <div class="md-layout-item md-size-35" >
                <md-card style="width:100%;">
                    <form v-on:submit="onSubmit()" @submit.prevent="">
                        <md-card-header class="   md-toolbar">
                            <div class="md-title">Valeurs par défaut  (Shared Setting)</div>
                        </md-card-header>
                        <md-card-content>
                            <md-field>
                                <label>Service name</label>
                                <md-input v-model="settings.serviceName"></md-input>
                            </md-field>

                            <md-field>
                                <label>Service to call</label>
                                <md-input v-model="settings.serviceToCall"></md-input>
                            </md-field>

                        </md-card-content>
                        <md-card-actions>
                            <md-button class="md-raised md-primary" type="submit">
                                Sauvegarder
                            </md-button>
                        </md-card-actions>
                    </form>
                </md-card>
            </div>
            <div class="md-layout-item md-size-5" ></div>
            <div class="md-layout-item md-size-45" >
                <md-card style="width: 100%;">
                    <md-card-header class="   md-toolbar">
                        <div class="md-title">Serveurs (Shared Setting)</div>
                    </md-card-header>
                    <md-card-content>
                        <form @submit.prevent="">
                            <md-chips v-model="serverWrapper.servers" md-input-placeholder="Add a server"></md-chips>
                        </form>
                    </md-card-content>
                    <md-field>

                    </md-field>

                    <md-card-actions>
                        <md-button md-align="end" md-vertical-align="end" class="md-raised md-primary" type="button"
                                   v-on:click="onSubmitServers()">
                            Sauvegarder
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
            <div class="md-layout-item md-size-5" ></div>
        </div>
        <div class="md-layout">
            <div class="md-layout-item md-size-10" ></div>
            <div class="md-layout-item md-size-35" >
                <md-card style="width: 100%;">
                    <md-card-header class="   md-toolbar">
                        <div class="md-title">Jenkins (Local Setting)</div>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <md-chips v-model="jenkinsSettings.views" md-input-placeholder="Add a view"></md-chips>
                        </md-field>
                    </md-card-content>
                    <md-card-actions>
                        <md-button md-align="end" md-vertical-align="end" class="md-raised md-primary" type="button"
                                   v-on:click="onSubmitJenkins()">
                            Sauvegarder
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
            <div class="md-layout-item md-size-45" ></div>
        </div>
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
                jenkinsSettings: {
                    user: '',
                    views: []
                },
                serverWrapper: {
                    servers: []
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
                    this.serverWrapper = response.data || {
                        servers: []
                    };
                })
                .catch((error) => console.error(error));
            let jenkinsSettings = window.localStorage.getItem('jenkinsSettingsV2');
            if (jenkinsSettings) {
                this.jenkinsSettings = JSON.parse(jenkinsSettings);
            }else{
                this.jenkinsSettings.views = ['Sinistre@T_LAMARCHE', 'Contrats@T_LAMARCHE', 'Ged@T_LAMARCHE', 'Directives@T_LAMARCHE', 'Partenaires@T_LAMARCHE', 'Siveer@T_LAMARCHE', 'Framework@T_LAMARCHE'];
            }
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
            },
            onSubmitJenkins() {
                window.localStorage.setItem('jenkinsSettingsV2', JSON.stringify(this.jenkinsSettings));
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

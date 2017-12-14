<template>
    <div class="page-container app md-theme-default">
        <md-app>
            <md-app-toolbar style="height: 65px;  display: flex;    flex-direction: row-reverse;">
                <h2>Utilisateur : {{JenkinsStore.ldapUser}}</h2>
            </md-app-toolbar>
            <md-app-drawer md-permanent="full" style="position: fixed;color : white;">
                <div style="text-align: center">
                    <img class="logo" src="./assets/hammer3.png">
                    <h1>Moni-Thor</h1>
                </div>
                <md-list>
                    <md-list-item v-on:click="go('/')" v-bind:class="{ 'active': isRoute('home') }">
                        <md-icon>home</md-icon>
                        <span class="md-list-item-text">
                            Home
                        </span>
                    </md-list-item>
                    <md-list-item v-on:click="go('/jenkins')" v-bind:class="{ 'active': isRoute('jenkins') }">
                        <md-icon>rowing</md-icon>
                        <span class="md-list-item-text">
                            Jenkins
                        </span>
                        <span :class="myBuildsState()">
                            <i class="material-icons" v-if="myBuildsState() === 'ok'">check</i>
                            <i class="material-icons" v-if="myBuildsState() === 'bad'">add_alert</i>
                            <i class="material-icons" v-if="myBuildsState() === 'building'">refresh</i>
                        </span>
                    </md-list-item>
                    <md-list-item md-expand
                                  v-bind:class="{ 'active': isRoute('list') || isRoute('services') ||  isRoute('add') }">
                        <md-icon>view_list</md-icon>
                        <span class="md-list-item-text">Servers infos</span>
                        <md-list slot="md-expand">
                            <md-list-item class="md-inset" v-on:click="go('/list')"
                                          v-bind:class="{ 'active': isRoute('list') }">
                                <md-icon>view_list</md-icon>
                                <span class="md-list-item-text">
                                    States
                                </span>
                            </md-list-item>
                            <md-list-item class="md-inset" v-on:click="go('/services')"
                                          v-bind:class="{ 'active': isRoute('services') }">
                                <md-icon>featured_play_list</md-icon>
                                <span class="md-list-item-text">
                                    Services
                                </span>
                            </md-list-item>
                            <md-list-item class="md-inset" v-on:click="go('/add')"
                                          v-bind:class="{ 'active': isRoute('add') }">
                                <md-icon>add_circle</md-icon>
                                <span class="md-list-item-text">
                                    Add
                                </span>
                            </md-list-item>
                        </md-list>
                    </md-list-item>
                    <md-list-item v-on:click="go('/settings')" v-bind:class="{ 'active': isRoute('settings') }">
                        <md-icon>settings</md-icon>
                        <span class="md-list-item-text">
                            Settings
                        </span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>
            <md-app-content style="min-height: calc(-65px + 100vh);margin-left: 230px;">
                <div>
                    <router-view></router-view>
                    <!--<md-bottom-bar >-->
                    <!--<md-bottom-bar-item md-icon-src="/static/hammer.png">-->
                    <!--</md-bottom-bar-item>-->
                    <!--</md-bottom-bar>-->
                </div>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
    import JenkinsStore from "./store/JenkinsStore";

    export default {
        name: 'app',
        data() {
            return {
                JenkinsStore: JenkinsStore
            }
        },
        methods: {
            go(url) {
                this.$router.push(url);
            },
            isRoute(route) {
                return this.$route.name === route;
            },
            myBuildsState() {
                if (JenkinsStore.builds && JenkinsStore.builds[JenkinsStore.builds.length - 1] && JenkinsStore.builds[JenkinsStore.builds.length - 1].jobs && JenkinsStore.builds[JenkinsStore.builds.length - 1].jobs.length > 0) {
                    let bad = JenkinsStore.builds[JenkinsStore.builds.length - 1].jobs.filter((job) => job.color.startsWith('red') || job.color.startsWith('yellow'));
                    let building = JenkinsStore.builds[JenkinsStore.builds.length - 1].jobs.filter((job) => job.color.includes('anime'));
                    return bad.length > 0 ? 'bad' : (building.length > 0 ? 'building' : 'ok');
                }
            }
        },
        mounted() {
            JenkinsStore.initUser().then(() => {
                JenkinsStore.initJenkins();
            });
        }
    }
</script>

<style lang="scss">
    @import "~vue-material/dist/theme/engine"; // Import the theme engine

    @include md-register-theme("default", (
            primary: md-get-palette-color(blue, A200), // The primary color of your application
            accent: md-get-palette-color(red, A200) // The accent or secondary color
    ));

    @import "~vue-material/dist/theme/all"; // Apply the theme
</style>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin: 15px;
    }

    .md-app {
    }

    .md-whiteframe {
        background-color: #f7f7f7;
        padding: 15px;
    }

    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }

    .md-app-drawer .md-list-item,
    .md-app-drawer .md-list md-theme-default,
    .app .md-drawer.md-theme-default {
        background-color: #3c4e59;
    }

    .md-app-drawer .md-list-item.active {
        background-color: #be5065;
    }

    .md-app-drawer .md-list.md-theme-default .md-list-item-container,
    .md-app-drawer .md-icon.md-theme-default.md-icon-font {
        color: white;
    }

    .app .md-drawer.md-permanent-full .md-list {
        padding-bottom: 1px;
    }

    .app .logo {
        width: 65px;
        -webkit-transform: rotate(36deg);
        transform: rotate(57deg);
        margin-left: -110px;
    }

</style>
<style lang="scss">
    @import "~vue-material/dist/theme/engine"; // Import the theme engine

    @include md-register-theme("default", (
            primary: #be5065, // The primary color of your application
            accent: #3c4e59, // The accent or secondary color
            theme: light // This can be dark or light
    ));

    @import "~vue-material/dist/theme/all"; // Apply the theme
</style>
<style scoped>
    .app .ok {
        color: cornflowerblue;
    }

    .app .bad {
        color: darkred;
    }

    .app .building > i {
        /*background-image: -webkit-radial-gradient(20px 20px, circle cover, white, cornflowerblue);*/
        animation-name: spin;
        animation-duration: 3s; /* 3 seconds */
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
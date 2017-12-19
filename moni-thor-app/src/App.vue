<template>
    <div class="page-container app md-theme-default">
        <md-app>
            <md-app-toolbar class="md-disabled">
                <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
                    <md-icon>menu</md-icon>
                </md-button>
                <div class="md-toolbar-section-end">
                    <h4>Utilisateur : {{JenkinsStore.ldapUser}}</h4>
                </div>
            </md-app-toolbar>
            <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
                <md-toolbar class="md-transparent" md-elevation="0">
                    <div class="md-title">
                        <img class="logo" src="./assets/thor-hammer-logo.png" width="80">
                        <h3>Moni-Thor</h3>
                    </div>
                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <md-icon>keyboard_arrow_left</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>
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
            <md-app-content>
                <div>
                    <router-view></router-view>
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
                JenkinsStore: JenkinsStore,
                menuVisible: true
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
            },
            toggleMenu () {
                this.menuVisible = !this.menuVisible
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
            primary: #be5065, // The primary color of your application
            accent: #3c4e59, // The accent or secondary color
            theme: light // This can be dark or light
    ));

    @import "~vue-material/dist/theme/all"; // Apply the theme
    @import "./assets/styles"; // Specific style
</style>
<style scoped>
    .app .md-list.md-theme-default .md-list-item-container:not(.md-list-item-default):not([disabled]):hover{
        color: white;
    }

    .app .ok {
        color: cornflowerblue;
    }

    .app .bad {
        color: darkred;
    }

    .app .building > i {
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
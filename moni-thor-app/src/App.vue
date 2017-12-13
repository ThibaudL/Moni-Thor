<template>
    <div class="page-container app md-theme-default">
        <md-app >
            <md-app-toolbar style="height: 65px;margin-left: 230px;">
              <h1>Moni-Thor</h1>
            </md-app-toolbar>
            <md-app-drawer md-permanent="full" style="position: fixed;">
                <div >
                    <img class="logo" src="./assets/hammer3.png">
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
                    </md-list-item>
                    <md-list-item md-expand v-bind:class="{ 'active': isRoute('list') || isRoute('services') ||  isRoute('add') }">
                        <md-icon>view_list</md-icon>
                        <span class="md-list-item-text">Servers infos</span>
                        <md-list slot="md-expand">
                            <md-list-item class="md-inset" v-on:click="go('/list')" v-bind:class="{ 'active': isRoute('list') }">
                                <md-icon>view_list</md-icon>
                                <span class="md-list-item-text">
                                    States
                                </span>
                            </md-list-item>
                            <md-list-item class="md-inset" v-on:click="go('/services')" v-bind:class="{ 'active': isRoute('services') }">
                                <md-icon>featured_play_list</md-icon>
                                <span class="md-list-item-text">
                                    Services
                                </span>
                            </md-list-item>
                            <md-list-item class="md-inset" v-on:click="go('/add')" v-bind:class="{ 'active': isRoute('add') }">
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


    export default {
        name: 'app',
        methods: {
            go(url) {
                this.$router.push(url);
            },
            isRoute(route) {
                return this.$route.name === route;
            }
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
    .md-app-drawer .md-icon.md-theme-default.md-icon-font{
      color: white;
    }

  .app .md-drawer.md-permanent-full .md-list{
    padding-bottom: 1px;
  }

  .app .logo {
    width: 65px;
    -webkit-transform: rotate(36deg);
    transform: rotate(57deg);
    margin-left: 20px;
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

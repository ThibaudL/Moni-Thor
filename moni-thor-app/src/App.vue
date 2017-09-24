<template>
  <div>
    <md-toolbar class="md-left md-fixed">
      <div class="md-toolbar-container">
        <h1 class="md-title">Moni-Thor</h1>
        <span style="flex: 1 1 0%;"></span>
        <md-button v-on:click="go('/')" class="md-raised" v-bind:class="{ 'md-warn': isRoute('list') }">
          <md-icon>list</md-icon>
          List
        </md-button>
        <md-button v-on:click="go('/add')" class="md-raised " v-bind:class="{ 'md-warn': isRoute('add') }">
          <md-icon >add_circle</md-icon>
          Add
        </md-button>
        <md-button v-on:click="go('/settings')" class="md-raised" v-bind:class="{ 'md-warn': isRoute('settings') }">
          <md-icon>settings</md-icon>
          Settings
        </md-button>

        <img class="md-right" src="./assets/hammer.png" style="width: 100px;transform: rotate(76deg);padding:5px">
          <!--<md-button class="md-fab md-mini">-->
            <!--<md-icon>add</md-icon>-->
          <!--</md-button>-->
      </div>
    </md-toolbar>

    <div id="app">
      <router-view></router-view>
      <!--<md-bottom-bar >-->
        <!--<md-bottom-bar-item md-icon-src="/static/hammer.png">-->
        <!--</md-bottom-bar-item>-->
      <!--</md-bottom-bar>-->
    </div>
  </div>
</template>

<script>
  import MdBottomBarItem from "../node_modules/vue-material/src/components/mdBottomBar/mdBottomBarItem.vue";

  export default {
    components: {MdBottomBarItem},
    name: 'app',
    methods : {
      go(url){
        console.log(this.$router);
        this.$router.push(url);
      },
      isRoute(route){
        return this.$route.name === route;
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  /*.md-fab {*/
    /*margin: 0;*/
    /*position: absolute;*/
    /*bottom: -20px;*/
    /*left: 16px;*/
  /*}*/
</style>

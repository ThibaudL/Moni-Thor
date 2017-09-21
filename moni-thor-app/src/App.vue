<template>
  <div>
    <md-toolbar class="md-left md-fixed">
      <div class="md-toolbar-container">
        <h1 class="md-title">Moni-Thor</h1>
        <span style="flex: 1 1 0%;"></span>
        <img class="md-right" src="./assets/hammer.png" style="width: 100px;transform: rotate(76deg);padding:5px">
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
    name: 'app'
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
</style>

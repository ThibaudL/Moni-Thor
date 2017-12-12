<template>
    <div class="home">
        <md-app-toolbar class=" md-toolbar" style="height: 50px;">
            <span>
                <h2>Home</h2>
            </span>
        </md-app-toolbar>
        <div class="md-layout">
          <div class="md-layout-item md-size-50">
            <md-card>
              <md-card-header>
                Tutorial
              </md-card-header>
              <md-card-content>
                  <vue-markdown>{{test}}</vue-markdown>
              </md-card-content>
            </md-card>
          </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Vue from 'vue'
    import VueMarkdown from 'vue-markdown'

    export default {
        components : {
          'vue-markdown': VueMarkdown
        },
        name: 'home',
        data() {
            return {
              test : `>Test tutorial Markdown
                **test**
                i am a ~~tast~~ **test**.
              `
            }
        },
        computed: {
        },
        methods: {
        },
        mounted() {
        }
    }
</script>
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

  .home .md-card.md-theme-default{
    margin: 0;
  }

</style>

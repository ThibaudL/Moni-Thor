import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AddServer from '@/components/AddServer'
import Parametrage from '@/components/Parametrage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/add',
      name: 'add-server',
      component: AddServer
    },
    {
      path: '/settings',
      name: 'settings',
      component: Parametrage
    }
  ]
})

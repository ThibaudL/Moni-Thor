import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import AddServer from '@/components/AddServer'
import Parametrage from '@/components/Parametrage'
import Edit from '@/components/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: List
    },
    {
      path: '/add',
      name: 'add',
      component: AddServer
    },
    {
      path: '/settings',
      name: 'settings',
      component: Parametrage
    },
    {
      path: '/edit/:id',
      props: true,
      name: 'edit',
      component: Edit
    }
  ]
})

import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/List';
import AddServices from '@/components/AddServices';
import Parametrage from '@/components/Parametrage';
import Edit from '@/components/Edit';
import ServiceList from '@/components/ServiceList';
import Service from '@/components/Service';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: List
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceList
    },
    {
      path: '/services/:serviceId',
      props : true,
      name: 'service',
      component: Service
    },
    {
      path: '/add',
      name: 'add',
      component: AddServices
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

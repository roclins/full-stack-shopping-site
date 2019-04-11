import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../views/GoodsList'
import Cart from '../views/Cart'
import Address from '../views/Address'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'goodsList',
      component: GoodsList
    },
    {
      path:'/cart',
      mame:'cart',
      component:Cart
    },
    {
      path:'/address',
      name:'address',
      component:Address
    }
  ]
})

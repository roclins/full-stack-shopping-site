import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../views/GoodsList'
import Cart from '../views/Cart'
import Address from '../views/Address'
import OrderList from '../views/OrderList'
import OrderSuccess from '../views/OrderSuccess'
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
    },
    {
      path:'/orderlist',
      name:'orderlist',
      component:OrderList
    },
    {
      path:'/ordersuccess',
      name:'ordersuccess',
      component:OrderSuccess
    }
  ]
})

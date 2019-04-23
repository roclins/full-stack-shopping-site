// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import Infinite from 'vue-infinite-scroll'
import {currency} from './util/currency.js'
import Vuex from 'vuex'

import './assets/css/base.css';
import './assets/css/checkout.css';
import './assets/css/product.css';

Vue.use(Infinite)
Vue.use(VueLazyload,{
  loading: '/static/loading-svg/loading-bars.svg'
})
Vue.use(Vuex);

Vue.config.productionTip = false

Vue.filter("currency",currency)

const store = new Vuex.Store({
  state:{
    User:'',
    cartCount:0
  },
  mutations:{
    updateUser(state,newUser){
      state.User = newUser
    },
    updateCartCount(state,newCartCount){
      state.cartCount += newCartCount
    },
    initCartCount(state,initCartCount){
      state.cartCount = initCartCount
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 注意，这种简写的形式是key和value相同的情况下，
  //才能这样子，但关键是 key一般是固定的，如果value的值不是key，就要 store：store，
  //记住 key是固定的
  store,
  components: { App },
  template: '<App/>'
})

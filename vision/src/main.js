import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**
 * 配置axios
 */
import axios from "axios"
// 配置请求接口基准路径
axios.defaults.baseURL = "http://localhost:8000/api"
// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios

// 将全局echarts对象挂载到vue原型对象上
// 在别的组件中就能通过$.echarts使用了
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

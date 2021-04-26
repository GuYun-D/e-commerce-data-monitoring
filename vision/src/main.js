import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式文件
import './assets/css/global.less'
// 引入字体文件
import '../src/assets/font/iconfont.css'

// 引入socketService
import SocketService from './utils/socket_service'
// 对服务器的websocket进行连接
SocketService.Instance.connect()
/**
 * 将SocketService挂载到原型上
 * 组件要调用registerCallBack,unregisterCallBack,send这三个方法，所以将Instance挂载到原型
 */
Vue.prototype.$socket = SocketService.Instance

/**
 * 配置axios
 */
import axios from 'axios'
// 配置请求接口基准路径
axios.defaults.baseURL = 'http://localhost:3000/api'
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

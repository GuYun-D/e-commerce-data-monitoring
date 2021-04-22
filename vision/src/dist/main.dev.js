"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

require("./assets/css/global.less");

require("../src/assets/font/iconfont.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入全局样式文件
// 引入字体文件

/**
 * 配置axios
 */
// 配置请求接口基准路径
_axios["default"].defaults.baseURL = 'http://localhost:3000/api'; // 将axios挂载到vue的原型对象上

_vue["default"].prototype.$http = _axios["default"]; // 将全局echarts对象挂载到vue原型对象上
// 在别的组件中就能通过$.echarts使用了

_vue["default"].prototype.$echarts = window.echarts;
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');
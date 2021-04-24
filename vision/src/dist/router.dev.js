"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _SellerPage = _interopRequireDefault(require("./views/SellerPage.vue"));

var _TrendPage = _interopRequireDefault(require("./views/TrendPage.vue"));

var _MapPage = _interopRequireDefault(require("./views/MapPage.vue"));

var _RankPage = _interopRequireDefault(require("./views/RankPage.vue"));

var _HotPage = _interopRequireDefault(require("./views/HotPage.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/sellerpage',
  component: _SellerPage["default"]
}, {
  path: '/trendpage',
  component: _TrendPage["default"]
}, {
  path: '/mappage',
  component: _MapPage["default"]
}, {
  path: '/rankpage',
  component: _RankPage["default"]
}, {
  path: '/hotpage',
  component: _HotPage["default"]
}];
var router = new _vueRouter["default"]({
  routes: routes
});
var _default = router;
exports["default"] = _default;
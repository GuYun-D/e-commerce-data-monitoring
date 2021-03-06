import Vue from 'vue'
import Router from 'vue-router'
// import SellerPage from './views/SellerPage.vue'
// import TrendPage from './views/TrendPage.vue'
// import MapPage from './views/MapPage.vue'
// import RankPage from './views/RankPage.vue'
// import HotPage from './views/HotPage.vue'
// import StockPage from './views/StockPage.vue'
import ScreenPage from './views/ScreenPage.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  }, 
  // {
  //   path: '/sellerpage',
  //   component: SellerPage
  // }, {
  //   path: '/trendpage',
  //   component: TrendPage
  // }, {
  //   path: '/mappage',
  //   component: MapPage
  // }, {
  //   path: '/rankpage',
  //   component: RankPage
  // }, {
  //   path: '/hotpage',
  //   component: HotPage
  // }, {
  //   path: '/stockpage',
  //   component: StockPage
  // }, 
  {
    path: '/screen',
    component: ScreenPage
  }
]

const router = new Router({
  routes
})

export default router

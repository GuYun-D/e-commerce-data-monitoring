import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from './views/SellerPage.vue'
import TrendPage from './views/TrendPage.vue'
import MapPage from './views/MapPage.vue'

Vue.use(Router)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },{
    path: '/trendpage',
    component: TrendPage
  },{
    path: '/mappage',
    component: MapPage
  }
]

const router = new Router({
  routes
})

export default router

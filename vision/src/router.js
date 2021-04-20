import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from './views/SellerPage.vue'

Vue.use(Router)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  }
]

const router = new Router({
  routes
})

export default router

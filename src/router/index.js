import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("../views/Login.vue"),
  },
  {
    path: '/connect/facebook/redirect',
    name: 'facebook',
    component: () => import("../views/Facebook.vue"),
  },
  {
    path: '/connect/github/redirect',
    name: 'github',
    component: () => import("../views/Github.vue"),
  },
  {
    path: '/connect/:provider/redirect',
    name: 'github',
    component: () => import("../views/Provider.vue"),
  },
 
  {
    path: '/dtc/login',
    name: 'login',
    component: () => import("../views/Login.vue"),
  },
  {
    path: '/doclist',
    name: 'doclist',
    component: () => import("../views/DocList.vue"),
  },
  {
    path: '/paidlist',
    name: 'paidlist',
    component: () => import("../views/doctors/PaidList.vue")
  },
   {
    path: '/orderdetail',
    name: 'orderdetail',
    component: () => import("../views/doctors/OrderDetails.vue")
  },
  {
    path: '/file',
    name: 'file',
    component: () => import("../views/FileList.vue"),
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
  }
})

export default router

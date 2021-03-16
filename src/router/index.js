import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dochome',
    component: () => import("../views/doctors/DocHome.vue")
  },
  {
    path: '/home',
    name: 'dochome',
    component: () => import("../views/doctors/DocHome.vue")
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("../views/Login.vue"),
  },
  {
    path: '/connect/:provider/redirect',
    name: 'provides',
    component: () => import("../views/Provider.vue"),
  },
  {
    path: '/waitlist',
    name: 'waitlist',
    component: () => import("../views/doctors/WaitList.vue")
  },
  {
    path: '/asklist',
    name: 'asklist',
    component: () => import("../views/doctors/AskList.vue")
  },
  {
    path: '/historylist',
    name: 'historylist',
    component: () => import("../views/doctors/HistoryList.vue")
  },
  {
    path: '/incomelist',
    name: 'incomelist',
    component: () => import("../views/doctors/IncomeList.vue")
  },
  {
    path: '/orderdetail',
    name: 'orderdetail',
    component: () => import("../views/doctors/OrderDetails.vue")
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

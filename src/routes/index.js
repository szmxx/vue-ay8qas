import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import HomeView from '../views/Home.vue';
import AboutView from '../views/About.vue';
const constantRoutes = [
  {
    name: 'Home',
    path: '/',
    component: HomeView,
  },
  {
    name: 'About',
    path: '/about',
    component: AboutView,
  },
];
const router = new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
export default router;

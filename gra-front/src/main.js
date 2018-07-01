// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'


//使用iview
import iView from 'iview'
import 'iview/dist/styles/iview.css';
Vue.use(iView)
Vue.use(VueLazyload, {
  loading: '/static/load.gif'
})
Vue.use(infiniteScroll)

router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('jwt');
  // iView.LoadingBar.start();
  // if (token) {
  //   next();
  // } else {
  //   next('/login');
  // }
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

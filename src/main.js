import Vue from 'vue';
import router from './routes/index.js';
import App from './App';
new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
});

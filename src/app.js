import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Bounce from 'bounce.js';

import App from 'components/app.vue';
import Leaderboard from 'components/leaderboard.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);

require('./style.sass');

const routes = [
  {path: '/', component: App},
  {path: '/leaderboard', component: Leaderboard}
]

const router = new VueRouter({
  mode: 'hash',
  routes: routes
});

const v = new Vue({
  router: router,
  el: '#app',
  data: {
    window: window,
    app: {
      name: '<span class="think-fast">ThinkFast!</span>'
    }, loading: {
      reload : false
    }
  }, methods: {
    reload() {
      this.loading.reload = true;
      window.location.reload(false); //Reload from the cache: might save some time because network is slow
    }
  }
});

var b = new Bounce()
.scale({
  from: {x:1, y:1},
  to: {x:3,y:3}
})
.translate({
  from: {x:0,y:0},
  to: {x:0,y:50}
})
.define('bounce-pulse');

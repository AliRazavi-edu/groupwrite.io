// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import HomePage from './components/HomePage.vue'
import GamePage from './components/GamePage.vue'
import GameOverPage from './components/GameOverPage.vue'
import AdminPage from './components/AdminPage.vue'
import QueuePage from './components/QueuePage.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: HomePage },
  { path: '/game', component: GamePage },
  { path: '/admin', component: AdminPage },
  { path: '/queue', component: QueuePage },
  { path: '/gameover', component: GameOverPage }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({ routes })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router,
  components: { App }
})


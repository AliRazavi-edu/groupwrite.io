// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Home from './components/Home.vue'
import Game from './components/Game.vue'
import Admin from './components/Admin.vue'
import Queue from './components/Queue.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home },
  { path: '/game', component: Game },
  { path: '/admin', component: Admin },
  { path: '/queue', component: Queue }
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


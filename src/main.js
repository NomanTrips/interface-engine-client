import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import Dashboard from './components/Dashboard.vue'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  //render: h => h(App),
  router,
  template: '<App/>',
  components: { App, Dashboard }
})

import Vue from 'vue'
import Router from 'vue-router'
//import App from './App.vue'
import Dashboard from '../components/Dashboard.vue'
import Channel from '../components/Channel.vue'
import Messages from '../components/Messages.vue'
import Config from '../components/Config.vue'
import Messagedetail from '../components/MessageDetail.vue'
import Transformers from '../components/Transformers.vue'
import MessageModifier from '../components/MessageModifier.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/channel/:id',
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/messages is matched
          path: 'messages',
          component: Messages,

        },
        {
          path: 'messages/:messageid',
          component: Messagedetail,
        },
        {
          path: 'messagemodifier',
          component: MessageModifier,
        },
        {
          // UserPosts will be rendered inside User's <router-view>
          // when /user/:id/config is matched
          path: 'config',
          component: Config
        }
      ],
      name: 'Channel',
      component: Channel
    }
  ]
})

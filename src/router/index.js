import Vue from 'vue'
import Notifications from 'vue-notification'
import velocity      from 'velocity-animate'
import Router from 'vue-router'
//import App from './App.vue'
import Dashboard from '../components/Dashboard.vue'
import Channel from '../components/Channel.vue'
import Messages from '../components/Messages.vue'
import Config from '../components/Config.vue'
import Messagedetail from '../components/MessageDetail.vue'
import Transformers from '../components/Transformers.vue'
import MessageModifier from '../components/MessageModifier.vue'
import Templates from '../components/TemplateEditor.vue'

Vue.use(Router)
Vue.use(Notifications, { velocity })

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/scripttemplates',
      name: 'Templates',
      component: Templates
    },
    {
      // UserPosts will be rendered inside User's <router-view>
      // when /user/:id/config is matched
      path: '/channel/:id/config',
      component: Config
    },
    {
      path: '/channel/:id/messages',
      component: Messages
    },
    {
      path: '/channel/:id/messagemodifier',
      component: MessageModifier,
    },   
    /*
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
      ],
      name: 'Channel',
      component: Channel
    }
    */
  ]
})

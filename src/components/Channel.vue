<template>
  <div>
    <v-navigation-drawer app clipped fixed width="200"  v-model="drawer">
      <v-list>
        <v-list-tile v-for="item in navitems" :key="item.title" @click="navItem(item.title)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
       
      </v-list>
    </v-navigation-drawer>
    <router-view></router-view>
  </div>
</template>

<script>
import auth from '../auth/index';

export default {
  name: 'channel',
  data() {
    return {
            admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
      homePath: '/',
      navitems: [
        { icon: 'settings', title: 'Settings' },
        { icon: 'message', title: 'Messages'  },
        { icon: 'code', title: 'Scripts',   },
        { icon: 'storage', title: 'Storage', },
      ],
      subitems: [
        { icon: 'send', title: 'Send message' },
      ],
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  created() {
  },
  computed: {
    axiosConfig: function(){ // axios request config obj: headers, query params etc.
      return {
        params: {
          secret_token: auth.getToken()
        }
      }
    }
  },
  methods: {
    navItem: function (itemTitle){
      var vm = this;
      if (itemTitle == 'Settings'){
        vm.$router.push('/channel/' + this.$route.params.id + '/config');
      } else if (itemTitle == 'Messages'){
        vm.$router.push('/channel/' + this.$route.params.id + '/messages');
      } else if (itemTitle == 'Scripts'){
        vm.$router.push('/channel/' + this.$route.params.id + '/messagemodifier');
      } else if (itemTitle == 'Storage'){
        vm.$router.push('/channel/' + this.$route.params.id + '/storage');
      }
    }
  }
}
</script>

<style>
#navigation-1 a {
  text-decoration: none;
}
</style>
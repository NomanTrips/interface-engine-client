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
import axios from 'axios';
import Vue from 'vue';
import auth from '../auth/index'

export default {
  name: 'settings',
  data() {
    return {
      drawer: true,
      isExpanded: false,
      navitems: [
        { icon: 'code', title: 'Script templates' },
        { icon: 'account_circle', title: 'User accounts' },
        { icon: 'storage', title: 'Data truncation'  },
      ],
    }
  },
  created() {
    var vm = this; 
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
      if (itemTitle == 'Script templates'){
        vm.$router.push('/settings');
      } else if (itemTitle == 'Data truncation'){
        vm.$router.push('/datatruncation');
      } else if (itemTitle == 'User accounts'){
        vm.$router.push('/settings/useraccounts');
      }
    },

  },
  route: {
      // Check the users auth status before
      // allowing navigation to the route
      canActivate() {
        console.log('running auth check');
        return auth.user.authenticated
      }
    }
}
</script>
<style >

</style>

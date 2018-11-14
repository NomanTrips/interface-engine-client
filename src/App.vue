
<template>
  <div id="app" >
    <v-app :dark="isDarkTheme ? true : false">

    <v-toolbar app clipped-left v-if="! ($router.currentRoute.name == 'Login')">
      <div style="padding-right:15px;">
        <img style="height=24px;width:24px;" src="../public/artificial-intelligence.svg" alt="Interface engine logo">
      </div>
      <router-link v-bind:to="homePath" style="text-decoration:none;color:inherit;">
        <v-toolbar-title v-text="title" >
      </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div >
        <v-switch style="margin:auto;height:28px;width:150px;" v-bind:label="`Dark theme`" v-model="isDarkTheme" v-on:change="updateTheme()"></v-switch>
      </div>
      <v-btn icon @click="navSettings()">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
      <v-content>

        <router-view></router-view>
      </v-content>
      <v-footer app >
        <span>&copy; 2017</span>
      </v-footer>
    </v-app>
  </div>
</template>



<script>
import axios from 'axios';
import auth from './auth/index'

export default {
  
  name: 'app',
  data() {
    return {
      homePath: '/Dashboard',
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Interface engine',
      serverconfig: {isDarkTheme: false, globalVariables: []},
      isDarkTheme: false,
      navItems: [
        { icon: 'add', text: 'Add channel', path: '/channel/' + this.$route.params.id +'/messages' },
      ],
      items: [],
    }
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
  created() {
    var vm = this
    axios.get('http://localhost:3000/catalog/serverconfig', vm.axiosConfig)
      .then(function(response) {
        vm.serverconfig = response.data;
        vm.isDarkTheme = vm.serverconfig.isDarkTheme;
      });
  },
  methods: {
    navSettings: function (){
      this.$router.push('/settings');
    },
    updateTheme: function (){
      var vm = this;
      vm.serverconfig.isDarkTheme = vm.isDarkTheme;
      axios.post('http://localhost:3000/catalog/serverconfig/' + vm.serverconfig._id +'/update', vm.serverconfig, vm.axiosConfig)
        .then(function(response) {
          console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    } 
  }
}
</script>

<style>
.notification.n-light {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  font-size: 13px;
  padding: 10px 20px;
  color: #495061;
  background: #EAF4FE;
  border: 1px solid #D4E8FD;
  .notification-title {
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 10px;
    color: #2589F3;
  }
}

</style>


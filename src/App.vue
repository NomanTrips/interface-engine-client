
<template>
  <div id="app" >
    <v-app :dark="isDarkTheme ? true : false">
    <v-toolbar app>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <router-link v-bind:to="homePath" style="text-decoration:none;color:inherit;">
        <v-toolbar-title v-text="title" >
      </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div >
        <v-switch style="margin:auto;height:28px;width:150px;" v-bind:label="`Dark theme`" v-model="isDarkTheme" v-on:change="updateTheme()"></v-switch>
      </div>
      <v-btn icon @click="navScriptTemplates()">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer  app fixed :mini-variant="miniVariant" :clipped="true" v-model="drawer">
      <v-list>
        <v-btn v-on:click="createChannel()">
        Add Channel
        </v-btn>
      </v-list>
    </v-navigation-drawer>
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

export default {
  
  name: 'app',
  data() {
    return {
      homePath: '/',
      clipped: true,
      drawer: false,
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
  created() {
    var vm = this
    axios.get('http://localhost:3000/catalog/serverconfig')
      .then(function(response) {
        vm.serverconfig = response.data;
        vm.isDarkTheme = vm.serverconfig.isDarkTheme;
      });
  },
  methods: {
    navScriptTemplates: function (){
      this.$router.push('/scripttemplates');
    },
    createChannel: function () {
      var vm = this;
      axios.post('http://localhost:3000/catalog/channel/create')
        .then(function(response) {
          console.log(response.data);
          var id = response.data._id;
          console.log(id);
          vm.$router.push('channel/' + id);
        })

    },
    updateTheme: function (){
      var vm = this;
      vm.serverconfig.isDarkTheme = vm.isDarkTheme;
      axios.post('http://localhost:3000/catalog/serverconfig/' + vm.serverconfig._id +'/update', vm.serverconfig)
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


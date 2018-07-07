<template>
<div>
    <v-dialog v-model="importDialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Pick a channel file to import:</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newChannelName" name="input-3" label="New channel name:" value="Input text"></v-text-field>
          <input type="file" @change="loadTextFromFile" >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary @click="importChannel()">Import</v-btn>
          <v-btn  @click="importDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-system-bar status  clipped-left>          
      <v-layout row >       
        <div v-on:mouseover="showNotification = true" v-on:mouseleave="showNotification = false" class="pl-2">
        <v-icon  color="pink"
        >notifications</v-icon>
        </div>
        <transition name="fade" v-on:after-enter="isExpanded = true" v-on:after-leave="isExpanded = false">
        <div v-if="showNotification" 
             style="color:white;overflow: hidden;height: 24px;" 
             v-bind:class="{ expanded: isExpanded, errorColor: lastNotification.type == 'error', successColor: lastNotification.type == 'success' }"
             >
        {{lastNotification.title +' ' +lastNotification.text}}
        </div>
        </transition>
      
 
      </v-layout>
      <!--
      <div  @mouseenter="showNotification = true" @mouseleave="showNotification = false">
        <v-icon  color="pink">notifications</v-icon>
        </div>

        <div style="background-color:#E91E63;color:white;width:100%;">
          <transition name="slide">
    <div v-if="showNotification" >Generic boring stack trace here :/</div>

  </transition>
</div>
-->
    </v-system-bar>
        <v-navigation-drawer app clipped fixed width="200"  v-model="drawer">
      <v-list>
        <!--
        <v-btn v-on:click="createChannel()">
        Add Channel
        </v-btn>
    -->     
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
//import Dload from 'downloadjs/download.js';
//require("downloadjs")(data, strFileName, strMimeType);

export default {
  name: 'dashboard',
  data() {
    return {
      newChannelName: 'Enter new channel name here....',
      importedChannel: {},
      importDialog: false,
      drawer: true,
      isExpanded: false,
      showNotification: false,
      navitems: [
        { icon: 'list', title: 'Channels' },
        { icon: 'playlist_add', title: 'New channel' },
        { icon: 'unarchive', title: 'Import channel'  },
        { icon: 'language', title: 'Global variables'  },
      ],
      actionItems: [
        { title: 'View channel', event: this.showChannelDetail },
        { title: 'Delete', event: this.deleteChannel },
      ],
      items: [],
      dialog: false,
      successAlert: false,
      errorAlert: false,
      successText: '',
      errorText: '',
      lastNotification: {text:'', title:'No notifications....', type:''},
    }
  },
  created() {
    var vm = this; 
    setInterval(function () {
      vm.loadServerErrors();
    }.bind(this), 10000); 

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
    mouseLeave: function (){
      this.showNotification = false;
      console.log('runing leave');
    },
    setShowNotification: function (){
      this.showNotification = true;
    },
    showLastNotification: function ()  {
      var vm = this;
      vm.$notify(vm.lastNotification);
    },
    loadServerErrors: function () {
      var vm = this;
        axios.get('http://localhost:3000/catalog/servererrors', vm.axiosConfig)
        .then(function(response) {
          if (response.data.length > 0) {
            // Date trickery to compute if last error was within the last 30 seconds
            var d1 = new Date(response.data[response.data.length - 1].timestamp);
            var d2 = new Date(Date.now());
            var diff = d2 - d1;

            //console.log(Math.floor(diff / 1e3), 'seconds ago');
            if (Math.floor(diff / 1e3) < 10){
              vm.lastNotification = {
              group: 'foo',
              title: 'Channel error: ' + response.data[response.data.length - 1].channel.name,
              text: response.data[response.data.length - 1].err,
              type: 'error',
              width: '100%',
            };
              //vm.$notify(vm.lastNotification);
              vm.showNotification = true;
              setInterval(function () {
                vm.showNotification = false;
              }.bind(this), 5000);              
              //var notification = document.getElementById("notification");
              //notification.classList.add('expand');
            }
        
          }

        })
        .catch(function(error) {

        });
    },
    getChannels: function() {

    },
    navItem: function (itemTitle){
      var vm = this;
      if (itemTitle == 'New channel'){
        vm.createChannel();
      } else if (itemTitle == 'Import channel'){
        vm.displayImportModal();
      } else if (itemTitle == 'Global variables'){
        vm.$router.push('/globalvariables');
      } else if (itemTitle == 'Channels'){
        vm.$router.push('/');
      }
    },
    displayImportModal: function (){
      this.importDialog = true;
    },
    loadTextFromFile: function(ev){
      var vm = this;
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        vm.importedChannel = JSON.parse(e.target.result);
      }

      //this.$emit("load", e.target.result);
      reader.readAsText(file);
    },
    importChannel: function (){
      var vm = this;
      console.log(vm.importedChannel);
      vm.importedChannel.name = vm.newChannelName;
      var vm = this;
      axios.post('http://localhost:3000/catalog/channel/create', {}, vm.axiosConfig)
        .then(function(response) {
          var id = response.data._id;
          axios.post('http://localhost:3000/catalog/channel/' + id +'/update', vm.importedChannel, vm.axiosConfig)
          .then(function(response) {
          console.log(response);
          })
          .catch(function(error) {
          console.log(error);
          });
        })
      this.importDialog = false;
    },
    createChannel: function () {
      var vm = this;
      axios.post('http://localhost:3000/catalog/channel/create', {}, vm.axiosConfig)
        .then(function(response) {
          console.log(response.data);
          var id = response.data._id;
          console.log(id);
          vm.$router.push('/channel/' + id + '/config');
        })

    }
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
.fade-enter-active,
.fade-leave-active { transition: width 350ms }

.fade-enter { width: 0% }
.fade-enter-to { width: 100% }

.fade-leave {width: 100%}
.fade-leave-to { width: 0% }

.expanded {width: 100%}

.successColor {background-color:#00E676}

.errorColor {background-color:#E91E63}

.greenColor {color:#00E676}

.pinkColor {color:#E91E63}

.theme--light.icon.green {
    color:#00E676;
}

#notification {
  overflow: hidden;
  height: 24px;
    width: 24px;
    transition: width .3s;
    -webkit-transition: width 2s; /* Safari 3.1 to 6.0 */
}

#notification:hover {
    width: 100%;
}
</style>

<style lang="stylus">
  @import '../stylus/main'
</style>

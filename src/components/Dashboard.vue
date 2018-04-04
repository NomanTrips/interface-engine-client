<template>
  <div>
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
      <v-alert type="success" dismissible v-model="successAlert">
        {{successText}}
      </v-alert>
      <v-alert type="error" dismissible v-model="errorAlert">
        {{errorText}}
      </v-alert>
      <v-btn icon @click="navScriptTemplates()">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer  app fixed :mini-variant="miniVariant" :clipped="true" v-model="drawer">
      <v-list>
        <v-btn v-on:click="createChannel()">
        Add Channel
        </v-btn>
        <!--
        <v-list-tile v-for="(navItem, i) in navItems" :key="i" value="true">
          <div v-on:click="createChannel()">
            <v-list-tile-action>
              <v-icon  v-html="navItem.icon"></v-icon>
            </v-list-tile-action>
          </div>
        <v-list-tile-content>
          <v-list-tile-title v-text="navItem.text"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      -->
      </v-list>
    </v-navigation-drawer>
            <v-data-table v-bind:headers="headers" :items="items" hide-actions class="elevation-1" item-key="name">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>
                    <v-icon v-if="props.item.is_running" color="green">fiber_manual_record</v-icon>
                    <v-icon v-if="! props.item.is_running" color="red">fiber_manual_record</v-icon>
                  </td>
                  <td>{{ props.item.name }}</td>
                  <!--
                  <td class="text-xs-right">{{ props.item._id }}</td>
-->
                  <td class="text-xs-right">{{ props.item.description }}</td>
                  <!--
                  <td class="text-xs-right">{{ props.item.name }}</td>
                -->       
                  <td class="text-xs-right">{{ props.item.received }}</td>
                  <td class="text-xs-right">{{ props.item.sent }}</td>
                  <td class="text-xs-right">{{ props.item.error_count }}</td>
                  <td >
                    <v-btn icon>
                      <v-icon v-show="! props.expanded">expand_more</v-icon>
                      <v-icon v-show="props.expanded">expand_less</v-icon>
                    </v-btn>
                  </td>
             
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <div class="pl-2">
                <v-card flat class="grey lighten-2">
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon v-show="! props.item.is_running" @click="startChannel(props, props.item._id)">
                      <v-icon color="green">play_circle_filled</v-icon>
                    </v-btn>
                    <span>Start channel</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon v-show="props.item.is_running" @click="stopChannel(props, props.item._id);">
                      <v-icon color="red">pause_circle_filled</v-icon>
                    </v-btn>
                    <span>Stop channel</span>
                  </v-tooltip>
                  <v-btn small raised primary @click="navMessages(props.item._id)">
                    View messages
                  </v-btn>
                  <v-btn small raised primary @click="navConfig(props.item._id)">
                    Config
                  </v-btn>

                  <v-tooltip bottom>
                    <v-dialog slot="activator" v-model="dialog" persistent max-width="290" style="float: right;">
                      <v-btn slot="activator"  icon  >
                        <v-icon color="red" >delete</v-icon>
                      </v-btn>
                      <v-card>
                        <v-card-title class="headline">Are you sure you want to delete this channel?</v-card-title>
                        <v-card-text>All data associated with this channel including messages, config and scripts will be deleted.</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn primary color="red"  @click="deleteChannel(props.item._id)" @click.native="dialog = false">Okay</v-btn>
                        <v-btn  @click.native="dialog = false">Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <span>Delete channel</span>
                  </v-tooltip>
                </v-card>
                </div>
              </template>
            </v-data-table>

  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

export default {
  name: 'dashboard',
  data() {
    return {
      homePath: '/',
      headers: [
        { text: 'Status', value: 'status', align: 'left'},
        {
          text: 'Channel',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        //{ text: 'Id', value: 'id' },
        { text: 'Description', value: 'Description' },
        { text: 'Received', value: 'received' },
        { text: 'Sent', value: 'sent' },
        { text: 'Errors', value: 'errors' },
      ],
      navItems: [
        { icon: 'add', text: 'Add channel', path: '/channel/' + this.$route.params.id +'/messages' },
      ],
      actionItems: [
        { title: 'View channel', event: this.showChannelDetail },
        { title: 'Delete', event: this.deleteChannel },
      ],
      items: [],
      clipped: true,
      drawer: false,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Interface engine',
      dialog: false,
      successAlert: false,
      errorAlert: false,
      successText: '',
      errorText: '',
    }
  },
  created() {
    var vm = this
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channels')
      .then(function(response) {
        vm.items = response.data;
        //console.log(vm.items);
        vm.items.forEach(function(element) {
          axios.get('http://localhost:3000/catalog/channel/' + element._id +'/stats')
            .then(function(response) {
              console.log(response.data);
              if (response.data.length == 0){ // no stats for channel yet
                Vue.set(element, 'received', '-');
                Vue.set(element, 'sent', '-');
                Vue.set(element, 'error_count', '-');
              } else {
                Vue.set(element, 'received', response.data[0].received);
                Vue.set(element, 'sent', response.data[0].sent);
                Vue.set(element, 'error_count', response.data[0].error_count);
              }

            })
            .catch(function(error) {
              console.log(error);
            });        
        }, this);
      console.log(vm.items);
      })
      .catch(function(error) {
        console.log(error);
      });
      console.log(vm.items);
  },
  methods: {
    startChannel: function(props, id) {
      var vm = this;
      props.item.is_running = true;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/start')
        .then(function(response) {
          vm.successAlert = true;
          vm.successText = response.data;
        })
        .catch(function(error) {
          vm.errorAlert = true;
          vm.errorText = error.response.data.code;
          console.log(error.response);
        });
    },
    stopChannel: function(props, id) {
      props.item.is_running = false;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/stop')
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
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
    deleteChannel: function (id) {
      console.log(id);
      axios.post('http://localhost:3000/catalog/channel/' + id +'/delete', {})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    showChannelDetail: function(id) {
      console.log(id);
      this.$router.push('channel/' + id);
    },
    getChannels: function() {

    },
    navScriptTemplates: function (){
      this.$router.push('/scripttemplates');
    },
    navMessages: function (id){
      this.$router.push('/channel/' + id + '/messages');
    },
    navConfig: function (id){
      this.$router.push('/channel/' + id + '/config');
    }
  }
}
</script>

<style lang="stylus">
  @import '../stylus/main'
</style>
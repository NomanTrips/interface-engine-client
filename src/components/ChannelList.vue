<template>
  <div>
    <v-container style="float:left;padding:0px;"  >
    <v-layout row wrap>
      <v-flex >
  <div>
            <v-data-table v-bind:headers="headers" :items="items" hide-actions class="elevation-1" item-key="name">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td >
                    <v-btn icon>
                      <v-icon v-show="! props.expanded">expand_more</v-icon>
                      <v-icon v-show="props.expanded">expand_less</v-icon>
                    </v-btn>
                  </td>
                  <td>
                    <span v-if="props.item.is_running" class="greenColor">Running</span>
                    <span v-if="! props.item.is_running" class="pinkColor">Stopped</span>
                    <!--
                    <v-icon v-if="props.item.is_running" color="green">fiber_manual_record</v-icon>
                    <v-icon v-if="! props.item.is_running" color="red">fiber_manual_record</v-icon>
                    -->
                  </td>
                  <td>{{ props.item.name }}</td>
                  <!--
                  <td class="text-xs-right">{{ props.item._id }}</td>
-->
                  <td >{{ props.item.description }}</td>
                  <!--
                  <td class="text-xs-right">{{ props.item.name }}</td>
                -->       
                  <td >{{ props.item.received }}</td>
                  <td >{{ props.item.sent }}</td>
                  <td >{{ props.item.error_count }}</td>
             
                </tr>
              </template>
              <template slot="expand" slot-scope="props" >
                <div  >
                <v-card flat class="grey lighten-2">
                  <div class="pl-4">
                  <v-tooltip bottom>
                    <v-btn  slot="activator" icon v-show="! props.item.is_running" @click="startChannel(props, props.item._id)">
                      <v-icon color="green">play_circle_filled</v-icon>
                    </v-btn>
                    <span>Start channel</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon v-show="props.item.is_running" @click="stopChannel(props, props.item._id);">
                      <v-icon color="red">stop</v-icon>
                    </v-btn>
                    <span>Stop channel</span>
                  </v-tooltip>
                  <v-btn small raised @click="navMessages(props.item._id)">
                  <v-icon >message</v-icon>
                    Messages
                  </v-btn>
                  <v-btn small raised @click="navConfig(props.item._id)">
                  <v-icon >settings</v-icon>
                    Config
                  </v-btn>

                  <v-btn small raised @click="exportChannel(props.item._id)">
                    <v-icon >archive</v-icon>
                    Export
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
                  </div>
                </v-card>
                </div>
              </template>
            </v-data-table>

  </div>
            </v-flex >
    </v-layout >
  </v-container >
  </div>
</template>

<script>

import axios from 'axios';
import Vue from 'vue';
import auth from '../auth/index'

  export default {
    name: 'channellist',
    data () {
      return {
        headers: [
            { text: '', value: '', sortable: false, align: 'center'},
            { text: 'Status', value: 'status', sortable: false, align: 'left'},
            {
            text: 'Channel',
            align: 'left',
            sortable: false,
            value: 'name'
            },
            //{ text: 'Id', value: 'id' },
            { text: 'Description', value: 'Description', align: 'left' },
            { text: 'Received', value: 'received', align: 'left' },
            { text: 'Sent', value: 'sent', align: 'left' },
            { text: 'Errors', value: 'errors', align: 'left' },
        ],
        actionItems: [
            { title: 'View channel', event: this.showChannelDetail },
            { title: 'Delete', event: this.deleteChannel },
        ],
        items: [],
        dialog: false,
      }
    },
    computed: {
      axiosConfig: function(){ // axios request config obj: headers, query params etc.
        return {
          params: {
            secret_token: auth.getToken()
          }
        }
      },
      filteredMessages: function () {
        var vm = this;
        return vm.messages.filter(message => {
          if (! message.raw_data == null){
            return message.raw_data.toLowerCase().includes(vm.search.toLowerCase())
          } else {
            return vm.messages;
          }
          
        })

      }
    },
  created() {
    var vm = this;
    // Make a request for a user with a given ID
    //axios.get('http://localhost:3000/catalog/channels')
    var config = {
      params: {
        secret_token: auth.getToken()
        }
    };
    console.dir(config);
    axios.get('http://localhost:3000/catalog/channels', vm.axiosConfig)
      .then(function(response) {
        vm.items = response.data;
        //console.log(vm.items);
        vm.items.forEach(function(element) {
          axios.get('http://localhost:3000/catalog/channel/' + element._id +'/stats', vm.axiosConfig)
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
  },
  methods: {
    startChannel: function(props, id) {
      var vm = this;
      props.item.is_running = true;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/start', {}, vm.axiosConfig)
        .then(function(response) {
          vm.lastNotification = {
            group: 'foo',
            title: 'Success!: ',
            text: 'Channel started succesfully.',
            type: 'success'
          };
          //vm.$notify(vm.lastNotification);
          vm.showNotification = true;
          setInterval(function () {
            vm.showNotification = false;
          }.bind(this), 5000); 
        })
        .catch(function(error) {
          vm.lastNotification = {
            group: 'foo',
            title: 'Error: ',
            text: 'Failed to start channel.',
            type: 'error'
          };
          //vm.$notify(vm.lastNotification);
          vm.showNotification = true;
          setInterval(function () {
            vm.showNotification = false;
          }.bind(this), 5000); 
        });
         // vm.errorAlert = true;
          //vm.errorText = error.response.data.code;
          //console.log(error.response.data);
        
    },
    stopChannel: function(props, id) {
      var vm = this;
      props.item.is_running = false;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/stop', {}, vm.axiosConfig)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    deleteChannel: function (id) {
      var vm = this;
      axios.post('http://localhost:3000/catalog/channel/' + id +'/delete', {}, vm.axiosConfig)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    showChannelDetail: function(id) {
      this.$router.push('channel/' + id);
    },
    navMessages: function (id){
      this.$router.push('/channel/' + id + '/messages');
    },
    navConfig: function (id){
      this.$router.push( '/channel/' + id + '/config');
    },
    exportChannel: function (channelId){
      var vm = this;
      axios.get('http://localhost:3000/catalog/channel/' + channelId, vm.axiosConfig)
        .then(function(response) {
          var channelJson = response.data;
          var filename = 'interface-engine-' + response.data.name + '-channel.json';
          var channelJson = JSON.stringify(response.data);
          download(channelJson, filename, "application/json");
        })
        .catch(function(error) {
          console.log(error);
        });
            
    },
    
  }
  }
</script>


<style>

</style>
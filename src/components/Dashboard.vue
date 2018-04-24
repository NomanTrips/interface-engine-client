<template>
  <div>
    <v-system-bar status >          
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
                    <span v-if="props.item.is_running" style="color:green;">Running</span>
                    <span v-if="! props.item.is_running" style="color:red;">Stopped</span>
                    <!--
                    <v-icon v-if="props.item.is_running" color="green">fiber_manual_record</v-icon>
                    <v-icon v-if="! props.item.is_running" color="red">fiber_manual_record</v-icon>
                    -->
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
             
                </tr>
              </template>
              <template slot="expand" slot-scope="props" >
                <div class="pl-4" >
                <v-card flat class="grey lighten-2">
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon v-show="! props.item.is_running" @click="startChannel(props, props.item._id)">
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
      isExpanded: false,
      showNotification: false,
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
      navItems: [
        { icon: 'add', text: 'Add channel', path: '/channel/' + this.$route.params.id +'/messages' },
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
      
          setInterval(function () {
      vm.loadServerErrors();
    }.bind(this), 10000); 

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
        axios.get('http://localhost:3000/catalog/servererrors')
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
    startChannel: function(props, id) {
      var vm = this;
      props.item.is_running = true;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/start')
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
      props.item.is_running = false;
        axios.post('http://localhost:3000/catalog/channel/' + id +'/stop')
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
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
    navMessages: function (id){
      this.$router.push('/channel/' + id + '/messages');
    },
    navConfig: function (id){
      this.$router.push('/channel/' + id + '/config');
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

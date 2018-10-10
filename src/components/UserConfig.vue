<template>
  <div>
    <v-container style="float:left;padding:0px;">
      <v-card>
        <v-layout row wrap>
          <v-flex xs12>
            <v-subheader>
              User accounts:
            </v-subheader>  
            <v-layout row>
              <v-flex xs3>
                <div class="pl-2">
                  <v-card>
                    <div>
                      <v-list dense subheader>
                        <v-subheader inset>Users:</v-subheader>
                        <v-layout row>
                          <div class="pa-2">
                            <v-text-field
                              v-model="search"
                              append-icon="search"
                              label="Search"
                              single-line
                              hide-details
                              @input="onSearch"
                              append-outer-icon="add_box"
                              >
                            </v-text-field>
                          </div>
                        </v-layout>
                        <template v-for="(item, index) in listItemsFiltered">
                          <v-divider :key="item._id"></v-divider>
                          <v-list-tile 
                            avatar 
                            v-bind:class="{ 'grey lighten-4': index % 2 === 0 & isDarkTheme === false,
                            'grey darken-4': index % 2 === 0 & isDarkTheme === true }" 
                            v-bind:key="index" 
                            @click="editUser(item)">
                            <v-list-tile-content>
                              <v-list-tile-title v-text="item.username"  ></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn icon @click="deleteUser(item)">
                                <v-icon small color="pink">delete</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>   
                        </template>
                      </v-list>
                    </div>
                  </v-card>
                </div>
              </v-flex>
            <v-flex xs10>
              <div class="pl-2">
                <v-card v-if="selectedUser">
                  <v-card-title primary-title>
                    Edit user permissions:
                  </v-card-title>
                  <v-card-text>
                    <span class="headline">{{selectedUser.username}}</span>
                    <div>
                      <v-switch
                        :label="`Active`"
                        v-model="selectedUser.is_active"
                      ></v-switch>
                      <v-switch
                        :label="`Admin`"
                        v-model="selectedUser.is_admin"
                      ></v-switch>
                    </div>
                    <v-btn @click.stop="dialog2 = true">
                      Reset password
                    </v-btn>
                    <v-layout column >
                      <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="channels"
                        select-all
                        item-key="name"
                        hide-actions
                      >
                        <template slot="headers" slot-scope="props">
                          <tr>
                            <th
                              v-for="header in props.headers"
                              :key="header.text"
                              :class="['column sortable',]"
                              @click="changeSort(header.value)"
                            >
                            <v-icon small>arrow_upward</v-icon>
                              {{ header.text }}
                            </th>
                          </tr>
                          <tr>
                            <td></td>
                            <td class="text-xs-right">
                            <v-tooltip top>        
                            <v-checkbox
                                :input-value="viewAll"
                                primary
                                hide-details
                                @click.native="toggleViewAll"
                                slot="activator"
                              ></v-checkbox>
                                <span>View all</span>
                              </v-tooltip>
                              </td>
                            <td class="text-xs-right">
                            <v-tooltip top>       
                            <v-checkbox
                                @click.native="toggleEditAll"
                                :input-value="editAll"
                                primary
                                hide-details
                                slot="activator"
                              ></v-checkbox>
                              <span>Edit all</span>
                              </v-tooltip>
                              </td>
                          </tr>
                        </template>
                        <template slot="items" slot-scope="props">
                          <tr :active="props.selected" @click="props.selected = !props.selected">
                            <td>{{ props.item.name }}</td>
                            <td class="text-xs-right">          
                            <v-checkbox
                                :input-value="props.item.view"
                                primary
                                hide-details
                                @click="setViewPermission(props.item)"
                              ></v-checkbox></td>
                            <td class="text-xs-right">          
                            <v-checkbox
                                :input-value="props.item.edit"
                                primary
                                hide-details
                                @click="setEditPermission(props.item)"
                              ></v-checkbox></td>
                          </tr>
                        </template>
                      </v-data-table>
                    <v-layout row>
                  <div v-on:click="saveUserDetails()">
                    <v-btn raised primary >Save</v-btn>
                  </div>
                </v-layout>
              </v-layout>
            </v-card-text>
          </v-card>
        </div>
      </v-flex>    
    </v-layout>
    <v-dialog v-model="dialog2" max-width="500px">
      <v-card>
        <v-card-title>
          Set new password:
        </v-card-title>
        <v-card-text>
          <v-text-field name="input-3" label="New password:" v-model="newPass" value="Input text" class="pr-3"></v-text-field>
        </v-card-text>
        <v-btn raised primary @click="setUserPassword()">Reset</v-btn>  
      </v-card>
    </v-dialog>
      </v-flex >
    </v-layout >
  </v-card>
</v-container >
</div>
</template>

<script>
import axios from 'axios';
import auth from '../auth/index';
import _ from 'lodash';

export default {
  name: 'userconfig',
  data() {
    return {
      search: '',
      newPass: null,
      selectedUser: null,
      isAdmin: true,
      isActive: true,
      viewAll: true,
      editAll: true,
      dialog: false,
      users: [],
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          align: 'left',
          text: 'Channel',
          value: 'name'
        },
        { text: 'View', value: 'view', align: 'left' },
        { text: 'Edit', value: 'edit', align: 'left' },
      ],
      channels: [
        {
          name: 'Inbound patient portal',
          view: true,
          edit: true,
        },
        {
          name: 'Transcription',
          view: true,
          edit: true,
        },
        {
          name: 'ADT outbound',
          view: true,
          edit: true,
        },
        {
          name: 'SIU new appt',
          view: true,
          edit: true,
        },
      ],
      dialog2: false,
      listItems: [],
      listItemsFiltered: [],
      isDarkTheme: false,
    }
  },
  computed: {
      theme: function (){
      var vm = this;
      if (vm.isDarkTheme){
        return "vs-dark"
      } else {
        return "vs"
      }
    },
    axiosConfig: function(){ // axios request config obj: headers, query params etc.
      return {
        params: {
          secret_token: auth.getToken()
        }
      }
    }
  },
  components:{
    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/serverconfig', vm.axiosConfig)
      .then(function(response) {
        vm.isDarkTheme = response.data.isDarkTheme;
      });
    axios.get('http://localhost:3000/catalog/users', vm.axiosConfig)
      .then(function(response) {
        vm.users = response.data;
        vm.listItems = response.data;
        vm.listItemsFiltered = vm.listItems;
      })
      .catch(function(error) {
        console.log(error);
      });
    axios.get('http://localhost:3000/catalog/channels', vm.axiosConfig)
      .then(function(response) {
        vm.channels = response.data;
        var i;
        for (i = 0; i < vm.channels.length; i++) { 
          vm.channels[i]['view'] = false;
          vm.channels[i]['edit'] = false;
        }
      })
  },
  methods: {
    onSearch: function(){
      var vm = this;
      if (vm.search.length > 2){
        vm.listItemsFiltered = _.filter(vm.listItems, function(item) { return (item.username.indexOf(vm.search) != -1); })
      }
      if (vm.search === ''){
        vm.listItemsFiltered = vm.listItems;
      }
    },
    setViewPermission: function(item){
      item.view = ! item.view;
    },
    setEditPermission: function(item){
      item.edit = ! item.edit;
    },
    toggleViewAll: function(){
      var vm = this;
      vm.viewAll = !vm.viewAll;
      var i;
      for (i = 0; i < vm.channels.length; i++) { 
        vm.channels[i].view = vm.viewAll;
      }
    },
    toggleEditAll: function (){
      var vm = this;
      vm.editAll = !vm.editAll;
      var i;
      for (i = 0; i < vm.channels.length; i++) { 
        vm.channels[i].edit = vm.editAll;
      }
    },
    createUser: function(){
    },
    autoSave:function(){
      var vm = this;
      vm.saveUserDetails();
    },
    saveUserDetails: function(){
      var vm = this;
      vm.selectedUser.channel_permissions = {};
      var i;
      for (i = 0; i < vm.channels.length; i++) {
        vm.selectedUser.channel_permissions[vm.channels[i]._id] = {view: vm.channels[i].view, edit: vm.channels[i].edit,};
      }
      console.log(vm.selectedUser._id);
      axios.post('http://localhost:3000/catalog/updateuser/' + vm.selectedUser._id, vm.selectedUser, vm.axiosConfig)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setUserPassword: function(){
      var vm = this;
      axios.post('http://localhost:3000/catalog/user/' + vm.selectedUser._id +'/setpassword', {user: vm.selectedUser, newPass: vm.newPass}, vm.axiosConfig)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      vm.dialog2 = false;
    },
    deleteUser: function(){
      //this.editor = editor;
    },
    editUser: function(user){
      var vm = this;
      vm.selectedUser = user;
      var i;
      for (i = 0; i < vm.channels.length; i++) {
        try{
          vm.channels[i].view = vm.selectedUser.channel_permissions[vm.channels[i]._id].view;
          vm.channels[i].edit = vm.selectedUser.channel_permissions[vm.channels[i]._id].edit;
        } 
        catch(err) {
          vm.channels[i].view = false;
          vm.channels[i].edit = false;
        }
        
      }     
    }
  }

}
</script>


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
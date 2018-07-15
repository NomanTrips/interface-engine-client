<template>
  <div>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>
    <v-subheader >
    User accounts:
    </v-subheader>
        
    <v-layout row>
     <v-flex xs2>
     <div class="pl-2">
    <v-card>
   
        <div>
            <v-list dense two-line subheader>
              <v-subheader inset>Users:</v-subheader>
                <v-list-tile avatar v-for="user in users" v-bind:key="user.username" @click="editUser(user)">
                    <v-list-tile-content >
                    <v-text-field v-model="user.username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
                    </v-list-tile-content>
                </v-list-tile>   
            </v-list>
        </div>

  </v-card>
  </div>
      </v-flex>
        <v-flex xs10>
        <div class="pl-2">
        <v-card >
        <v-card-title primary-title>
        Edit user:
        </v-card-title>
        <v-layout column >
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="channels"
    select-all
    item-key="name"
    class="elevation-1"
  >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
            @click.native="toggleAll"
          ></v-checkbox>
        </th>
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
    </template>
    <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td>
        </td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">          
        <v-checkbox
            :input-value="props.view"
            primary
            hide-details
          ></v-checkbox></td>
        <td class="text-xs-right">          
        <v-checkbox
            :input-value="props.edit"
            primary
            hide-details
          ></v-checkbox></td>
      </tr>
    </template>
  </v-data-table>
              <v-layout row>
        <div v-on:click="saveUser()">
          <v-btn raised primary >Save</v-btn>
        </div>
        <v-btn color="primary" dark @click.stop="dialog2 = true">New</v-btn>
        <v-btn flat icon color="red" @click="deleteUser()">
            <v-icon>delete</v-icon>
        </v-btn>
      </v-layout>
        </v-layout>
        </v-card>
        </div>
        </v-flex>
      
      </v-layout>

        <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            Enter user details name:
          </v-card-title>
          <v-card-text>
            <v-text-field name="input-3" label="Template name:" value="Input text" class="pr-3"></v-text-field>
          </v-card-text>
          <v-btn raised primary @click="createUser()">Done</v-btn>
        </v-card>
      </v-dialog>
          </v-flex >
    </v-layout >
  </v-container >
  </div>
</template>

<script>
import axios from 'axios';
import auth from '../auth/index';

export default {
  name: 'userconfig',
  data() {
    return {
      dialog2: false,
      users: [{username: 'user1'},{username: 'user2'}],
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Channel',
          align: 'left',
          value: 'name'
        },
        { text: 'View', value: 'view' },
        { text: 'Edit', value: 'edit' },
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
      ]
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
  components:{
    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/users', vm.axiosConfig)
      .then(function(response) {
        vm.users = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    createUser: function(){
    },
    saveUserDetails: function(temp){
      this.selectedTemplate = temp;
      this.editor.setValue(this.selectedTemplate.script);
    },
    deleteUser: function(){
      this.editor = editor;
    }
  }

}
</script>


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
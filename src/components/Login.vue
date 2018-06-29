<template>
  <div>
    <v-container grid-list-md >
        <v-layout row>
            <v-flex xs4>
                <v-text-field
                    v-model="creds.name"
                    name="name"
                    label="Enter your name"
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs4>
                <v-text-field
                    v-model="creds.username"
                    name="username"
                    label="Enter your username"
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs4>
                <v-text-field
                    v-model="creds.password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    name="password"
                    label="Enter your password"
                    hint="At least 8 characters"
                    min="8"
                    counter
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs2>
                <v-btn primary v-on:click="login()">Login</v-btn>
            </v-flex>
            <v-flex xs2>
                <v-btn primary v-on:click="createUser()">New User</v-btn>
            </v-flex>
        </v-layout>
    </v-container >
  </div>
</template>

<script>

import axios from 'axios';
import Vue from 'vue';
import auth from '../auth/index'

  export default {
    name: 'login',
    data () {
      return {
          creds: {username: '', password: '', name: ''},
          e1: false,
          e2: false,
      }
    },
    computed: {
    },
  created() {
    var vm = this;
    // Make a request for a user with a given ID
  },
  methods: {
      login: function (){
          auth.login(this, this.creds, '/');
          /** 
          axios.post('http://localhost:3000/catalog/login', {"username": this.creds.username, "password": this.creds.password})
           .then(function(response) {
                console.log(response.data);
                var token = response.data.token;
                var config = {
                    headers: {'Authorization': "bearer " + token}
                };
                /*
                axios.post('http://localhost:3000/catalog/authenticatetoken', {}, config)
                    .then(function(response) {
                        console.log(response.data);
                        //vm.items = response.data;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                   
            //vm.items = response.data;
          })
          .catch(function(error) {
            console.log(error);
          });
          */
      },
      logout: function (){

      },
      createUser: function (){
          axios.post('http://localhost:3000/catalog/createuser', this.creds)
           .then(function(response) {
               console.log(response.data);
            //vm.creds = response.data;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
  }
  }
</script>


<style>

</style>
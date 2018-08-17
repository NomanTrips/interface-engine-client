<template>
    <v-container fluid fill-height>
      <v-layout flex align-center justify-center>
        <v-flex xs3>
            <v-card >
                <div class="pa-3">
                    <v-card-title>
                        <div style="padding-right:15px;">
                            <img style="height=36px;width:36px;" src="../../public/artificial-intelligence.svg" alt="Interface engine logo">
                        </div>
                        <div>
                            <span class="headline">Interface Engine</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row >
                            <v-flex >
                                <v-text-field
                                v-model="creds.username"
                                name="username"
                                label="Enter your username"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex >
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
                        <v-layout >
                            <v-flex >
                                <v-btn primary v-on:click="login()">Login</v-btn>
                            </v-flex>
                            <v-flex >
                                <v-btn primary v-on:click="createUser()">New User</v-btn>
                            </v-flex>
                        </v-layout>
                        <div>
                            <span style="color:red;">
                                {{loginErrorText}}
                            </span>
                        </div>
                    </v-card-text>
                </div>
            </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

import axios from 'axios';
import Vue from 'vue';
import auth from '../auth/index'

  export default {
    name: 'login',
    data () {
      return {
          loginErrorText: '',
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
          var vm = this;
          auth.login(this, this.creds, '/Dashboard', function(err){
              vm.loginErrorText = err.response.data;
          });
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
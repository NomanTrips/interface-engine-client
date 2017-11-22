<template>
  <v-app light>
    <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer">
      <v-list>

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
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <v-data-table v-bind:headers="headers" :items="items" hide-actions class="elevation-1">
              <template slot="items" scope="props">
                <tr v-on:click="showChannelDetail(props.item._id)">
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
            </v-data-table>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </main>
    <v-navigation-drawer temporary :right="right" v-model="rightDrawer">
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed">
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

export default {
  name: 'dashboard',
  data() {
    return {
      headers: [
        {
          text: 'Channel',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        //{ text: 'Id', value: 'id' },
        //{ text: 'Name', value: 'name' },
        { text: 'Description', value: 'Description' },
        { text: 'Received', value: 'received' },
        { text: 'Sent', value: 'sent' },
        { text: 'Errors', value: 'errors' },
      ],
      navItems: [
        { icon: 'add', text: 'Add channel', path: '/channel/' + this.$route.params.id +'/messages' },
      ],
      items: [],
      clipped: true,
      drawer: false,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Interface engine'
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
    createChannel: function () {
    axios.post('http://localhost:3000/catalog/channel/create')
      .then(function(response) {
        var id = response.data._id;
        console.log(id);
        this.$router.push('channel/' + id);
      })

    },
    showChannelDetail: function(id) {
      console.log(id);
      this.$router.push('channel/' + id);
    },
    getChannels: function() {

    }
  }
}
</script>

<style lang="stylus">
  @import '../stylus/main'
</style>
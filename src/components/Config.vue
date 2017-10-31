<template>
  <div style="height:100%;width:100%;">
    <v-card class="grey lighten-4 elevation-0">
      <v-card-text>
        <v-container fluid>
        <div v-on:click="startStopChannel()">
          <v-switch v-bind:label="`Channel running: ${channelTurnedOn.toString()}`" v-model="channelTurnedOn" ></v-switch>
        </div>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Source type</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-select v-bind:items="transportTypes" v-model="channel.inbound_type" label="Select" single-line bottom></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Source location</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="channel.inbound_location" name="input-2" label="Label Text" value="Input text" class="input-group--focused"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Dest type</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-select v-bind:items="transportTypes" v-model="channel.outbound_type" label="Select" single-line bottom></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Dest location</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="channel.outbound_location" name="input-3" label="Label Text" value="Input text"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>http destination</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="channel.http_destination" name="input-3" label="Label Text" value="Input text"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <div v-on:click="saveChannelDetail()">
            <v-btn raised primary >Save</v-btn>
            </div>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'config',
  data() {
    return {
      channelTurnedOn: false,
      channel: {},
      source: null,
      dest: null,
      transportTypes: ['SFTP', 'File directory', 'http', 'https', 'TCP/IP']

    }
  },
  created() {
    var vm = this
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id)
      .then(function(response) {
        vm.channel = response.data;
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    startStopChannel: function(){
      
      if (this.channelTurnedOn){
        console.log('getting to start');
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/start')
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      } else {
        console.log('stopping...');
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/stop')
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      }

    },
    saveChannelDetail: function() {
      console.log(this.channel);
      axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/update', this.channel)
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

</style>
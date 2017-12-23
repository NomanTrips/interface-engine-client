<template>
  <div id="example-3" style="height:100%;width:100%;">
    <v-container fluid>

      <v-card class="mb-3">
          <div class="pa-3">
        <label>
         General:
        </label>
          </div>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-text-field v-model="channel.name" name="input-2" label="Channel name" value="Input text" class="pr-3"></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field v-model="channel.description" name="input-2" label="Channel description" value="Input text" class="pr-3"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card class="mb-3">
          <div class="pa-3">
        <label>
         Schedule settings:
        </label>
          </div>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-select v-bind:items="scheduleTypes" v-model="channel.schedule_type" label="Schedule type" class="pr-3" ></v-select>
            </v-flex>
            <v-flex xs2>
              <v-text-field v-model="channel.schedule_interval" name="input-2" label="Scheduled interval" value="Input text" class="pr-3"></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select v-bind:items="intervalUnit" v-model="channel.schedule_unit" label="Interval unit" class="pr-3"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card>
        <div class="pa-3">
          <label>
            Transport settings:
          </label>
        </div>
        <v-card-text>
      <v-layout row>
        <v-flex xs12 >
          <div v-on:click="startStopChannel()">
            <v-switch v-bind:label="`Channel running: ${channelTurnedOn.toString()}`" v-model="channelTurnedOn" ></v-switch>
          </div>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 >
          <v-select v-bind:items="transportTypes" v-model="channel.inbound_type" label="Source type" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs6 >
          <div v-if="channel.inbound_type == 'File directory'">
            <v-text-field v-model="channel.inbound_location" name="input-2" label="Source location" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.inbound_type == 'http'">
          </div>
          <div v-if="channel.inbound_type == 'https'">
            <v-text-field v-model="channel.https_privateKey" name="input-3" label="Private key location:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_certificate" name="input-3" label="Certificate location:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
          </div>
        </v-flex>
      </v-layout>
  
      <div v-if="channel.inbound_type == 'SFTP' || channel.inbound_type == 'FTP'">
        <v-layout row>
          <v-flex xs4>
            <v-text-field v-model="channel.sftp_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
          </v-flex>
          <v-flex xs2>        
            <v-text-field v-model="channel.sftp_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-text-field v-model="channel.sftp_username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
          </v-flex>
          <v-flex xs4>        
            <v-text-field v-model="channel.sftp_password" name="input-2" label="Password" value="Input text" class="pr-3"
              :append-icon="e1 ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (e1 = !e1)"
              :type="e1 ? 'password' : 'text'"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </div>

      <v-layout row>
        <v-flex xs6 >
          <v-select v-bind:items="transportTypes" v-model="channel.outbound_type" label="Dest type" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs6 >
          <div v-if="channel.outbound_type == 'File directory'">
            <v-text-field v-model="channel.outbound_location" name="input-3" label="Dest location" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.outbound_type == 'http'">
            <v-text-field v-model="channel.http_destination" name="input-3" label="http destination" value="Input text" class="pr-3"></v-text-field>
          </div>
        </v-flex>
      </v-layout>
      
      <v-layout row>
        <v-flex xs4 >
          <div v-if="channel.inbound_type == 'File directory' || channel.inbound_type == 'FTP' || channel.inbound_type == 'SFTP'">
            <v-select label="Post-processing action" v-bind:items="postProcessingType" v-model="channel.post_processing_action" class="pr-3"></v-select>
            <v-text-field v-if="channel.post_processing_action == 'Move'" v-model="channel.move_destination" name="input-3" label="move destination" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-if="channel.post_processing_action == 'Copy'" v-model="channel.copy_destination" name="input-3" label="copy destination" value="Input text" class="pr-3"></v-text-field>
          </div>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 >
          <div v-on:click="saveChannelDetail()">
            <v-btn raised primary >Save</v-btn>
          </div>
        </v-flex>
      </v-layout>
      </v-card-text>
    </v-card>

    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'config',
  data() {
    return {
      e1: true,
      //channelTurnedOn: false,
      channel: {},
      source: null,
      dest: null,
      transportTypes: ['FTP','SFTP', 'File directory', 'http', 'https', 'TCP/IP'],
      postProcessingType: ['Move', 'Delete', 'Copy'],
      intervalUnit: ['milliseconds','seconds', 'minutes', 'hours', 'days'],
      scheduleTypes: ['Periodic', 'Time'],

    }
  },
  computed: {
    channelTurnedOn: {
      get: function() {
        if (this.channel.status == 'Running') {
          return true;
        } else {
          return false;
        }
      },
      set: function(isTurnedOn) {
        if (isTurnedOn) {
          this.channel.status = 'Running';
        } else {
          this.channel.status = 'Stopped';
        }
      }
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
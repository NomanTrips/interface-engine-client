<template>

<div>
<!--
        <v-navigation-drawer app clipped fixed width="200"  v-model="drawer">
      <v-list>   
        <v-list-tile v-for="item in navitems" :key="item.title" @click="navItem(item.title)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
       
      </v-list>
    </v-navigation-drawer>
-->
      <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>
      <v-card class="mb-3" style="width:100%;">
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
        <v-flex xs3 >
          <v-select v-bind:items="transportTypes" v-model="channel.inbound_type" label="Source type" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs3 >
          <v-select v-bind:items="fileFormats" v-model="channel.inbound_file_format" label="Source file format" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs6 >
          <div v-if="channel.inbound_type == 'File directory'">
            <v-text-field v-model="channel.inbound_location" name="input-2" label="Source location" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.inbound_type == 'http'">
            <v-text-field v-model="channel.http_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
            <v-switch label="Send ACK" v-model="channel.is_send_ack" ></v-switch>
            <div v-if="channel.is_send_ack">
              <v-textarea v-model="channel.ack_message" name="input-2" auto-grow label="ACK message" value="Input text" ></v-textarea>
            </div>
          </div>
          <div v-if="channel.inbound_type == 'https'">
            <v-text-field v-model="channel.https_privateKey" name="input-3" label="Private key location:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_certificate" name="input-3" label="Certificate location:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.inbound_type == 'Database reader'">
            <v-select v-bind:items="dbReaderType" v-model="channel.db_reader_type" label="Database type" class="pr-3"></v-select>
            <v-text-field v-model="channel.db_reader_user" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_reader_password" name="input-2" label="Password" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_reader_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_reader_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_reader_database" name="input-2" label="Database" value="Input text" class="pr-3"></v-text-field>
            <v-text-field
              name="input-7-1"
              label="Query:"
              multi-line
              v-model="channel.db_reader_query"
              rows="10"
            ></v-text-field>
            <v-switch v-bind:label="'Use post-process query:'" v-model="channel.db_reader_use_post_process_query" ></v-switch>
            <v-text-field
              name="input-7-1"
              label="Post processing query (enter variables as: $$'+`${id}`+'$$):"
              multi-line
              v-model="channel.db_reader_post_process_query"
              rows="10"
            ></v-text-field>
          </div>
          <div v-if="channel.inbound_type == 'FTP'">
            <v-text-field v-model="channel.ftp_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_path" name="input-2" label="ftp path" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_password" name="input-2" label="Password" value="Input text" class="pr-3"></v-text-field>
            <v-switch v-bind:label="`Use excplicit TLS (FTPS): ${channel.ftp_use_tls.toString()}`" v-model="channel.ftp_use_tls" ></v-switch>
          </div>
          <div v-if="channel.inbound_type == 'SFTP'">
            <v-text-field v-model="channel.sftp_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.sftp_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.sftp_path" name="input-2" label="sftp path" value="Input text" class="pr-3"></v-text-field>
            <v-switch v-bind:label="`Private key authentication: ${channel.sftp_auth_type.toString()}`" v-model="channel.sftp_auth_type" ></v-switch>
            <v-text-field v-model="channel.sftp_username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <div v-if="channel.sftp_auth_type == false">
              <v-text-field v-model="channel.sftp_password" name="input-2" label="Password" value="Input text" class="pr-3"
                :append-icon="e1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e1 = !e1)"
                :type="e1 ? 'password' : 'text'"
              ></v-text-field>
            </div>
            <div v-if="channel.sftp_auth_type == true">
              <v-text-field v-model="channel.sftp_private_key" name="input-2" label="Private key path: " value="Input text" class="pr-3"></v-text-field>
            </div>
          </div>
          <div v-if="channel.inbound_type == 'TCP'">
            <v-text-field v-model="channel.tcp_host" name="input-3" label="Host:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.tcp_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
            <v-switch label="Send ACK" v-model="channel.is_send_ack" ></v-switch>
            <div v-if="channel.is_send_ack">
              <v-textarea v-model="channel.ack_message" name="input-2" auto-grow label="ACK message" value="Input text" ></v-textarea>
            </div>
          </div>
          <div v-if="channel.inbound_type == 'Web service listener'">
            <v-text-field v-model="channel.web_service_listener_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
            <label>WSDL url: http://localhost:{{channel.web_service_listener_port}}/wsdl?wsdl</label>
            <br>
            <label>Method: ProcessMessage</label>
          </div>
        </v-flex>
      </v-layout>
  
  <!--
      <div v-if="channel.inbound_type == 'SFTP' || channel.inbound_type == 'FTP'">
        <v-layout row>
          <v-flex xs4>
            
          </v-flex>
          <v-flex xs2>        
            
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            
          </v-flex>

          <v-flex xs4>
            
          </v-flex>
          <div>
            
          </div>

        </v-layout>
      </div>
-->
      <v-layout row>
        <v-flex xs3 >
          <v-select v-bind:items="transportTypes" v-model="channel.outbound_type" label="Dest type" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs3 >
          <v-select v-bind:items="fileFormats" v-model="channel.outbound_file_format" label="Dest file format" class="pr-3"></v-select>
        </v-flex>
        <v-flex xs6 >
          <div v-if="channel.outbound_type == 'File directory'">
            <v-text-field v-model="channel.outbound_location" name="input-3" label="Dest location" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.outbound_type == 'http'">
            <v-text-field v-model="channel.http_destination" name="input-3" label="http destination" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.outbound_type == 'https'">
            <v-text-field v-model="channel.https_dest_host" name="input-3" label="Host name:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_dest_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
            <v-select v-bind:items="httpMethod" v-model="channel.https_dest_method" label="Method:" class="pr-3"></v-select>
            <v-text-field v-model="channel.https_dest_cert" name="input-3" label="Cert:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.https_dest_ca" name="input-3" label="Certificate Authority: (optional)" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.outbound_type == 'TCP'">
            <v-text-field v-model="channel.tcp_dest_host" name="input-3" label="Host name:" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.tcp_dest_port" name="input-3" label="Port:" value="Input text" class="pr-3"></v-text-field>
          </div>
          <div v-if="channel.outbound_type == 'FTP'">
            <v-text-field v-model="channel.ftp_dest_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_dest_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_dest_path" name="input-2" label="ftp path" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_dest_username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.ftp_dest_password" name="input-2" label="Password" value="Input text" class="pr-3"></v-text-field>
            <v-switch v-bind:label="`Use excplicit TLS (FTPS): ${channel.ftp_dest_use_tls.toString()}`" v-model="channel.ftp_dest_use_tls" ></v-switch>
          </div>
          <div v-if="channel.outbound_type == 'SFTP'">
            <v-text-field v-model="channel.sftp_dest_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.sftp_dest_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.sftp_dest_path" name="input-2" label="sftp path" value="Input text" class="pr-3"></v-text-field>
            <v-switch v-bind:label="`Private key authentication: ${channel.sftp_dest_auth_type.toString()}`" v-model="channel.sftp_dest_auth_type" ></v-switch>
            <v-text-field v-model="channel.sftp_dest_username" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <div v-if="channel.sftp_dest_auth_type == false">
              <v-text-field v-model="channel.sftp_dest_password" name="input-2" label="Password" value="Input text" class="pr-3"
                :append-icon="e1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e1 = !e1)"
                :type="e1 ? 'password' : 'text'"
              ></v-text-field>
            </div>
            <div v-if="channel.sftp_dest_auth_type == true">
              <v-text-field v-model="channel.sftp_dest_private_key" name="input-2" label="Private key path: " value="Input text" class="pr-3"></v-text-field>
            </div>
          </div>
          <div v-if="channel.outbound_type == 'Database writer'">
            <v-select v-bind:items="dbReaderType" v-model="channel.db_writer_type" label="Database type" class="pr-3"></v-select>
            <v-text-field v-model="channel.db_writer_user" name="input-2" label="Username" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_writer_password" name="input-2" label="Password" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_writer_host" name="input-2" label="Host" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_writer_port" name="input-2" label="Port" value="Input text" class="pr-3"></v-text-field>
            <v-text-field v-model="channel.db_writer_database" name="input-2" label="Database" value="Input text" class="pr-3"></v-text-field>
            <v-text-field
              name="input-7-1"
              label="Query:"
              multi-line
              v-model="channel.db_writer_query"
              rows="10"
            ></v-text-field>
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
      <v-flex xs12>
        <div v-if="channel.outbound_type == 'Web service sender'">
          <v-text-field v-model="channel.web_service_sender_wsdl" name="input-2" label="WSDL url" value="Input text" class="pr-3"></v-text-field>
          <v-text-field v-model="channel.web_service_sender_service_url" name="input-2" label="Service url" value="Input text" class="pr-3"></v-text-field>
          <label>
          </label>
          <br>
          <label>
          </label>
          <v-textarea v-model="channel.web_service_sender_envelope" name="input-2" auto-grow label="Soap envelope (enter variables as: ${var})" value="Input text" ></v-textarea>
        </div>
      </v-flex>
      <v-layout row>
        <v-flex xs12 >
          <div v-on:click="saveChannelDetail()">
            <v-btn raised primary >Save</v-btn>
          </div>
        </v-flex>
      </v-layout>
      </v-card-text>
    </v-card>
          </v-flex >
    </v-layout >

      </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import auth from '../auth/index'

export default {
  name: 'config',
  data() {
    return {
      drawer: true,
      e1: true,
      //channelTurnedOn: false,
      channel: {},
      source: null,
      dest: null,
      fileFormats: ['xml', 'json', 'HL7'],
      httpMethod: ['GET','PUT', 'POST'],
      transportTypes: ['FTP','SFTP', 'File directory', 'http', 'https', 'TCP', 'Database reader', 'Database writer', 'Web service listener', 'Web service sender'],
      dbReaderType: ['Postgres'],
      postProcessingType: ['Move', 'Delete', 'Copy'],
      intervalUnit: ['milliseconds','seconds', 'minutes', 'hours', 'days'],
      scheduleTypes: ['Periodic', 'Time'],
      navitems: [
        { icon: 'timer', title: 'Interval settings' },
        { icon: 'input', title: 'Source settings'  },
        { icon: 'call_made', title: 'Destination settings'  },
      ],
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
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id, vm.axiosConfig)
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
      var vm = this;
      if (this.channelTurnedOn){
        console.log('getting to start');
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/start', vm.axiosConfig)
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      } else {
        console.log('stopping...');
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/stop', vm.axiosConfig)
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      }

    },
    saveChannelDetail: function() {
      var vm = this;
      console.log(this.channel);
      axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/update', this.channel, vm.axiosConfig)
      .then(function(response) {
      console.log(response);
      })
      .catch(function(error) {
      console.log(error);
      });
    },
    navItem: function (itemTitle){

    }

  }

}
</script>


<style>

</style>
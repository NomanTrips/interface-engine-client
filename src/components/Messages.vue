<template>

  <div style="height:100%;width:100%;">
    <v-toolbar class="white" flat>
      <v-text-field
        label="Search messages..."
        hint="Search raw data of processed messages."
        v-model="search"
        prepend-icon="search"
      ></v-text-field>
      <v-btn flat icon v-on:click="deleteMessages()">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table 
        v-bind:headers="headers"
        :items="filteredMessages"
        hide-actions
        class="elevation-1"
        item-key="_id"
      >
      <template slot="items" slot-scope="props">
        <tr @click="showMessageDetail(props.item._id)" >
          <td>{{ props.item.received_date }}</td>
          <td>{{ props.item.status }}</td>
          <td>{{ props.item.err }}</td>
          <td ><pre>{{ String(props.item.raw_data).substring(0, 60) }}....</pre></td>
          <td ><pre>{{ String(props.item.transformed_data).substring(0, 60) }}....</pre></td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-container>
    <v-layout row wrap>
      <v-flex xs12 lg5 mb-3>
        <v-expansion-panel popout>
        <div class="pl-2">
          <v-card flat class="grey lighten-2">
           <pre>{{String(props.item.raw_data)}}</pre>
          </v-card>
        </div>
        </v-expansion-panel>
        </v-flex>
        </v-layout>
        </v-container>
      </template>
    </v-data-table>
  </div>
 
</template>

<script>

import axios from 'axios';
import moment from 'moment';

  export default {
    name: 'messages',
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'Received date/time',
            align: 'left',
            sortable: true,
            value: 'received_date'
          },
          { text: 'Status',align: 'left', value: 'status' },
          { text: 'Error', align: 'left', value: 'err' },
          { text: 'Raw message (truncated)', align: 'left', value: 'raw_data' },
          { text: 'Transformed message (truncated)', align: 'left', value: 'transformed_data' },
        ],
        messages: [],
        pagination: {
          sortBy: 'received_date'
        },
      }
    },
    computed: {
      filteredMessages: function () {
        var vm = this;
        return vm.messages.filter(message => {
          return message.raw_data.toLowerCase().includes(vm.search.toLowerCase())
        })

      }
    },
  created() {
    this.pagination.descending = false;
    var vm = this
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/messages' + '?channel=' + this.$route.params.id)
      .then(function(response) {
        vm.messages = response.data;
        for (var i = 0; i < vm.messages.length; i++) { 
            vm.messages[i].received_date = moment(vm.messages[i].received_date).format('MM/DD/YYYY hh:mm:ss');
        }
        //console.log(testdate);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    showMessageDetail: function(id) {
      this.$router.push(this.$route.path + '/' + id);
    },
    deleteMessages: function(){
      axios.post('http://localhost:3000/catalog/message/' + this.$route.params.id +'/delete', {})
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
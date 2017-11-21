<template>
  <div style="height:100%;width:100%;">
    <v-toolbar class="white" flat>
      <v-text-field
        label="Search messages..."
        hint="Search raw data of processed messages."
        v-model="search"
        prepend-icon="search"
      ></v-text-field>
    </v-toolbar>
    <v-data-table
        v-bind:headers="headers"
        :items="filteredMessages"
        hide-actions
        class="elevation-1"
      >
      <template slot="items" scope="props">
        <tr v-on:click="showMessageDetail(props.item._id)">
          <td>{{ props.item.received_date }}</td>
          <td class="text-xs-right">{{ String(props.item.raw_data).substring(0, 30) }}</td>
        </tr>
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
          { text: 'Raw message', value: 'raw_data' },
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
      console.log(id);
      this.$router.push(this.$route.path + '/' + id);
    },
  }
  }
</script>


<style>

</style>
<template>
  <div style="height:100%;width:100%;">
    <v-data-table
        v-bind:headers="headers"
        :items="items"
        hide-actions
        class="elevation-1"
      >
      <template slot="items" scope="props">
        <tr v-on:click="showMessageDetail(props.item._id)">
          <td>{{ props.item.received_date }}</td>
          <td class="text-xs-right">{{ String(props.item.raw_data).substring(1, 30) }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>

import axios from 'axios';

  export default {
    name: 'messages',
    data () {
      return {
        headers: [
          {
            text: 'Received date/time',
            align: 'left',
            sortable: true,
            value: 'date'
          },
          { text: 'Raw message', value: 'raw_data' },
        ],
        items: []
      }
    },
  created() {
    var vm = this
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/messages' + '?channel=' + this.$route.params.id)
      .then(function(response) {
        vm.items = response.data;
        console.log(response.data);
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
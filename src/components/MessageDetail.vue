<template>
  <div style="height:100%;width:100%;">
      <v-container fluid>
      <div v-show="showRaw">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Raw message</h3>
              <div>Message data recieved from the source.</div>
            </div>
          </v-card-title>

          <pre>
            {{raw_data}}
          </pre>
        </v-card>
      </div>
      
      <div v-show="showTransformed">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Transformed message</h3>
              <div>Message transformed by any channels script.</div>
            </div>
          </v-card-title>

          <pre>
            {{transformed_data}}
          </pre>
        </v-card>
      </div>

      <div v-show="showErrors">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Errors</h3>
              <div>Any errors in processing the message.</div>
            </div>
          </v-card-title>

          <pre>
            {{errors}}
          </pre>
        </v-card>
      </div>
  </v-container>
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
  </div>



</template>

<script>

import axios from 'axios';
import auth from '../auth/index';

  export default {
    name: 'messagedetail',
    data () {
      return {
        showErrors: false,
        showRaw: true,
        showTransformed: false,
        drawer: true,
        isExpanded: false,
        navitems: [
          { icon: 'input', title: 'Raw message' },
          { icon: 'mail', title: 'Transformed message' },
          { icon: 'error', title: 'Errors'  },
        ],
        raw_data : '',
        transformed_data: '',
        errors: '',
        items: [],
        clipped: false,
        fixed: false,

        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Message detail'
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
  created() {
    var vm = this;
    vm.$parent.drawer = false;
    axios.get('http://localhost:3000/catalog/message/' +  this.$route.params.messageid, vm.axiosConfig)
      .then(function(response) {
        vm.raw_data = response.data.raw_data;
        vm.transformed_data = response.data.transformed_data;
        vm.errors = response.data.err;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    navItem: function (itemTitle){
      var vm = this;
      if (itemTitle == 'Raw message'){
        vm.showErrors = false;
        vm.showRaw = true;
        vm.showTransformed = false;
      } else if (itemTitle == 'Transformed message'){
        vm.showErrors = false;
        vm.showRaw = false;
        vm.showTransformed = true;
      } else if (itemTitle == 'Errors'){
        vm.showErrors = true;
        vm.showRaw = false;
        vm.showTransformed = false;
      }
    },
  }
  }
</script>


<style>

</style>
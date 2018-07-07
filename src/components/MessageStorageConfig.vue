<template>
  <div>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>       
        
        <v-card >
        <div class="pa-3">
        <v-card-title primary-title>
        Message cleanup:
        </v-card-title>
        <v-layout column >
        
        <div>
        <v-switch v-bind:label="`Enabled:`" v-model="config.message_cleanup_enabled" ></v-switch>
        <v-flex xs2>
        <v-text-field
          name="input-1-3"
          label="Storage limit"
          single-line
          hint="Messages metadata will be removed over this limit."
          persistent-hint
          suffix="MB"
          mask="######"
          class="pr-3"
          v-model="config.message_storage_limit"
        ></v-text-field>
        </v-flex>
        </div>

            <v-layout row>
        <div v-on:click="saveConfig()">
          <v-btn raised primary >Save</v-btn>
        </div>
      </v-layout>
        </v-layout>
        </div>
        </v-card>
        
        </v-flex>
      
      </v-layout>

  </v-container >
  </div>
</template>

<script>
import axios from 'axios';
import auth from '../auth/index';

export default {
  name: 'messagestorageconfig',
  data() {
    return {
        config: {}
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
  components:{

    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/messagestorageconfig', vm.axiosConfig)
      .then(function(response) {
        console.log(response.data);
        vm.config = response.data[0];
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    saveConfig: function() {
        var vm = this;
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id  +'/messagestorageconfig/update', vm.config, vm.axiosConfig)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
  }

}
</script>


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
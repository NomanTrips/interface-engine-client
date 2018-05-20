<template>
  <div>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>       
        <div class="pl-2">
        <v-card >
        <v-card-title primary-title>
        Edit storage settings:
        </v-card-title>
        <v-layout column >
        
        <div>
        <v-flex xs2>
        <v-text-field
          name="input-1-3"
          label="Storage limit"
          single-line
          hint="Messages will be removed over this limit. First in first out."
          persistent-hint
          suffix="MB"
          mask="#######"
          class="pr-3"
        ></v-text-field>
        </v-flex>
        </div>
        
            <v-layout row>
        <div v-on:click="saveConfig()">
          <v-btn raised primary >Save</v-btn>
        </div>
      </v-layout>
        </v-layout>
        </v-card>
        </div>
        </v-flex>
      
      </v-layout>

  </v-container >
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'messagestorageconfig',
  data() {
    return {
        config: {}
    }
  },
  
  computed: {

  },
  
  components:{

    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/messagestorageconfig')
      .then(function(response) {
        console.log(response.data);
        vm.config = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    saveGlobalVars: function() {
        var vm = this;
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id  +'/update', vm.config)
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
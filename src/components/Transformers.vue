<template>
  <div id="example-3" style="height:100%;width:100%;">
    <v-container fluid>

      <v-layout row>
        <v-flex xs2 >
           
           <!--
            <v-list two-line>
            <div v-for="transformer in transformers">
                <div v-on:click="setSelectedTransformer(transformer)">
                    <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                    <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                    <v-list-tile avatar v-else v-bind:key="transformer.title">
                    <v-list-tile-avatar>
                        <img v-bind:src=""></v-list-tile-avatar>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="transformer.title"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="transformer.subtitle"></v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </div>
            </div>
            </v-list>
-->
        <v-list two-line>
          <v-list-tile avatar ripple v-for="(item, index) in transformers" v-bind:key="item.title">
            <div v-on:click="setSelectedTransformer(item)">
                <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </div>
            <v-divider v-if="index + 1 < transformers.length"></v-divider>
          </v-list-tile>
        </v-list>

            <div v-on:click="addTransformer()">
                <v-btn raised primary >Create</v-btn>
            </div>
        </v-flex>
        <v-flex xs10 >
            <v-card>
                <v-card-title primary-title>
                    <div>
                        <v-text-field v-model="selectedTransformer.title" name="input-3" label="Edit title" value="Input text"></v-text-field>
                    </div>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                    name="input-7-1"
                    label="Label Text"
                    v-model="selectedTransformer.script"
                    multi-line
                    ></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <div v-on:click="saveTransformer()">
                        <v-btn raised primary >Save</v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'transformers',
  data() {
    return {
      transformers: [],
      selectedScript: '',
      newTransformer: {
          channel: '',
          title: 'Enter title here...',
          script: 'Enter script here...'
      },
      selectedTransformer: {
          channel: '',
          title: '',
          script: ''
      },
    }
  },
  created() {
    var vm = this;
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/transformers')
      .then(function(response) {
        vm.transformers = response.data;
        vm.selectedTransformer = vm.transformers[0];
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    setSelectedTransformer: function(transformer) {
        this.selectedTransformer = transformer;
    },
    addTransformer: function() {
      this.transformers.push(this.newTransformer);
    },
    saveTransformer: function() {
      if (this.selectedTransformer._id != undefined) { // update existing
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/transformers/update', this.selectedTransformer)
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      } else { // create new
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/transformers/create', this.selectedTransformer)
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      }

    }

  }

}
</script>


<style>

</style>
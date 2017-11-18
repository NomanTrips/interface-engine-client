<template>
  <div id="example-3" style="height:100%;width:100%;">
    <v-container fluid>

      <v-layout row>
        <v-flex xs3 >
        <v-card>
        <v-subheader>Transformers:</v-subheader>          
        <v-list two-line>
          <v-list-tile avatar ripple v-for="(item, index) in transformers" v-bind:key="item.title" v-bind:class="{ 'grey lighten-2': index == selectedIndex  }">
            <div v-on:click="setSelectedTransformer(item, index)" style="height:100%;width:100%;" >
                <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-divider></v-divider>
            </div>
            
          </v-list-tile>
        </v-list>

            <div v-on:click="addTransformer()">
                <v-btn raised primary >Create</v-btn>
            </div>
        </v-card>
        </v-flex>
        <v-flex xs9 >
   
            <v-card>
              <v-subheader>Edit Transformer:</v-subheader> 
              <v-card-text>
                <v-layout row>
                  <div>
                    <v-text-field v-model="selectedTransformer.title" name="input-3" label="Title" value="Input text"></v-text-field>
                  </div>
                  <div>
                    <v-menu bottom right :close-on-content-click="false" offset-x>
                      <div slot="activator">
                        <v-btn>
                          <v-icon>extension</v-icon>
                        </v-btn>
                      </div>
                      <v-card>
                        <v-card-text>
                          <v-toolbar class="white" dense>
                            <v-text-field
                              name="package-search"
                              label="Search packages..."
                              hint="Search for a js libary to manipulate the message"
                              v-model="packageSearch"
                              min="1"
                            ></v-text-field>
                          </v-toolbar>
                          <v-list>
                            <v-list-tile v-for="library in libraries" :key="library.name">
                              <v-list-tile-title>{{ library.name }}</v-list-tile-title>
                              <div v-on:click="importLibrary(library.name)">
                                <v-btn icon>
                                  <v-icon>colorize</v-icon>
                                </v-btn>
                              </div>
                            </v-list-tile>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </div>
                </v-layout>
              </v-card-text>
              <v-card-text>
                <label>Script editor:</label>
                <editor v-model="selectedTransformer.script" @init="editorInit();" lang="javascript" theme="chrome" width="100%" height="400"></editor>
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
      chips: ['xmlToJson','hl7-to-json'],
      libraries: [],
      packageSearch: '',
        selectedIndex: 0,
        activeClass: 'active',
        inactiveClass: 'inactive',
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
  /*
  computed: {
    filteredLibraries: function () {
      return this.libraries.filter(function (library) {
        library.name.search(packageSearch);
        return library.name % 2 === 0
      })
    }
  },
  */
  components:{
        editor:require('vue2-ace-editor')
    },
  created() {

    var vm = this;
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/transformers')
      .then(function(response) {
        vm.transformers = response.data;
        if (response.data.length > 0) {
            vm.selectedTransformer = vm.transformers[0];
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    
    axios.get('http://localhost:3000/catalog/libraries')
      .then(function(response) {
        vm.libraries = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    importLibrary: function (library){
      var importStatement = 'var ' + library + ' = require(\' ' + library + ' \');'
      this.selectedTransformer.script = importStatement + '\n' + this.selectedTransformer.script;
    },
    searchPackages: function () {
      console.log(this.packageSearch);
    },
    editorInit:function () {
      require('brace/mode/html');
      require('brace/theme/chrome');
    },
    setSelectedTransformer: function(transformer, index) {
        this.selectedIndex = index;
        this.selectedTransformer = transformer;
    },
    addTransformer: function() {
      this.transformers.push(this.newTransformer);
    },
    saveTransformer: function() {
      if (this.selectedTransformer._id != undefined) { // update existing
        axios.post('http://localhost:3000/catalog/transformer/' + this.selectedTransformer._id +'/update', this.selectedTransformer)
        .then(function(response) {
        console.log(response);
        })
        .catch(function(error) {
        console.log(error);
        });
      } else { // create new
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/transformer/create', this.selectedTransformer)
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


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
    #editor {
        margin: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
  </style>
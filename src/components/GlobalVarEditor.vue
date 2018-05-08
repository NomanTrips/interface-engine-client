<template>
  <div>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>
    <v-subheader >
    Edit Global variables:
    </v-subheader>
        


        <div class="pl-2">
        <v-card >
        <v-card-title primary-title>
        Edit script:
        </v-card-title>
        <v-layout column >
        <MonacoEditor
            height="600"
            language="javascript"
            :code= "globalVariables.script"
            :editorOptions="options"
            @mounted="onMounted"
            @codeChange="onCodeChange"
            theme="vs"
        >
        </MonacoEditor>
              <v-layout row>
        <div v-on:click="saveGlobalVars()">
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
import MonacoEditor from 'vue-monaco-editor'

export default {
  name: 'globalvareditor',
  data() {
    return {
      globalVariables: {script: ""},
      code: '// Type away! \n',
      scriptName: 'Enter script name here',
      options: {
        selectOnLineNumbers: false
      },

    }
  },
  
  computed: {

  },
  
  components:{
        MonacoEditor
    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/globalvariables')
      .then(function(response) {
          console.log(response.data);
        vm.globalVariables = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    //var vm : this,
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      this.globalVariables.script = editor.getValue();
    },
    saveGlobalVars: function() {
        var vm = this;
        axios.post('http://localhost:3000/catalog/globalvariables/' + vm.globalVariables._id  +'/update', this.globalVariables)
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
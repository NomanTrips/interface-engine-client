<template>
  <div id="example-3" style="height:100%;width:100%;">
    <v-subheader>Modification script:</v-subheader>
      <MonacoEditor
        height="600"
        language="javascript"
        :code= "code"
        :editorOptions="options"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        theme="vs"
      >
      </MonacoEditor>
      <v-layout row>
        <div v-on:click="saveModifierScript()">
          <v-btn raised primary >Save</v-btn>
        </div>
        <v-btn color="primary" dark @click.stop="dialog2 = true">Load Template</v-btn>
      </v-layout>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            Choose a template:
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile avatar v-for="temp in temps" v-bind:key="temp.title" @click="loadTemplate(temp)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="temp.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import MonacoEditor from 'vue-monaco-editor'

export default {
  name: 'transformers',
  data() {
    return {
      str: "nada",
      code: '// Type away! \n',
      options: {
        selectOnLineNumbers: false
      },
      temps: [
          { title: 'xml to json' },
          { title: 'hl7 v2 to xml' },
          { title: 'hl7 v2 to json' }
        ],
      dialog2: false,
    }
  },
  
  computed: {

  },
  
  components:{
        MonacoEditor
    },
  created() {

    var vm = this;
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/messagemodifier')
      .then(function(response) {
        vm.code = response.data;
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    loadTemplate: function(temp){
      console.log(temp.title);
      this.dialog2 = false;
    },
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      this.code = editor.getValue();
      console.log(editor.getValue());
    },
    saveModifierScript: function() {
      console.log(this.code);
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/messagemodifier', {"message_modifier_script": this.code})
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


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
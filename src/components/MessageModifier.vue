<template>
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>
    <v-text-field v-model="scriptName" name="input-3" label="Script name:" value="Input text" class="pr-3"></v-text-field>
    
      <MonacoEditor
        height="600"
        language="javascript"
        :code= "code"
        :editorOptions="options"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        :theme="theme"
      >
      </MonacoEditor>

      <v-layout row>
        <div v-on:click="saveModifierScript()">
          <v-btn raised primary >Save</v-btn>
        </div>
        <v-btn color="primary" dark @click.stop="dialog2 = true">Load Template</v-btn>
        <div v-on:click="saveTemplate()">
          <v-btn raised primary >Save as Template</v-btn>
        </div>
      </v-layout>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            Choose a template:
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile avatar v-for="temp in templates" v-bind:key="temp.title" @click="loadTemplate(temp, editor)">
                <v-list-tile-content >
                  <v-list-tile-title v-text="temp.name"  ></v-list-tile-title>
                  <!--
                  <v-btn flat icon color="red" @click="deleteTemplate(temp)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  -->
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
      </v-flex >
    </v-layout >
  </v-container >
</template>

<script>
import axios from 'axios';
import MonacoEditor from 'vue-monaco-editor'

export default {
  name: 'transformers',
  data() {
    return {
      theme: 'vs',
      str: "nada",
      code: '// Type away! \n',
      scriptName: 'Enter script name here',
      options: {
        selectOnLineNumbers: false
      },
      temps: [
          { title: 'xml to json' },
          { title: 'hl7 v2 to xml' },
          { title: 'hl7 v2 to json' }
        ],
      dialog2: false,
      templates: []
    }
  },
  
  computed: {

  },
  
  components:{
        MonacoEditor
    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/serverconfig')
      .then(function(response) {
        vm.serverconfig = response.data;
        if (vm.serverconfig.isDarkTheme){
          vm.theme = 'vs-dark';
        } else {
          vm.theme = 'vs';
        }

      });
    // Make a request for a user with a given ID
    axios.get('http://localhost:3000/catalog/channel/' + this.$route.params.id + '/messagemodifier')
      .then(function(response) {
        vm.code = response.data.script;
        console.log(response.data.script);
        vm.scriptName = response.data.name;
      })
      .catch(function(error) {
        console.log(error);
      });

    axios.get('http://localhost:3000/catalog/scripttemplates')
      .then(function(response) {
        vm.templates = response.data;
        console.log('z templates:::: '+response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    //var vm : this,
    deleteTemplate: function(temp){
      console.log(temp);
        axios.post('http://localhost:3000/catalog/scripttemplates/' + temp._id +'/delete', {})
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    loadTemplate: function(temp, editor){

      this.code = temp.script;
      this.scriptName = temp.name;
      editor.setValue(this.code);
      this.dialog2 = false;
    },
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      console.log('jer jar');
      this.code = editor.getValue();
    },
    saveModifierScript: function() {
        axios.post('http://localhost:3000/catalog/channel/' + this.$route.params.id +'/messagemodifier', {"message_modifier_script": this.code, "message_modifier_script_name": this.scriptName})
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    saveTemplate: function() {
        axios.post('http://localhost:3000/catalog/scripttemplates/create', {"script": this.code, "name": this.scriptName})
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
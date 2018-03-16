<template>

  <div id="example-3" style="height:100%;width:100%;">
    <v-subheader >
    Script template configuration:
    </v-subheader>
        
    <v-layout row>
     <v-flex xs2>
    <v-card>
   
        <div>
            <v-list dense two-line subheader>
              <v-subheader inset>Templates:</v-subheader>
                <v-list-tile avatar v-for="temp in templates" v-bind:key="temp.title" @click="loadTemplate(temp)">
                    <v-list-tile-content >
                    <v-list-tile-title v-text="temp.name"  ></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>   
            </v-list>
        </div>

  </v-card>
      </v-flex>
        <v-flex xs10>
        <v-card>
        <v-layout column>
        <v-text-field v-model="selectedTemplate.name" name="input-3" label="Template name:" value="Input text" class="pr-3"></v-text-field>
        <MonacoEditor
            height="600"
            language="javascript"
            :code= "selectedTemplate.script"
            :editorOptions="options"
            @mounted="onMounted"
            @codeChange="onCodeChange"
            theme="vs"
        >
        </MonacoEditor>
              <v-layout row>
        <div v-on:click="saveTemplate()">
          <v-btn raised primary >Save</v-btn>
        </div>
        <v-btn color="primary" dark @click.stop="dialog2 = true">New</v-btn>
        <v-btn flat icon color="red" @click="deleteTemplate()">
            <v-icon>delete</v-icon>
        </v-btn>
      </v-layout>
        </v-layout>
        </v-card>
        </v-flex>
      
      </v-layout>

        <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            Enter template name:
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newTemplateName" name="input-3" label="Template name:" value="Input text" class="pr-3"></v-text-field>
          </v-card-text>
          <v-btn raised primary @click="createTemplate()">Done</v-btn>
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
      selectedTemplate: {script: '', name:''},
      newTemplateName: "New Template",
      str: "nada",
      code: '// Type away! \n',
      scriptName: 'Enter script name here',
      options: {
        selectOnLineNumbers: false
      },
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

    axios.get('http://localhost:3000/catalog/scripttemplates')
      .then(function(response) {
        vm.templates = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    //var vm : this,
    deleteTemplate: function(){
      console.log('running delete');
        axios.post('http://localhost:3000/catalog/scripttemplates/' + this.selectedTemplate._id +'/delete', {})
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    loadTemplate: function(temp){
      console.log('running load');
      this.selectedTemplate = temp;
      this.editor.setValue(this.selectedTemplate.script);
    },
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      this.selectedTemplate.script = editor.getValue();
    },
    saveTemplate: function() {
      console.log(this.selectedTemplate);
        axios.post('http://localhost:3000/catalog/scripttemplates/' + this.selectedTemplate._id +'/update', this.selectedTemplate)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    createTemplate: function(){
        axios.post('http://localhost:3000/catalog/scripttemplates/create', {"script": '', "name": this.newTemplateName})
        .then(function(response) {
            console.log(response);
            axios.get('http://localhost:3000/catalog/scripttemplates')
                .then(function(response) {
                this.templates = response.data;
                //this.selectedTemplate = this.templates[this.templates.length -1];
            })
            .catch(function(error) {
                console.log(error);
            });
        })
        .catch(function(error) {
            console.log(error);
        });
        this.dialog2 = false;
    }
  }

}
</script>


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
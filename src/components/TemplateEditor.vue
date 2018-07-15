<template>
  <div>
  <!--
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
    -->
  <v-container grid-list-md >
    <v-layout row wrap>
      <v-flex xs12>
    <v-subheader >
    Script template configuration:
    </v-subheader>
        
    <v-layout row>
     <v-flex xs2>
     <div class="pl-2">
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
  </div>
      </v-flex>
        <v-flex xs10>
        <div class="pl-2">
        <v-card >
        <v-card-title primary-title>
        Edit script:
        </v-card-title>
        <v-layout column >
        <v-text-field v-model="selectedTemplate.name" name="input-3" label="Template name:" value="Input text" ></v-text-field>
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
        </div>
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
          </v-flex >
    </v-layout >
  </v-container >
  </div>
</template>

<script>
import axios from 'axios';
import MonacoEditor from 'vue-monaco-editor';
import auth from '../auth/index';

export default {
  name: 'transformers',
  data() {
    return {
      drawer: true,
      navitems: [
          { icon: 'code', title: 'Script templates' },
          { icon: 'storage', title: 'Data truncation' }
      ],
      selectedTemplate: {script: '', name:''},
      newTemplateName: "New Template",
      str: "nada",
      code: '// Type away! \n',
      scriptName: 'Enter script name here',
      options: {
        selectOnLineNumbers: false
      },
      dialog2: false,
      templates: [],
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
        MonacoEditor
    },
  created() {
    var vm = this;
    axios.get('http://localhost:3000/catalog/scripttemplates', vm.axiosConfig)
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
      var vm = this;
        axios.post('http://localhost:3000/catalog/scripttemplates/' + this.selectedTemplate._id +'/delete', {}, vm.axiosConfig)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    loadTemplate: function(temp){
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
      var vm = this;
        axios.post('http://localhost:3000/catalog/scripttemplates/' + this.selectedTemplate._id +'/update', this.selectedTemplate, vm.axiosConfig)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    createTemplate: function(){
      var vm = this;
        axios.post('http://localhost:3000/catalog/scripttemplates/create', {"script": '', "name": this.newTemplateName}, vm.axiosConfig)
        .then(function(response) {
            axios.get('http://localhost:3000/catalog/scripttemplates', vm.axiosConfig)
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
    },
    navItem: function (itemTitle){
    },
  }

}
</script>


  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
  </style>
<template>
  <div>
    <v-container style="float:left;padding:0px;">
      <v-card>
        <v-layout row wrap>
          <v-flex xs12>
            <v-subheader>
              Script template configuration:
            </v-subheader>  
            <v-layout row>
              <v-flex xs3>
                <div class="pl-2">
                  <v-card>
                    <div>
                      <v-list dense subheader>
                        <v-subheader inset>Templates:</v-subheader>
                        <v-layout row>
                          <div class="pa-2">
                            <v-text-field
                              v-model="search"
                              append-icon="search"
                              label="Search"
                              single-line
                              hide-details
                              @input="onSearch"
                              append-outer-icon="add_box"
                              @click:append-outer="dialog2 = true">
                            </v-text-field>
                          </div>
                        </v-layout>
                        <template v-for="(item, index) in listItemsFiltered">
                          <v-divider :key="item._id"></v-divider>
                          <v-list-tile 
                            avatar 
                            v-bind:class="{ 'grey lighten-4': index % 2 === 0 & isDarkTheme === false,
                            'grey darken-4': index % 2 === 0 & isDarkTheme === true }" 
                            v-bind:key="index" 
                            @click="loadTemplate(item)">
                            <v-list-tile-content>
                              <v-list-tile-title v-text="item.name"  ></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn icon @click="deleteTemplate(item)">
                                <v-icon small color="pink">delete</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>   
                        </template>
                      </v-list>
                    </div>
                  </v-card>
                </div>
              </v-flex>
            <v-flex xs10>
              <div class="pl-2">
                <v-card >
                  <v-card-text>
                    <v-layout column >
                      <v-text-field 
                        v-model="selectedTemplate.name" 
                        name="input-3" 
                        label="Template name:" 
                        value="Input text" 
                        v-on:blur="autoSave()">
                      </v-text-field>
                      <MonacoEditor
                          height="550"
                          language="javascript"
                          :code= "selectedTemplate.script"
                          :editorOptions="options"
                          @mounted="onMounted"
                          @codeChange="onCodeChange"
                          :theme="theme"
                          :onblur="autoSave">
                      </MonacoEditor>
                    </v-layout>
                  </v-card-text>
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
              <v-text-field
                v-model="newTemplateName" 
                name="input-3" 
                label="Template name:" 
                value="Input text" 
                class="pr-3">
                </v-text-field>
            </v-card-text>
            <v-btn raised primary @click="createTemplate()">Done</v-btn>
          </v-card>
        </v-dialog>
      </v-flex >
    </v-layout >
  </v-card>
</v-container >
</div>
</template>

<script>
import axios from 'axios';
import MonacoEditor from 'vue-monaco-editor';
import auth from '../auth/index';
import _ from 'lodash';

export default {
  name: 'transformers',
  data() {
    return {
      search: '',
      drawer: true,
      navitems: [
          { icon: 'code', title: 'Script templates' },
          { icon: 'storage', title: 'Data truncation' }
      ],
      selectedTemplate: {script: '', name:''},
      newTemplateName: "New Template",
      code: '// Type away! \n',
      scriptName: 'Enter script name here',
      options: {
        selectOnLineNumbers: false
      },
      dialog2: false,
      listItems: [],
      listItemsFiltered: [],
      isDarkTheme: false,
    }
  },
  computed: {
    theme: function (){
      var vm = this;
      if (vm.isDarkTheme){
        return "vs-dark"
      } else {
        return "vs"
      }
    },
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
    axios.get('http://localhost:3000/catalog/serverconfig', vm.axiosConfig)
      .then(function(response) {
        vm.isDarkTheme = response.data.isDarkTheme;
      });
    axios.get('http://localhost:3000/catalog/scripttemplates', vm.axiosConfig)
      .then(function(response) {
        vm.listItems = response.data;
        vm.listItemsFiltered = vm.listItems;
      })
      .catch(function(error) {
        console.log(error);
      });

  },
  methods: {
    autoSave:function(){
      var vm = this;
      vm.saveTemplate();
    },
    onSearch: function(){
      var vm = this;
      if (vm.search.length > 2){
        vm.listItemsFiltered = _.filter(vm.listItems, function(item) { return (item.name.indexOf(vm.search) != -1); })
      }
      if (vm.search === ''){
        vm.listItemsFiltered = vm.listItems;
      }
    },
    //var vm : this,
    deleteTemplate: function(temp){
      var vm = this;
        axios.post('http://localhost:3000/catalog/scripttemplates/' + temp._id +'/delete', {}, vm.axiosConfig)
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
      var vm = this;
      this.editor = editor;
      this.editor.onDidBlurEditor(()=>{
        vm.autoSave();
      });

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
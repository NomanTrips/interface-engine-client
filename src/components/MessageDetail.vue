<template>
  <div style="height:100%;width:100%;">
      <v-container fluid>
      <div v-show="showMonaco">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{editorTitle}}</h3>
              <div>{{editorDescription}}</div>
            </div>
          </v-card-title>

     
       <MonacoEditor
        height="600"
        language="json"
        :code= "raw_data"
        :editorOptions="options"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        :theme="theme"
      >
      </MonacoEditor>
       
        </v-card>
      </div>

      <div v-show="showErrors">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Errors</h3>
              <div>Any errors in processing the message.</div>
            </div>
          </v-card-title>

          <v-card-text>
            {{err}}
          </v-card-text>
        </v-card>
      </div>
  </v-container>
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
  </div>



</template>

<script>

import axios from 'axios';
import auth from '../auth/index';
import MonacoEditor from 'vue-monaco-editor';

  export default {
    name: 'messagedetail',
    data () {
      return {
        editorTitle: 'Raw message',
        editorDescription: 'Message data recieved from the source.',
        code: '',
        theme: 'vs',
        options: {
          readOnly: true,
          selectOnLineNumbers: false,
          cursorStyle: "block"
        },
        showMonaco: true,
        showErrors: false,
        drawer: true,
        isExpanded: false,
        navitems: [
          { icon: 'input', title: 'Raw message' },
          { icon: 'mail', title: 'Transformed message' },
          { icon: 'error', title: 'Errors'  },
        ],
        raw_data : '',
        transformed_data: '',
        errors: '',
        items: [],
        clipped: false,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Message detail',
        err: '',
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
    vm.$parent.drawer = false;
    axios.get('http://localhost:3000/catalog/message/' +  this.$route.params.messageid, vm.axiosConfig)
      .then(function(response) {
        try{
          vm.raw_data = response.data.raw_data.toString();
          vm.editor.setValue(vm.raw_data);
        }catch(err){

        }
        try{
          vm.transformed_data = response.data.transformed_data.toString();
        }catch(err){

        }
        vm.err = response.data.err;  
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    onMounted(editor) {
      this.editor = editor;
      this.editor._configuration.editor.readOnly = true;
      //this.editor.defaults.readOnly = true;
      //console.log(editor);
   
    },
    onCodeChange(editor) {
      //this.code = editor.getValue();
    },
    navItem: function (itemTitle){
      var vm = this;
      if (itemTitle == 'Raw message'){
        vm.editor.setValue(vm.raw_data);
        vm.editorTitle = 'Raw message',
        vm.editorDescription = 'Message data recieved from the source.',
        vm.showErrors = false;
        vm.showMonaco = true;
      } else if (itemTitle == 'Transformed message'){
        vm.editor.setValue(vm.transformed_data);
        vm.editorTitle = 'Transformed message',
        vm.editorDescription = 'Message transformed by channel scripts.',
        vm.showErrors = false;
        vm.showMonaco = true;
      } else if (itemTitle == 'Errors'){
        vm.showErrors = true;
        vm.showMonaco = false;
      }
    },
  }
  }
</script>


<style>

</style>
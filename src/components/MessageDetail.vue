<template>
  <div style="height:100%;width:100%;">
      <v-container fluid>
  <v-subheader>Message details:</v-subheader>

      <v-text-field
        solo
        label="Search"
        prepend-icon="search"
      ></v-text-field>

    <v-tabs dark v-model="active">

      <v-tabs-bar >
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab"
          :href="'#' + tab"
          ripple
        >
          {{ tab }}
        </v-tabs-item>
        <v-tabs-slider class="yellow"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-content
        v-for="tab in tabs"
        :key="tab"
        :id="tab"
      >
        <v-card flat>
          <pre>
            <v-card-text>{{  tab_content[tabs.indexOf(active) ] }}</v-card-text>
          </pre>
        </v-card>
      </v-tabs-content>
    </v-tabs>

  </v-container>
  </div>



</template>

<script>

import axios from 'axios';

  export default {
    name: 'messagedetail',
    data () {
      return {
        tab_content: [],// ['-','-','-'],
        tabs: ['Raw', 'Transformed', 'Errors'],
        active: 'Transformed', // to handle refresh issue
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        raw_data : '',
        transformed_data: '',
        errors: '',
        items: [],
        clipped: false,
        drawer: false,
        fixed: false,

        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Message detail'
      }
    },
  created() {
    var vm = this;
    vm.$parent.drawer = false;
    axios.get('http://localhost:3000/catalog/message/' +  this.$route.params.messageid)
      .then(function(response) {
        vm.tab_content.push(response.data.raw_data);
        vm.tab_content.push(response.data.transformed_data);
        vm.tab_content.push('Stub error data.....');
        vm.active ='Raw'; // set to raw to handle refresh issue
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
           next () {
               console.log(this.active);
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      },

      onTabClick () {
                console.log('getting here');
        this.text = tab_content[this.active];
      }
  }
  }
</script>


<style>

</style>
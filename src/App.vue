
<template>
  <div id="app" >
  <!--
   <notifications group="foo"  position="top left"/>
   -->
    <notifications group="foo"  
                   position="top left"
                   animation-type="velocity"
                   animation-name="v-slide-right"
                   :speed="500"
                   width="100%"
                   classes="n-light"/>
    <!--
    <template slot="body" scope="props">
      <div>
          <a class="title">
            {{props.item.title}}
          </a>
          <a class="close" @click="props.close">
            <i class="fa fa-fw fa-close"></i>
          </a>
          <div v-html="props.item.text">
          </div>
      </div>
    </template>
    -->
    <v-app  :dark="isDarkTheme ? true : false">
      <v-content>

        <router-view></router-view>
      </v-content>
      <v-footer app >
        <span>&copy; 2017</span>
      </v-footer>
    </v-app>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  name: 'app',
  data() {
    return {
      isDarkTheme: false,
      navItems: [
        { icon: 'add', text: 'Add channel', path: '/channel/' + this.$route.params.id +'/messages' },
      ],
      items: [],
      clipped: true,
      drawer: false,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Interface engine'
    }
  },
  created() {
    var vm = this
    axios.get('http://localhost:3000/catalog/serverconfig')
      .then(function(response) {
        vm.isDarkTheme = response.data.isDarkTheme;
      });
  }
}
</script>

<style>
.notification.n-light {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  font-size: 13px;
  padding: 10px 20px;
  color: #495061;
  background: #EAF4FE;
  border: 1px solid #D4E8FD;
  .notification-title {
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 10px;
    color: #2589F3;
  }
}

</style>


<template>
  <div>
  <v-navigation-drawer app clipped fixed  width="200" v-model="drawer"
    stateless
    value="true"
  >
    <v-list>
      <v-list-group
        append-icon="settings"
        value="true"
      >
        <v-list-tile slot="activator" @click="navItem('Settings')">
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile>
        <v-list-group
          sub-group
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>Source</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        
        <v-list-group
          sub-group
          no-action
    
        >        
          <v-list-tile slot="activator">
            <v-list-tile-title>Destination</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        
      </v-list-group>

      <v-list-group
        append-icon="message"
        value="true"
      >
        <v-list-tile slot="activator" @click="navItem('Messages')">
          <v-list-tile-title>Messages</v-list-tile-title>
        </v-list-tile>
           <v-list-tile v-show="false">
            <v-list-tile-title class="pl-3">Send message</v-list-tile-title>
          </v-list-tile>

<!--
        <v-list-group
          sub-group
          no-action
          value="false"
        >

        </v-list-group>
-->
      </v-list-group>

      <v-list-group
        append-icon="code"
        value="true"
      >
        <v-list-tile slot="activator" @click="navItem('Scripts')">
          <v-list-tile-title>Scripts</v-list-tile-title>
        </v-list-tile>

      </v-list-group>

    </v-list>
  </v-navigation-drawer>
<!--
    <v-navigation-drawer app clipped fixed  v-model="drawer">
      <v-list>
     <v-list-group value="true"> 
          <v-list-tile v-for="item in navitems" :key="item.title" >
              <v-list-tile-title >{{ item.title }}</v-list-tile-title>
              <v-list-tile-action>
                <v-icon >{{ item.icon }}</v-icon>
              </v-list-tile-action>
           </v-list-tile>

           <v-list-group sub-group no-action value="true">
                    
            <v-list-tile  v-for="subitem in subitems" :key="subitem.title" @click="navItem(subitem.title)" >
              <v-list-tile-title >{{ subitem.title }}</v-list-tile-title>
              <v-list-tile-action>
                <v-icon >{{ subitem.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            </v-list-group>   
</v-list-group>
      </v-list>
    </v-navigation-drawer>
-->
    <router-view></router-view>


  </div>
</template>

<script>
export default {
  name: 'channel',
  data() {
    return {
            admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
      homePath: '/',
      navitems: [
        { icon: 'settings', title: 'Settings' },
        { icon: 'message', title: 'Messages'  },
        { icon: 'code', title: 'Scripts',   },
        { icon: 'storage', title: 'Storage', },
      ],
      subitems: [
        { icon: 'send', title: 'Send message' },
      ],
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  created() {
  },
  methods: {
    navItem: function (itemTitle){
      var vm = this;
      if (itemTitle == 'Settings'){
        vm.$router.push('/channel/' + this.$route.params.id + '/config');
      } else if (itemTitle == 'Messages'){
        vm.$router.push('/channel/' + this.$route.params.id + '/messages');
      } else if (itemTitle == 'Scripts'){
        vm.$router.push('/channel/' + this.$route.params.id + '/messagemodifier');
      } else if (itemTitle == 'Storage'){
        //vm.$router.push('/storage');
      }
    }
  }
}
</script>

<style>
#navigation-1 a {
  text-decoration: none;
}
</style>
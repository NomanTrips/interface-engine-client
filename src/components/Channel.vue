<template>
<div>
    <v-toolbar app>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.native.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <router-link v-bind:to="homePath" style="text-decoration:none;color:inherit;">
        <v-toolbar-title v-text="title" >
      </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn icon @click.native.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer class="grey lighten-4 pb-0"  app fixed :mini-variant="miniVariant" :clipped="true" v-model="drawer" >
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-layout row v-if="item.heading" align-center :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-divider dark v-else-if="item.divider" class="my-4" :key="i"></v-divider>
          <v-list-tile :key="i" v-else>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <router-link v-bind:to="item.path">{{ item.text }}</router-link>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <main>
      <v-container fluid>
          <v-layout column align-center>
            <router-view></router-view>
          </v-layout>
      </v-container>
    </main>
    </div>
</template>

<script>
export default {
  name: 'channel',
  data() {
    return {
      homePath: '/',
      items: [
        { icon: 'lightbulb_outline', text: 'Messages', path: '/channel/' + this.$route.params.id +'/messages' },
        { icon: 'touch_app', text: 'Config', path: '/channel/' + this.$route.params.id + '/config' },
        { icon: 'settings', text: 'Modify Message', path: '/channel/' + this.$route.params.id + '/messagemodifier' },
      ],
      clipped: true,
      drawer: true,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Interface engine'
    }
  },
  created() {
console.log(this.$route);
  }
}
</script>

<style>
#navigation-1 a {
  text-decoration: none;
}
</style>
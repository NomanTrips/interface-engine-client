
<template>
  <div id="app" >
    <v-app light>
      <v-content>
      <notifications group="foo" />
        <router-view></router-view>
      </v-content>
      <v-footer app >
        <span>&copy; 2017</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
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
}
</script>

<style>

</style>


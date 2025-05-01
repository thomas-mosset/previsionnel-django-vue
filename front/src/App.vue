<template>
  <v-app class="wrapper">
    <header>
      <NavbarMain />
    </header>

    <v-main>
      <RouterView />
    </v-main>

  </v-app>
</template>

<script setup>

import NavbarMain from './components/NavbarMain.vue';

</script>

<style scoped>

</style>

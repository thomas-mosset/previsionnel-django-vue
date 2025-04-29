<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app class="wrapper">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <v-main>
      <RouterView />
    </v-main>

  </v-app>
</template>

<style scoped>

</style>

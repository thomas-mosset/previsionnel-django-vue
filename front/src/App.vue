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
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import NavbarMain from './components/NavbarMain.vue';

const authStore = useAuthStore();

onMounted(() => {
  window.authStore = authStore;
  authStore.initialize();  // synchronizes the store with localStorage upon app installation
});
</script>

<style scoped>

</style>

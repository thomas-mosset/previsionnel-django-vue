<template>
  <div>
    <NavbarAuth v-if="isAuthenticated" />
    <NavbarGuest v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { toRef } from 'vue'
import NavbarAuth from './NavbarAuth.vue'
import NavbarGuest from './NavbarGuest.vue'

const authStore = useAuthStore()
const isAuthenticated = toRef(authStore, 'isAuthenticated')
</script>
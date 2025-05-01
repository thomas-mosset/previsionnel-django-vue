<template>
  <main>
    <v-container class="fill-height">
      <div v-if="!isAuthenticated" class="w-100 text-center mt-16">
        <v-row>
          <v-col cols="12">
            <p class="text-center">Vous n'êtes pas connecté. <router-link to="/login" class="font-weight-bold">Cliquez ici pour vous connecter.</router-link></p>
          </v-col>
        </v-row>
      </div>

      <div v-else class="w-100 text-center mt-16">
        <v-row>
          <v-col>
            <h1 class="font-weight-bold text-center mb-16">Bienvenue sur votre profil {{ user }}.</h1>
          </v-col>
        </v-row>
      
        <v-row class="d-flex justify-center">
          <v-col
            v-for="card in cardsInfos"
            :key="card.id"
            cols="12"
            md="6"
          >
            <v-card
              :color="color"
              class="mx-auto text-white py-8"
              elevation="8"
            >
              <v-card-item>
                <div>
                  <v-icon class="text-h3 me-3 mb-3">{{ card.icon }}</v-icon>

                  <div>
                    <div class="text-h6 font-weight-bold">{{ card.name }}</div>
                    <div class="text-caption">{{ card.description }}</div>
                  </div>
                </div>
              </v-card-item>

              <v-card-actions class="d-flex justify-center">
                <RouterLink :to="card.link" class="routerLink">
                  <v-btn variant="outlined" color="white" text="Accéder"></v-btn>
                </RouterLink>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </main>
</template>


<script setup>

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const user = authStore.user;
const isAuthenticated = authStore.isAuthenticated;

const color = ref('grey-darken-4');

const cardsInfos = [
  {
    id: 0,
    name: "Revenus",
    description: "Consultez et suivez vos sources de revenus mensuels.",
    link: "/incomes",
    icon: "mdi-cash-plus",
  },
  {
    id: 1,
    name: "Dépenses",
    description: "Analysez et gérez vos sorties d'argent.",
    link: "/expenses",
    icon: "mdi-cash-minus",
  },
  {
    id: 2,
    name: "Budget",
    description: "Créez des budgets pour mieux planifier.",
    link: "/budgets",
    icon: "mdi-account-cash",
  },
  {
    id: 3,
    name: "Catégories",
    description: "Organisez vos transactions par catégorie.",
    link: "/categories",
    icon: "mdi-view-list",
  },
];

</script>
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

      <div v-else class="w-100 text-center mt-2">
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
              color="grey-darken-4"
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

        <!-- card infos -->
        <v-row class="my-16">
          <v-col>
            <v-card
              class="mx-auto"
              width="400"
              elevation="8"
            >
              <template v-slot:title>
                <span class="font-weight-black">Mes informations</span>
              </template>

              <!-- displaying info -->
              <v-card-text v-if="!isEditing" class="bg-surface-light pt-4">
                Nom d'utilisateur : {{ user }}
              </v-card-text>
              <v-card-text v-if="!isEditing" class="bg-surface-light pt-4">
                Email : {{ userEmail }}
              </v-card-text>

              <!-- editing info -->
              <div v-else>
                <v-text-field
                  label="Nom d'utilisateur"
                  v-model="editedUser"
                  :rules="[rules.required]"
                  outlined
                />
                <v-text-field
                  label="Email"
                  v-model="editedEmail"
                  :rules="[rules.required, rules.email]"
                  outlined
                />
              </div>

              <v-card-actions class="d-flex justify-center">
                <v-btn @click="toggleEditMode">
                  {{ isEditing ? 'Sauvegarder' : 'Modifier' }}
                </v-btn>
                <v-btn @click="cancelEdit" v-if="isEditing">
                  Annuler
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- notifications for update -->
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="snackbarColor"
        elevation="8"
        location="top"
      >
        <v-row class="justify-center">
          <span class="text-center">{{ snackbarMessage }}</span>
        </v-row>
      </v-snackbar>

    </v-container>
  </main>
</template>


<script setup>

import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const snackbar = ref(false); // vuetify element
const snackbarMessage = ref(''); // vuetify element
const snackbarColor = ref('');

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userEmail = computed(() => authStore.userEmail);
const isAuthenticated = authStore.isAuthenticated;
const isEditing = ref(false);
const editedUser = ref(authStore.user);
const editedEmail = ref(authStore.userEmail);

const rules = {
  required: (v) => !!v || 'Champ requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
}

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

onMounted(() => {
  authStore.initialize();
});

const toggleEditMode = async () => {
  if (isEditing.value) {

    // edition mode -> try to save
    if (!editedUser.value || !editedEmail.value || !/.+@.+\..+/.test(editedEmail.value)) {
      snackbarMessage.value = "Champs invalides.";
      snackbar.value = true;
      snackbarColor.value = "deep-orange-accent-4 ";
      return;
    }

    // save edit in the store via API
    try {
      await authStore.updateUserInfo(editedUser.value, editedEmail.value);
      snackbarMessage.value = "Informations mises à jour.";
      snackbar.value = true;
      snackbarColor.value = "green-darken-4";

      // quit edition mode only if update is successfull
      isEditing.value = false;

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des informations', error);

      snackbarMessage.value = "Erreur lors de la mise à jour. Données réinitialisées.";
      snackbar.value = true;
      snackbarColor.value = "deep-orange-accent-4 ";

      // Reset inputs w/ store values
      editedUser.value = authStore.user;
      editedEmail.value = authStore.userEmail;
    }
  }  else {
    // Enter edit mode: initialize fields
    editedUser.value = authStore.user;
    editedEmail.value = authStore.userEmail;
    isEditing.value = true;
  }
};

const cancelEdit = () => {
  editedUser.value = authStore.user;
  editedEmail.value = authStore.userEmail;
  isEditing.value = false;
};

</script>
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

        <v-row class="my-16">
          <v-col>
            <v-sheet
              class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
              elevation="8"
              height="250"
              max-width="800"
              width="100%"
              rounded
            >
              <div>
                <h2 class="text-h4 font-weight-black">Paramètres</h2>

                <div class="text-body-1-medium my-2">
                 <p class="pb-2">Gérez votre compte utilisateur ici. <br /> Vous pouvez modifier votre mot de passe ou supprimer définitivement votre compte.</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex flex-column flex-sm-row justify-space-between align-center pt-4">
                  <v-btn
                    color="orange"
                    variant="outlined"
                    @click="updatePwdModal = true"
                  >
                    Modifier mon mot de passe
                  </v-btn>

                  <v-btn
                    color="deep-orange-accent-4"
                    variant="outlined"
                    @click="confirmDeleteModal = true"
                  >
                    Supprimer mon compte
                  </v-btn>
                </div>
              </div>
            </v-sheet>
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


      <!-- delete user profile modal / dialog -->
      <v-dialog v-model="confirmDeleteModal" max-width="500">
        <v-card class="pa-4">
          <v-card-title class="text-h4 font-weight-black text-center">Confirmation</v-card-title>

          <v-card-text>
            Êtes-vous sûr de vouloir <strong>supprimer définitivement</strong> votre compte ?
          </v-card-text>
          <v-card-text>
            Cette action est <span class="text-deep-orange-accent-4 font-weight-bold">irréversible</span> !
          </v-card-text>

          <v-card-actions class="d-flex justify-end">
            <v-btn text @click="confirmDeleteModal = false">Annuler</v-btn>
            <v-btn
              color="deep-orange-accent-4"
              variant="flat"
              @click="handleDeleteConfirmation"
            >
              Oui, supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- update user password modal / dialog -->
      <v-dialog v-model="updatePwdModal" max-width="600">
        <v-card class="pa-4">
          <v-card-title class="text-h4 font-weight-black text-center text-wrap">Changer le mot de passe</v-card-title>

          <v-card-text class="mt-4">
            <v-row justify="center">
              <v-col class="mx-auto" cols="12" md="10">
                <v-text-field
                  label="Mot de passe actuel"
                  type="password"
                  v-model="currentPwd"
                  :rules="[rules.required, rules.password]"
                  required
                ></v-text-field>
                <v-text-field
                  label="Nouveau mot de passe"
                  type="password"
                  v-model="newPwd"
                  :rules="[rules.required, rules.password]"
                  required
                ></v-text-field>

                <v-text-field
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  v-model="newPwdConfirmation"
                  :rules="[rules.required, rules.password]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

          </v-card-text>

          <v-card-actions class="d-flex justify-end">
            <v-btn text @click="updatePwdModal = false">Annuler</v-btn>
            <v-btn
              color="grey-darken-4"
              variant="flat"
              @click="handleUpdatePwdConfirmation"
            >
              Mettre à jour
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </main>
</template>


<script setup>

import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'

const router = useRouter()

const snackbar = ref(false); // vuetify element
const snackbarMessage = ref(''); // vuetify element
const snackbarColor = ref('');

const confirmDeleteModal = ref(false);
const updatePwdModal = ref(false);

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userEmail = computed(() => authStore.userEmail);
const isAuthenticated = authStore.isAuthenticated;
const isEditing = ref(false);
const editedUser = ref(authStore.user);
const editedEmail = ref(authStore.userEmail);

const currentPwd = ref("");
const newPwd = ref("");
const newPwdConfirmation = ref("");

const rules = {
  required: (v) => !!v || 'Champ requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
  password: (v) => {
    if (!v) return 'Mot de passe requis';
    // check password complexity : 
    // at least 8 chars long, 1 letter, 1 number, et 1 special char
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial';
  }
}

const cardsInfos = [
  {
    id: 0,
    name: "Revenus",
    description: "Consultez et suivez vos sources de revenus mensuels.",
    link: "/profil/incomes",
    icon: "mdi-cash-plus",
  },
  {
    id: 1,
    name: "Dépenses",
    description: "Analysez et gérez vos sorties d'argent.",
    link: "/profil/expenses",
    icon: "mdi-cash-minus",
  },
  {
    id: 2,
    name: "Budget",
    description: "Créez des budgets pour mieux planifier.",
    link: "/profil/budgets",
    icon: "mdi-account-cash",
  },
  {
    id: 3,
    name: "Catégories",
    description: "Organisez vos transactions par catégorie.",
    link: "/profil/categories",
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

const handleUpdatePwdConfirmation = async () => {
  await updatePWD();
};

const updatePWD = async () => {  
  if (!currentPwd.value || !newPwd.value || !newPwdConfirmation.value) {
    snackbarMessage.value = "Tous les champs sont requis.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;

    return;
  }

  if (!currentPwd.value === (!newPwd.value || !newPwdConfirmation.value)) {
    snackbarMessage.value = "Le nouveau mot de passe ne peut être identique à l'ancien.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;

    return;
  }

  if (newPwd.value !== newPwdConfirmation.value) {
    snackbarMessage.value = "Les nouveaux mots de passe ne correspondent pas.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;

    return;
  }

  try {
    await authStore.changeUserPassword(currentPwd.value, newPwd.value, newPwdConfirmation.value);

    snackbarMessage.value = "Mot de passe mis à jour avec succès.";
    snackbarColor.value = "green-darken-4";
    snackbar.value = true;

    updatePwdModal.value = false; // close modale / dialog

  } catch (error) {
    snackbarMessage.value = error.message || "Erreur lors de la mise à jour du mot de passe.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;

    updatePwdModal.value = false; // close modale / dialog
  }
};

const handleDeleteConfirmation = async () => {
  await deleteProfile();
  confirmDeleteModal.value = false;
};

const deleteProfile = async () => {  
  try {
    await authStore.deleteUser();

    snackbarMessage.value = "Compte supprimé avec succès.";
    snackbarColor.value = "green-darken-4";
    snackbar.value = true;

    setTimeout(() => {
      // Redirect to home page 3s later after successfull deletion
      router.push('/');
    }, 3000);

  } catch (error) {
    console.error('Erreur lors de la suppression du profil', error);

    snackbarMessage.value = "Erreur lors de la suppression du compte.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;
  }
};

</script>
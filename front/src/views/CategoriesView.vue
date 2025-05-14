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
            <h1 class="font-weight-bold text-center mb-16">Vos catégories</h1>
          </v-col>
        </v-row>

        <!-- ADD FORM -->
        <v-row v-if="!categoryStore.loading" class="mb-16">
          <v-col cols="12">
            <v-form ref="formRef" v-model="valid" class="d-flex align-center gap-4" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="name"
                label="Nom"
                :rules="[rules.required, rules.name]"
                dense
                hide-details="auto"
                class="w-20 mr-2"
              ></v-text-field>

              <v-select
                v-model="type"
                :items="typeOptions"
                label="Type"
                :rules="[rules.required]"
                no-data-text="Aucune donnée disponible"
                dense
                hide-details="auto"
                class="w-20 mr-2"
              ></v-select>

              <v-btn
                type="submit"
                variant="tonal"
                color="grey-darken-4"
                :disabled="!valid"
              >
                Ajouter
              </v-btn>

              <v-alert v-if="error" type="error" class="mt-12 text-center">{{ error }}</v-alert>
            </v-form>
          </v-col>
        </v-row>

        <v-row>
          <div v-if="categoryStore.loading" class="w-100 text-center">
            <p>Chargement...</p>
          </div>

          <div v-else-if="categoryStore.error" class="w-100 text-center">
            <p>{{ categoryStore.error }}</p>
          </div>

          <div v-else-if="categoryStore.categories.length === 0" class="w-100 text-center">
            <p>Vous n'avez pas encore de catégorie.</p>
          </div>

          <v-data-table
            v-else
            :headers="headers"
            items-per-page="5"
            :items="translatedCategories"
            :items-per-page-text="'Éléments par page'"
            class="elevation-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div v-if="editingCategoryId === item.id">
                    <v-text-field v-model="editedName" dense hide-details />
                  </div>
                  <div v-else>
                    {{ item.name }}
                  </div>
                </td>

                <td>
                  <div v-if="editingCategoryId === item.id">
                    <v-select
                      v-model="editedType"
                      :items="['Dépense', 'Revenu']"
                      dense
                      hide-details
                    />
                  </div>
                  <div v-else>
                    {{ item.type }}
                  </div>
                </td>
                
                <td>
                  <!-- EDIT MODE -->
                  <div v-if="editingCategoryId === item.id">
                    <v-btn @click="saveEditedCategory" class="mx-1">
                      <v-icon color="green-darken-4" icon="mdi-check"></v-icon>
                    </v-btn>

                    <v-btn @click="editingCategoryId = null" class="mx-1">
                      <v-icon color="grey-darken-4 " icon="mdi-close"></v-icon>
                    </v-btn>
                  </div>

                  <!-- DISPLAY MODE -->
                  <div v-else>
                    <v-btn @click="editCategory(item)" class="mx-1">
                      <v-icon color="warning" icon="mdi-pencil"></v-icon>
                    </v-btn>

                    <v-btn @click="deleteCategory(item.id)" class="ma-1">
                      <v-icon color="red" icon="mdi-delete"></v-icon>
                    </v-btn>
                  </div>
                </td>

              </tr>
            </template>
          </v-data-table>
        </v-row>

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

      </div>
    </v-container>
  </main>
</template>


<script setup>
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/category';

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories);

const snackbar = ref(false); // vuetify element
const snackbarMessage = ref(''); // vuetify element
const snackbarColor = ref('');

// add form
const name = ref('');
const type = ref('');
const valid = ref(false)
const error = ref(null)
const typeOptions = ['Dépense', 'Revenu'];

// validation add form
const rules = {
  required: (v) => !!v || 'Champ requis',
  name: (v) => /^[a-zA-Z0-9_]+$/.test(v.length >= 3) || "Minimum 3 caractères",
}

// edit mode
const editingCategoryId = ref(null);
const editedName = ref('');
const editedType = ref('');

onMounted(() => {
  authStore.initialize();
  categoryStore.fetchCategories();
});

const headers = ref([
    { title: 'Nom', align: 'center', key: 'name'},
    { title: 'Type', align: 'center', key: 'type' },
    { title: 'Actions', align: 'center', key: 'actions' },
  ])

const translatedCategories = computed(() => {
  return categories.value.map(category => {
    return {
      ...category,
      type: category.type === 'EXPENSE' ? 'Dépense' : category.type === 'INCOME' ? 'Revenu' : category.type
    };
  });
});

const handleSubmit = async () => {
  error.value = null

  if (type.value === "Dépense") {
    type.value = "EXPENSE";
  } else if (type.value === "Revenu") {
    type.value = "INCOME";
  }

  try {
    await categoryStore.addCategory(name.value, type.value);

    snackbarMessage.value = 'Catégorie ajoutée !';
    snackbarColor.value = 'green-darken-4';
    snackbar.value = true;

    // Reset form
    setTimeout(() => {
      name.value = '';
      type.value = '';
    }, 3000);

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la catégorie', error);

    snackbarMessage.value = "Erreur lors de l'ajout.";
    snackbarColor.value = 'deep-orange-accent-4';
    snackbar.value = true;
  }
};

function editCategory(category) {
  editingCategoryId.value = category.id;
  editedName.value = category.name;
  editedType.value = category.type;
}

const saveEditedCategory = async () => {
  // translate the categories types to french
  if (editedType.value === "Dépense") {
    editedType.value = "EXPENSE";
  } else if (editedType.value === "Revenu") {
    editedType.value = "INCOME";
  }

  try {
    await categoryStore.updateCategory(
      editingCategoryId.value,
      editedName.value,
      editedType.value,
    );

    // quit edit mode and go back to display mode
    editingCategoryId.value = null;

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie', error);

    snackbarMessage.value = 'Erreur lors de la mise à jour.';
    snackbarColor.value = 'deep-orange-accent-4';
    snackbar.value = true;
  }
};

const deleteCategory = async (id) => {
  try {
    // delete category
    await categoryStore.deleteCategory(id);

    // msg for the user via snackbar
    snackbarMessage.value = "Catégorie supprimée avec succès.";
    snackbarColor.value = "green-darken-4";
    snackbar.value = true;

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie', error);

    snackbarMessage.value = "Erreur lors de la suppression de la catégorie.";
    snackbarColor.value = "deep-orange-accent-4";
    snackbar.value = true;
  }
}

</script>

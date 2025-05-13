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

        <v-row>
          <div v-if="categoryStore.loading">
            <p class="text-center">Chargement...</p>
          </div>

          <div v-else-if="categoryStore.error">
            <p class="text-center">{{ categoryStore.error }}</p>
          </div>

          <div v-else-if="categories.length === 0">
            <p class="text-center">Vous n'avez pas encore de catégorie.</p>
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
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <v-btn @click="editCategory(item)" class="mx-1">
                    <v-icon color="warning" icon="mdi-pencil"></v-icon>
                  </v-btn>
                  <v-btn @click="deleteCategory(item.id)" class="ma-1">
                    <v-icon color="red" icon="mdi-delete"></v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

        </v-row>

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

const categories = categoryStore.categories;

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
  return categories.map(category => {
    return {
      ...category,
      type: category.type === 'EXPENSE' ? 'Dépense' : category.type === 'INCOME' ? 'Revenu' : category.type
    };
  });
});

function editCategory(category) {
  // TODO open modal to edit
  console.log('Éditer :', category);
}

function deleteCategory(id) {
  // TODO in pinia
  console.log('Suppression :', id);
}

</script>

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
                        <h1 class="font-weight-bold text-center mb-16">Vos revenus</h1>
                    </v-col>
                </v-row>

                <!-- ADD FORM -->
                <v-row v-if="!incomeStore.loading">
                    <v-col cols="12">
                        <h2 class="mb-6">Ajouter un revenu</h2>

                        <v-form ref="formRef" v-model="valid" class="mb-6 d-flex align-center" @submit.prevent="handleSubmit">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        class="mx-1"
                                        v-model="description"
                                        label="Description"
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select
                                        class="mx-1"
                                        label="Catégorie"
                                        v-model="category"
                                        :items="incomeTypeCategories"
                                        item-title="name"
                                        item-value="id"
                                        :rules="[rules.required]"
                                        no-data-text="Aucune donnée disponible"
                                    ></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-number-input
                                        class="mx-1"
                                        label="Montant"
                                        :min="1"
                                        v-model="amount"
                                        :rules="[rules.required]"
                                    ></v-number-input>
                                </v-col>
   
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        class="mx-1"
                                        v-model="date"
                                        label="Date"
                                        type="date"
                                        :rules="[rules.required]"
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-btn
                                        class="mx-1"
                                        type="submit"
                                        variant="tonal"
                                        color="grey-darken-4"
                                        :disabled="!valid"
                                    >
                                        Ajouter
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>

                <v-row>
                    <div v-if="incomeStore.loading" class="w-100 text-center">
                        <p>Chargement...</p>
                    </div>

                    <div v-else-if="incomeStore.error" class="w-100 text-center">
                        <p>{{ incomeStore.error }}</p>
                    </div>

                    <div v-else-if="incomeStore.incomes.length === 0" class="w-100 text-center">
                        <p>Vous n'avez pas encore de revenu.</p>
                    </div>

                    <v-data-table
                        v-else
                        :headers="headers"
                        items-per-page="5"
                        :items="displayedIncomesWithTextCategories"
                        :items-per-page-text="'Éléments par page'"
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td>
                                    <div>
                                        {{ formatDate(item.date) }}
                                    </div>
                                </td>

                                <td>
                                    <div v-if="item.description">
                                        {{ item.description }}
                                    </div>
                                    <div v-else>
                                        Pas de description disponible
                                    </div>
                                </td>

                                <td>
                                    <div>
                                        {{ item.category }}
                                    </div>
                                </td>

                                <td>
                                    <div>
                                        {{ item.amount }} €
                                    </div>
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
import { onMounted, computed, ref } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/category';
import { useIncomeStore } from "@/stores/income";

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const categoryStore = useCategoryStore();
const categories = categoryStore.categories;

const incomeStore = useIncomeStore();

// add form
const valid = ref(false)
const error = ref(null)
const date = ref('');
const description = ref(null);
const category = ref('');
const amount = ref();

// validation add form
const rules = {
  required: (v) => !!v || 'Champ requis',
}

onMounted(() => {
    authStore.initialize();
    categoryStore.fetchCategories();
    incomeStore.fetchIncomes();
})

const headers = ref([
    { title: 'Date', align: 'center', key: 'date' },
    { title: 'Description', align: 'center', key: 'description' },
    { title: 'Catégorie', align: 'center', key: 'category' },
    { title: 'Montant', align: 'center', key: 'amount' },
])

function formatDate(dateString) {
    // currently get the date as year-month-day from the API
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); // "03"
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // "05"
    const year = date.getFullYear(); // 2025

    return `${day}-${month}-${year}`;    
};

const displayedIncomesWithTextCategories = computed(() => {
    // currently get the catgeory as an id
    // here we link the id to the category's name (as text) through the categoryStore

    return incomeStore.incomes.map(income => {
        const category = categoryStore.categories.find(category => category.id === income.category);

        return {
            ...income,
            category: category ? category.name : 'Catégorie inconnue',
        };
    });
});

const incomeTypeCategories = computed(() => {
    const incomeTypeCategories = Array.isArray(categories)
    ? categories.filter(category => category.type === 'INCOME')
    : [];

    return incomeTypeCategories;
});

const handleSubmit = async () => {
    console.log("handleSubmit");

    error.value = null

    // TODO
};

</script>
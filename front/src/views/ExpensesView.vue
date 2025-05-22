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
                        <h1 class="font-weight-bold text-center mb-16">Vos dépenses</h1>
                    </v-col>
                </v-row>

                <!-- ADD FORM -->
                <v-row v-if="!expenseStore.loading">
                    <v-col cols="12">
                        <h2 class="mb-6">Ajouter une dépense</h2>

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
                    <div v-if="expenseStore.loading" class="w-100 text-center">
                        <p>Chargement...</p>
                    </div>

                    <div v-else-if="expenseStore.error" class="w-100 text-center">
                        <p>{{ expenseStore.error }}</p>
                    </div>

                    <div v-else-if="expenseStore.expenses.length === 0" class="w-100 text-center">
                        <p>Vous n'avez pas encore de dépense.</p>
                    </div>

                    <v-data-table
                        v-else
                        :headers="headers"
                        items-per-page="5"
                        :items="displayedExpensesWithTextCategories"
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

                                <td>
                                    <div>
                                        <v-btn class="mx-1">
                                            <v-icon color="warning" icon="mdi-pencil"></v-icon>
                                        </v-btn>

                                        <v-btn class="ma-1">
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
import { onMounted, computed, ref } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/category';
import { useExpenseStore } from "@/stores/expense";

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);

const expenseStore = useExpenseStore();

const snackbar = ref(false); // vuetify element
const snackbarMessage = ref(''); // vuetify element
const snackbarColor = ref('');

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
    expenseStore.fetchExpenses();
    categoryStore.fetchCategories();
})

const headers = ref([
    { title: 'Date', align: 'center', key: 'date' },
    { title: 'Description', align: 'center', key: 'description' },
    { title: 'Catégorie', align: 'center', key: 'category' },
    { title: 'Montant', align: 'center', key: 'amount' },
    { title: 'Actions', align: 'center', key: 'actions' },
])

function formatDate(dateString) {
    // currently get the date as year-month-day from the API
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); // "03"
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // "05"
    const year = date.getFullYear(); // 2025

    return `${day}-${month}-${year}`;    
};

const displayedExpensesWithTextCategories = computed(() => {
    return expenseStore.expenses.map(expense => {
        const category = categoryStore.categories.find(category => category.id === expense.category);

        return {
            ...expense,
            originalCategory: expense.category,
            category: category ? category.name : 'Catégorie inconnue',
        };
    });
});

const incomeTypeCategories = computed(() => {
    const rawCategories = categories.value;

    return Array.isArray(rawCategories)
    ? rawCategories.filter(category => category.type === 'EXPENSE')
    : [];
});

const handleSubmit = async () => {
    error.value = null

    try {
        await expenseStore.addExpense(category.value, amount.value, date.value, description.value);

        snackbarMessage.value = 'Dépense ajoutée !';
        snackbarColor.value = 'green-darken-4';
        snackbar.value = true;

        // Reset form
        setTimeout(() => {
            date.value = '';
            description.value = null;
            category.value = '';
            amount.value = null;
        }, 3000);

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la dépense', error);

        snackbarMessage.value = "Erreur lors de l'ajout.";
        snackbarColor.value = 'deep-orange-accent-4';
        snackbar.value = true;
    }
};

</script>
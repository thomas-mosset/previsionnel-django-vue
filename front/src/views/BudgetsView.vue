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
                        <h1 class="font-weight-bold text-center mb-16">Vos Budgets</h1>
                    </v-col>
                </v-row>


                <v-row v-if="!budgetStore.loading">
                    <v-col cols="12">
                        <h2 class="mb-6">Ajouter un budget</h2>

                        <v-form ref="formRef" v-model="valid" class="mb-6 d-flex align-center" @submit.prevent="handleSubmit">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select
                                        class="mx-1"
                                        label="Mois"
                                        v-model="month"
                                        :items="formSelectMonths"
                                        item-title="text"
                                        item-value="id"
                                        :rules="[rules.required]"
                                        no-data-text="Aucune donnée disponible"
                                    ></v-select>
                                </v-col>
 
                                <v-col cols="12" md="6">
                                    <v-number-input
                                        class="mx-1"
                                        :min="currentYear"
                                        v-model="year"
                                        label="Année"
                                        :rules="[rules.required]"
                                    ></v-number-input>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select
                                        class="mx-1"
                                        label="Catégorie"
                                        v-model="category"
                                        :items="expenseTypeCategories"
                                        item-title="name"
                                        item-value="id"
                                        :rules="[rules.required]"
                                        no-data-text="Aucune donnée disponible"
                                    ></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-number-input
                                        class="mx-1"
                                        :min="1"
                                        v-model="amount"
                                        label="Montant"
                                        :rules="[rules.required]"
                                    ></v-number-input>
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
                    <div v-if="budgetStore.loading" class="w-100 text-center">
                        <p>Chargement...</p>
                    </div>

                    <div v-else-if="budgetStore.error" class="w-100 text-center">
                        <p>{{ budgetStore.error }}</p>
                    </div>

                    <div v-else-if="budgetStore.budgets.length === 0" class="w-100 text-center">
                        <p>Vous n'avez pas encore de budgets.</p>
                    </div>
                
                    <v-data-table
                        v-else
                        :headers="headers"
                        items-per-page="5"
                        :items="displayBudgetsWithTextCategories"
                        :items-per-page-text="'Éléments par page'"
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td>
                                    <div>
                                        {{ displayMonthsAsText(item.month) }}
                                    </div>
                                </td>

                                <td>
                                    <div>
                                        {{ item.year }}
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
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useBudgetStore } from '@/stores/budget';
import { useCategoryStore } from '@/stores/category';

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);

const budgetStore = useBudgetStore();

const snackbar = ref(false); // vuetify element
const snackbarMessage = ref(''); // vuetify element
const snackbarColor = ref('');

// add form
const valid = ref(false)
const error = ref(null)
const month = ref();
const year = ref();
const category = ref('');
const amount = ref(1);

// validation add form
const rules = {
  required: (v) => !!v || 'Champ requis',
}

onMounted(() => {
    authStore.initialize();
    budgetStore.fetchBudgets();
    categoryStore.fetchCategories();
})

const headers = ref([
    { title: 'Mois', align: 'center', key: 'month' },
    { title: 'Année', align: 'center', key: 'year' },
    { title: 'Catégorie', align: 'center', key: 'category' },
    { title: 'Montant', align: 'center', key: 'amount' },
])

const formSelectMonths = [
    { text: 'Janvier', id: 1 },
    { text: 'Février', id: 2 },
    { text: 'Mars', id: 3 },
    { text: 'Avril', id: 4 },
    { text: 'Mai', id: 5 },
    { text: 'Juin', id: 6 },
    { text: 'Juillet', id: 7 },
    { text: 'Août', id: 8 },
    { text: 'Septembre', id: 9 },
    { text: 'Octobre', id: 10 },
    { text: 'Novembre', id: 11 },
    { text: 'Décembre', id: 12 },
];

const currentYear = new Date().getFullYear();

function displayMonthsAsText(monthNumber) {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return months[monthNumber - 1] || "Mois invalide";
};

const displayBudgetsWithTextCategories = computed(() => {
    return budgetStore.budgets.map(budget => {
        const category = categoryStore.categories.find(category => category.id === budget.category);

        return {
            ...budget,
            originalCategory: budget.category,
            category: category ? category.name : 'Catégorie inconnue',
        }
    })
});

// restrict the categories only to expenses
const expenseTypeCategories = computed(() => {
    const rawCategories = categories.value;

    return Array.isArray(rawCategories)
    ? rawCategories.filter(category => category.type === 'EXPENSE')
    : [];
});

const handleSubmit = async () => {
    error.value = null;

    try {
        await budgetStore.addBudget(month.value, year.value, category.value, amount.value);

        snackbarMessage.value = 'Budget ajouté !';
        snackbarColor.value = 'green-darken-4';
        snackbar.value = true;

        // Reset form
        setTimeout(() => {
            month.value = null;
            year.value = null;
            category.value = '';
            amount.value = null;
        }, 3000); 

    } catch (error) {
        console.error('Erreur lors de l\'ajout du budget', error);

        snackbarMessage.value = "Erreur lors de l'ajout.";
        snackbarColor.value = 'deep-orange-accent-4';
        snackbar.value = true; 
    }
};


</script>
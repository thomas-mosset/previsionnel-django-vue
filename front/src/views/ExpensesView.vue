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
                                        <div v-if="editingExpenseId === item.id">
                                        <v-text-field
                                            class="mx-1"
                                            v-model="editedDate"
                                            label="Date"
                                            type="date"
                                            hide-details
                                        ></v-text-field>
                                    </div>
                                    <div v-else>
                                        {{ formatDate(item.date) }}
                                    </div>
                                </td>

                                <td>
                                    <div v-if="editingExpenseId === item.id">
                                        <v-text-field v-model="editedDescription" hide-details />
                                    </div>

                                    <div v-else>
                                        <div v-if="item.description">
                                            {{ item.description }}
                                        </div>
                                        <div v-else>
                                            Pas de description disponible
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div v-if="editingExpenseId === item.id">
                                        <v-select
                                            class="mx-1"
                                            label="Catégorie"
                                            v-model="editedCategory"
                                            :items="expenseTypeCategories"
                                            item-title="name"
                                            item-value="id"
                                            no-data-text="Aucune donnée disponible"
                                            hide-details
                                        ></v-select>
                                    </div>

                                    <div v-else>
                                        {{ item.category }}
                                    </div>
                                </td>

                                <td>
                                    <div v-if="editingExpenseId === item.id" class="my-2">
                                        <v-number-input
                                            class="mx-1"
                                            label="Montant"
                                            :min="1"
                                            v-model="editedAmount"
                                            hide-details
                                        ></v-number-input>
                                    </div>

                                    <div v-else>
                                        {{ item.amount }} €
                                    </div>
                                </td>

                                <td>
                                    <!-- EDIT MODE -->
                                    <div v-if="editingExpenseId === item.id">
                                        <v-btn @click="saveEditedExpense" class="mx-1">
                                            <v-icon color="green-darken-4" icon="mdi-check"></v-icon>
                                        </v-btn>

                                        <v-btn @click="editingExpenseId = null" class="mx-1">
                                            <v-icon color="grey-darken-4 " icon="mdi-close"></v-icon>
                                        </v-btn>
                                    </div>

                                    <!-- DISPLAY MODE -->
                                    <div v-else>
                                        <v-btn @click="editExpense(item)" class="mx-1">
                                            <v-icon color="warning" icon="mdi-pencil"></v-icon>
                                        </v-btn>

                                        <v-btn @click="deleteExpense(item.id)" class="ma-1">
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

// edit mode
const editingExpenseId = ref(null);
const editedDate = ref('');
const editedDescription = ref(null);
const editedCategory = ref('');
const editedAmount = ref();

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

const expenseTypeCategories = computed(() => {
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

function editExpense(expense) {
    editingExpenseId.value = expense.id;
    editedDate.value = expense.date;
    editedDescription.value = expense.description;
    editedCategory.value = expense.originalCategory || expense.category;
    editedAmount.value = parseFloat(expense.amount) || 0; 
};

const saveEditedExpense = async () => {
    try {
        await expenseStore.updateExpense(
            editingExpenseId.value,
            Number(editedCategory.value),
            Number(editedAmount.value),
            editedDate.value,
            editedDescription.value,
        );

        editingExpenseId.value = null;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la dépense', error);

        snackbarMessage.value = 'Erreur lors de la mise à jour.';
        snackbarColor.value = 'deep-orange-accent-4';
        snackbar.value = true;  
    }
};

const deleteExpense = async (id) => {
    try {
        await expenseStore.deleteExpense(id);

        snackbarMessage.value = "Dépense supprimée avec succès.";
        snackbarColor.value = "green-darken-4";
        snackbar.value = true;

    } catch (error) {
        console.error('Erreur lors de la suppression de la dépense', error);

        snackbarMessage.value = "Erreur lors de la suppression de la dépense.";
        snackbarColor.value = "deep-orange-accent-4";
        snackbar.value = true;
    }
};

</script>
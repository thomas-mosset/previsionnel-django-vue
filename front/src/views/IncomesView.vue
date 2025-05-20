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
                                    <div v-if="editingIncomeId === item.id">
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
                                    <div v-if="editingIncomeId === item.id">
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
                                    <div v-if="editingIncomeId === item.id">
                                        <v-select
                                            class="mx-1"
                                            label="Catégorie"
                                            v-model="editedCategory"
                                            :items="incomeTypeCategories"
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
                                    <div v-if="editingIncomeId === item.id" class="my-2">
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
                                    <div v-if="editingIncomeId === item.id">
                                        <v-btn @click="saveEditedIncome" class="mx-1">
                                            <v-icon color="green-darken-4" icon="mdi-check"></v-icon>
                                        </v-btn>

                                        <v-btn @click="editingIncomeId = null" class="mx-1">
                                            <v-icon color="grey-darken-4 " icon="mdi-close"></v-icon>
                                        </v-btn>
                                    </div>

                                    <!-- DISPLAY MODE -->
                                    <div v-else>
                                        <v-btn @click="editIncome(item)" class="mx-1">
                                            <v-icon color="warning" icon="mdi-pencil"></v-icon>
                                        </v-btn>

                                        <v-btn @click="deleteIncome(item.id)" class="ma-1">
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
import { useIncomeStore } from "@/stores/income";

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);

const incomeStore = useIncomeStore();

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
const editingIncomeId = ref(null);
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
    categoryStore.fetchCategories();
    incomeStore.fetchIncomes();
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

const displayedIncomesWithTextCategories = computed(() => {
    // currently get the catgeory as an id
    // here we link the id to the category's name (as text) through the categoryStore

    return incomeStore.incomes.map(income => {
        const category = categoryStore.categories.find(category => category.id === income.category);

        return {
            ...income,
            originalCategory: income.category, // keep the id
            category: category ? category.name : 'Catégorie inconnue',
        };
    });
});

const incomeTypeCategories = computed(() => {
    const rawCategories = categories.value;

    return Array.isArray(rawCategories)
    ? rawCategories.filter(category => category.type === 'INCOME')
    : [];
});

const handleSubmit = async () => {
    error.value = null

    try {
        await incomeStore.addIncome(category.value, amount.value, date.value, description.value);

        snackbarMessage.value = 'Revenu ajouté !';
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
        console.error('Erreur lors de l\'ajout du revenu', error);

        snackbarMessage.value = "Erreur lors de l'ajout.";
        snackbarColor.value = 'deep-orange-accent-4';
        snackbar.value = true;
    }
};

function editIncome(income) {
    editingIncomeId.value = income.id;
    editedDate.value = income.date;
    editedDescription.value = income.description;
    editedCategory.value = income.originalCategory || income.category; // keep the id
    editedAmount.value = parseFloat(income.amount) || 0; // so we are sure to deal with a number
};

const saveEditedIncome = async () => {
    try {
        await incomeStore.updateIncome(
            editingIncomeId.value,
            Number(editedCategory.value),
            Number(editedAmount.value),
            editedDate.value,
            editedDescription.value,
        );

        editingIncomeId.value = null;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du revenu', error);

        snackbarMessage.value = 'Erreur lors de la mise à jour.';
        snackbarColor.value = 'deep-orange-accent-4';
        snackbar.value = true;  
    }
};

const deleteIncome = async (id) => {
    try {
        await incomeStore.deleteIncome(id);

        snackbarMessage.value = "Revenu supprimé avec succès.";
        snackbarColor.value = "green-darken-4";
        snackbar.value = true;

    } catch (error) {
        console.error('Erreur lors de la suppression du revenu', error);

        snackbarMessage.value = "Erreur lors de la suppression du revenu.";
        snackbarColor.value = "deep-orange-accent-4";
        snackbar.value = true;
    }
};

</script>
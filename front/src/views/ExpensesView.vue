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

const expenseStore = useExpenseStore();

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

</script>
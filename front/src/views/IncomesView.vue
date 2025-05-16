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
const incomeStore = useIncomeStore();

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

</script>
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
                        :items="budgetStore.budgets"
                        :items-per-page-text="'Éléments par page'"
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td>
                                    <div>
                                        {{ item.month }}
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
            </div>
        </v-container>
    </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useBudgetStore } from '@/stores/budget';

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;

const budgetStore = useBudgetStore();

onMounted(() => {
    authStore.initialize();
    budgetStore.fetchBudgets();
})

const headers = ref([
    { title: 'Mois', align: 'center', key: 'month' },
    { title: 'Année', align: 'center', key: 'year' },
    { title: 'Catégorie', align: 'center', key: 'category' },
    { title: 'Montant', align: 'center', key: 'amount' },
])


</script>
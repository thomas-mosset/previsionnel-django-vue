<template>
    <div class="mb-16">
        <v-row>
            <v-col cols="12">
                <h2 class="mb-6">Filtrer les données par :</h2>
            </v-col>

            <v-col cols="12" md="4">
                <v-select
                    class="mx-1"
                    v-model="selectedMonth"
                    :items="formSelectMonths"
                    item-title="text"
                    item-value="id"
                    label="Mois"
                />
            </v-col>

            <v-col cols="12" md="4">
                <v-number-input
                    class="mx-1"
                    :min="2020"
                    :max="2040"
                    v-model="selectedYear"
                    label="Année"
                ></v-number-input>
            </v-col>

            <v-col cols="12" md="4">
                <v-select
                    class="mx-1"
                    v-model="selectedCategory"
                    :items="filteredExpensesCategories"
                    item-title="name"
                    item-value="id"
                    label="Catégorie de dépenses"
                    :clearable="true"
                />
            </v-col>
        </v-row>

        <v-row>
            <Bar 
                :data="chartData" 
                :aria-label="chartAriaLabel"
            />
            <h3 class="my-6 mx-auto">{{ chartAriaLabel }}</h3>
        </v-row>

        <v-row class="my-6 mx-auto">
            <!-- if no category is selected -->
            <v-col cols="12" v-if="selectedCategory === null">
                <p> Vous avez utilisé <span class="font-weight-bold">{{ totalExpense }} €</span> des <span class="font-weight-bold">{{ totalBudget }} €</span> prévus dans votre budget total de dépenses.</p>
            
                <!-- if budget is < to total expense then money is XX amount of left-->
                <p v-if="totalBudget - totalExpense < 0">
                    <span>
                        <v-icon color="deep-orange-accent-4" icon="mdi-alert" size="x-large"></v-icon>
                    </span>
                    Vous avez dépassé votre budget de <span class="font-weight-bold">{{ Math.abs(totalBudget - totalExpense) }} €</span> pour le mois {{ monthPrefix }}<span class="font-weight-bold">{{ monthName.toLowerCase() }} {{ selectedYear }}</span>.
                </p>

                <!-- if budget is > to total expense then  XX amount of money is left -->
                <p v-else-if="totalBudget - totalExpense > 0">
                    Il vous reste donc <span class="font-weight-bold">{{ totalBudget - totalExpense }} €</span> pour le mois {{ monthPrefix }}<span class="font-weight-bold">{{ monthName.toLowerCase() }} {{ selectedYear }}</span>.
                </p>

                <!-- if budget is = to total expense then no money is left and user needs to be carefull until next month -->
                <p v-else-if="totalBudget - totalExpense === 0">
                    Vous avez utilisé l'intégralité de votre budget pour le mois {{ monthPrefix }}<span class="font-weight-bold">{{ monthName.toLowerCase() }} {{ selectedYear }}</span>. Soyez vigilant·e jusqu'au mois prochain.
                </p>
            </v-col>

            <!-- if a category is selected -->
            <v-col cols="12" v-else>
                <p>Vous avez utilisé <span class="font-weight-bold">{{ totalExpense }} €</span> des {{ totalBudget }} € prévus dans votre <span class="font-weight-bold">budget</span> pour la catégorie "<span class="font-weight-bold">{{ selectedCategoryName.toLowerCase() }}"</span>.</p>

                    <p v-if="totalBudget - totalExpense < 0">

                        <!-- if budget is < to total expense then money is no money is left and user has exceeded their budget -->
                        <span>
                            <v-icon color="deep-orange-accent-4" icon="mdi-alert" size="x-large"></v-icon>
                        </span>
                        <span class="font-weight-bold">Vous avez dépassé votre budget de {{ Math.abs(totalBudget - totalExpense) }} €</span> pour le mois {{ monthPrefix }}<span class="font-weight-bold">{{ monthName.toLowerCase() }} {{ selectedYear }}</span>.
                    </p>

                    <!-- if budget is > to total expense then some money is left -->
                    <p v-else-if="totalBudget - totalExpense > 0">
                        Il vous reste donc <span class="font-weight-bold">{{ totalBudget - totalExpense }} €</span> pour le mois {{ monthPrefix }}<span class="font-weight-bold">{{ monthName.toLowerCase() }} {{ selectedYear }}</span>.
                    </p>

                    <!-- if budget is = to total expense then no money is left and user needs to be carefull until next month -->
                    <p v-else-if="totalBudget - totalExpense === 0" class="font-weight-bold">
                        <span>
                            <v-icon color="deep-orange-accent-4" icon="mdi-alert" size="x-large"></v-icon>
                        </span>
                        Vous avez utilisé l'intégralité de votre budget pour le mois {{ monthPrefix }}{{ monthName.toLowerCase() }} {{ selectedYear }}. Soyez vigilant·e jusqu'au mois prochain.
                    </p>
            </v-col>
        </v-row>

        <v-divider :thickness="3" class="mt-16"></v-divider>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import { useExpenseStore } from "@/stores/expense";
import { useBudgetStore } from "@/stores/budget";
import { useCategoryStore } from '@/stores/category';

const expenseStore = useExpenseStore();
const expenses = computed(() => expenseStore.expenses || []);

const budgetStore = useBudgetStore();
const budgets = computed(() => budgetStore.budgets || []);

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories || []);

const currentMonth = new Date().getUTCMonth() + 1;
const currentYear = new Date().getFullYear();

const selectedMonth = ref(currentMonth);
const selectedYear = ref(currentYear);
const selectedCategory = ref(null);

const selectedCategoryName = computed(() =>
  filteredExpensesCategories.value.find(category => category.id === selectedCategory.value)?.name || 'Toutes les catégories'
);

const chartAriaLabel = computed(() => {
  return `Comparaison du budget et des dépenses pour le mois ${monthPrefix.value}${monthName.value.toLowerCase()} de l'année ${selectedYear.value}. (Catégorie : ${selectedCategoryName.value})`;
});

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

const monthName = computed(() =>
  formSelectMonths.find(month => month.id === selectedMonth.value)?.text || ''
);

const monthWithApostrophe = [4, 8, 10]; // April, August, October

const monthPrefix = computed(() =>
  monthWithApostrophe.includes(selectedMonth.value) ? "d'" : "de "
);

const filteredExpenses = computed(() => 
    expenses.value.filter(expense => {
        const date = new Date(expense.date);
        const matchedDate = date.getFullYear() === selectedYear.value && date.getMonth() + 1 === selectedMonth.value;

        // take into account the selected category only if it is defined / selected by the user
        const matchedCategory = !selectedCategory.value || expense.category === selectedCategory.value;

        return matchedDate && matchedCategory;
    })
);

const filteredBudgets = computed(() => 
    budgets.value.filter(budget => {
            const matchedBudgetForSelectedDate = budget.month === selectedMonth.value && budget.year === selectedYear.value;

            const matchedCategory = !selectedCategory.value || budget.category === selectedCategory.value;

            return matchedBudgetForSelectedDate && matchedCategory;
        })
);

const filteredExpensesCategories = computed(() => {
    const rawCategories = categories.value;

    return Array.isArray(rawCategories)
    ? rawCategories.filter(category => category.type === 'EXPENSE')
    : [];
});

const totalExpense = computed(() =>
  filteredExpenses.value.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
);

const totalBudget = computed(() =>
  filteredBudgets.value.reduce((sum, budget) => sum + parseFloat(budget.amount), 0)
);

const chartData = computed(() => ({
  labels: ['Budget total', 'Dépenses totales'],
  datasets: [
    {
      label: 'Montant total en euros (€)',
      backgroundColor: ['#212121', '#DD2C00'],
      data: [totalBudget.value, totalExpense.value]
    }
  ]
}));

onMounted(async () => {
    await expenseStore.fetchExpenses();
    await budgetStore.fetchBudgets();
});

</script>
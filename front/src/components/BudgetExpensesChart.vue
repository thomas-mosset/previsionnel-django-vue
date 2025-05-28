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
            <h3 class="mt-6 mx-auto">{{ chartAriaLabel }}</h3>
        </v-row>
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
  const monthName = formSelectMonths.find(m => m.id === selectedMonth.value)?.text || '';

  return `Comparaison du budget et des dépenses pour le mois de ${monthName.toLowerCase()} de l'année ${selectedYear.value}. (Catégorie : ${selectedCategoryName.value})`;
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

const totalDepense = computed(() =>
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
      data: [totalBudget.value, totalDepense.value]
    }
  ]
}));

onMounted(async () => {
    await expenseStore.fetchExpenses();
    await budgetStore.fetchBudgets();
});

</script>
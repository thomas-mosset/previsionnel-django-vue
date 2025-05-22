import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';
import { useAuthStore } from "./auth";

export const useExpenseStore = defineStore('expense', {
    state: () => ({
        expenses: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchExpenses() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosAPI.get('/expenses/');
                this.expenses = response.data;
            } catch (error) {
                this.error = error.response?.data?.detail || 'Erreur de chargement';
            } finally {
                this.loading = false;
            }
        },
        async addExpense(expenseCategory, expenseAmount, expenseDate, expenseDescription) {
            try {
                const authStore = useAuthStore();
                let token = authStore.token;
                const refreshToken = authStore.refreshToken;

                if(!token) {
                    if(refreshToken) {
                        await authStore.refreshAccessToken();
                        token = authStore.token;
                    } else {
                        throw new Error('Token non trouvé. Veuillez vous reconnecter.');
                    }
                }

                const response = await axiosAPI.post('/expenses/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    category: expenseCategory,
                    amount: expenseAmount,
                    date: expenseDate,
                    description: expenseDescription,
                });

                this.expenses.push(response.data);

            } catch (error) {
                console.error('Erreur lors de l\'ajout de la dépense', error);
                throw new Error('L\'ajout de la dépense a échoué.');  
            }
        },
    },
});
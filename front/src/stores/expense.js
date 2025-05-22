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
        async updateExpense(id, newExpenseCategory, newExpenseAmount, newExpenseDate, newExpenseDescription) {
            try {
                const authStore = useAuthStore();
                let token = authStore.token;
                const refreshToken = authStore.refreshToken;

                if(!token) {
                    if (refreshToken) {
                        await authStore.refreshAccessToken();
                        token = authStore.token;
                    } else {
                        throw new Error('Token non trouvé. Veuillez vous reconnecter.');
                    }
                }

                await axiosAPI.put(
                    `/expenses/${id}/`,
                    {
                        category: newExpenseCategory,
                        amount: newExpenseAmount,
                        date: newExpenseDate,
                        description: newExpenseDescription,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const updatedExpense = this.expenses.find(expense => expense.id === id);

                updatedExpense.category = newExpenseCategory;
                updatedExpense.amount = newExpenseAmount;
                updatedExpense.date = newExpenseDate;
                updatedExpense.description = newExpenseDescription;

            } catch (error) {
                console.error('Erreur lors de la mise à jour de la dépense', error.response?.data || error.message);
                throw new Error('La mise à jour de la dépense a échoué.');
            }
        },
        async deleteExpense(id) {
            try {
                const authStore = useAuthStore();
                let token = authStore.token;
                const refreshToken = authStore.refreshToken;

                // if we don't find the token
                if (!token) {
                    // we use the refresh token...
                    if (refreshToken) {
                        // to refresh the access token
                        await authStore.refreshAccessToken();
                        token = authStore.token;  // get the new access token
                    } else {
                        throw new Error('Token non trouvé. Veuillez vous reconnecter.');
                    }
                }

                await axiosAPI.delete(`/expenses/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.expenses = this.expenses.filter(expense => expense.id !== id);

            } catch (error) {
                console.error('Erreur lors de la suppression de la dépense', error);
                throw new Error('La suppression de la dépense a échoué.');
            }
        },
    },
});
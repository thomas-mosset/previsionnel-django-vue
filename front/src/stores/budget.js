import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';
import { useAuthStore } from "./auth";

export const useBudgetStore = defineStore('budget', {
    state: () => ({
        budgets: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchBudgets() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosAPI.get('/budgets/');
                this.budgets = response.data;
            } catch (error) {
                this.error = error.response?.data?.detail || 'Erreur de chargement';
            } finally {
                this.loading = false;
            }
        },
        async addBudget(budgetMonth, budgetYear, budgetCategory, budgetAmount) {
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

                const response = await axiosAPI.post('/budgets/', 
                    {
                        month: budgetMonth,
                        year: budgetYear,
                        category: budgetCategory,
                        amount: parseFloat(budgetAmount),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                this.budgets.push(response.data);

            } catch (error) {
                console.error('Erreur lors de l\'ajout du budget', error);
                throw new Error('L\'ajout du budget a échoué.');  
            }
        },
        async updateBudget(id, newBudgetMonth, newBudgetYear, newBudgetCategory, newBudgetAmount) {
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
                    `/budgets/${id}/`,
                    {
                        month: newBudgetMonth,
                        year: newBudgetYear,
                        category: newBudgetCategory,
                        amount: parseFloat(newBudgetAmount),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const updatedBudget = this.budgets.find(budget => budget.id === id);

                updatedBudget.month = newBudgetMonth;
                updatedBudget.year = newBudgetYear;
                updatedBudget.category = newBudgetCategory;
                updatedBudget.amount = newBudgetAmount;

            }  catch (error) {
                console.error('Erreur lors de la mise à jour du budget', error.response?.data || error.message);
                throw new Error('La mise à jour du budget a échoué.');
            }
        },
        async deleteBudget(id) {
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

                await axiosAPI.delete(`/budgets/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.budgets = this.budgets.filter(budget => budget.id !== id);

            } catch (error) {
                console.error('Erreur lors de la suppression du budget', error);
                throw new Error('La suppression du budget a échoué.');
            }
        },
    }
});
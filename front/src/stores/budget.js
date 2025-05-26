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
                        amount: parseFloat(budgetAmount), // sécurise ici aussi
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
    }
});
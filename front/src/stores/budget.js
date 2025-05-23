import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';

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
    }
});
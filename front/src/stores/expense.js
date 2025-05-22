import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';

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
    },
});
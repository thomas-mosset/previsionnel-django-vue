import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';
// import { useAuthStore } from "@/stores/auth";

export const useIncomeStore = defineStore('income', {
    state: () => ({
        incomes: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchIncomes() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosAPI.get('/incomes/');
                this.incomes = response.data;
            } catch (error) {
                this.error = error.response?.data?.detail || 'Erreur de chargement';
            } finally {
                this.loading = false;
            }
        },
    },
})
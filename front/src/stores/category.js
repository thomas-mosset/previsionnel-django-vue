import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchCategories() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosAPI.get('/categories/');
                this.categories = response.data;

            } catch (error) {
                this.error = error.response?.data?.detail || 'Erreur de chargement';
            } finally {
                this.loading = false;
            }
        },
    },
});
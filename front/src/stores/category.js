import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';
import { useAuthStore } from '@/stores/auth';

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
        async deleteCategory(id) {
            try {
                const authStore = useAuthStore();
                let token = authStore.token;
                let refreshToken = authStore.refreshToken;

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

                // if we have a valid token
                await axiosAPI.delete(`/categories/${id}/`, {
                        headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // local update, remove the deleted category from the array
                this.categories = this.categories.filter(category => category.id !== id);

            } catch (error) {
                console.error('Erreur lors de la suppression de la catégorie', error);
                throw new Error('La suppression  de la catégorie a échoué.');
            }
        },
    },
});
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
        async updateCategory(id, newCategoryName, newCategoryType) {
            try {
                const authStore = useAuthStore();
                let token = authStore.token;
                const refreshToken = authStore.refreshAccessToken;

                if (!token) {
                    if (refreshToken) {
                        await authStore.refreshAccessToken();
                        token = authStore.token;
                    } else {
                        throw new Error('Token non trouvé. Veuillez vous reconnecter.');
                    }
                }

                await axiosAPI.put(`/categories/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    name: newCategoryName,
                    type: newCategoryType,
                })

                const updatedCategory = this.categories.find(category => category.id === id);

                updatedCategory.name = newCategoryName;
                updatedCategory.type = newCategoryType;

            } catch (error) {
                console.error('Erreur lors de la mise à jour de la catégorie', error);
                throw new Error('La mise à jour de la catégorie a échoué.');
            }
        },
        async deleteCategory(id) {
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
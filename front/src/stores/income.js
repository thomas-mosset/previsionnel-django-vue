import { defineStore } from "pinia";
import axiosAPI from '@/services/axiosInstance';
import { useAuthStore } from "./auth";
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
        async addIncome (incomeCategory, incomeAmount, incomeDate, incomeDescription) {
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

                const response = await axiosAPI.post('/incomes/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    category: incomeCategory,
                    amount: incomeAmount,
                    date: incomeDate,
                    description: incomeDescription,
                });

                this.incomes.push(response.data);

            } catch (error) {
                console.error('Erreur lors de l\'ajout du revenu', error);
                throw new Error('L\'ajout du revenu a échoué.');  
            }
        },
        async updateIncome(id, newIncomeCategory, newIncomeAmount, newIncomeDate, newIncomeDescription) {
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
                    `/incomes/${id}/`,
                    {
                        category: newIncomeCategory,
                        amount: newIncomeAmount,
                        date: newIncomeDate,
                        description: newIncomeDescription,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const updatedIncome = this.incomes.find(income => income.id === id);

                updatedIncome.category = newIncomeCategory;
                updatedIncome.amount = newIncomeAmount;
                updatedIncome.date = newIncomeDate;
                updatedIncome.description = newIncomeDescription;
                
            } catch (error) {
                console.error('Erreur lors de la mise à jour du revenu', error.response?.data || error.message);
                throw new Error('La mise à jour du revenu a échoué.');
            }
        },
    },
})
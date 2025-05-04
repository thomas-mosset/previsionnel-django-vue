import { defineStore } from 'pinia'
// import axios from 'axios' -> is replaced by axiosAPI from my service
import axiosAPI from '@/services/axiosInstance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userEmail: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  }),

  actions: {
    initialize() {
      const tokenFromStorage = localStorage.getItem('token');
      if (tokenFromStorage) {
        this.token = tokenFromStorage;
        this.isAuthenticated = true;
      }
    },
    async refreshAccessToken() {
      const refresh = this.refreshToken || localStorage.getItem('refreshToken');

      if (!refresh) {
        throw new Error("Pas de refresh token");
      }

      try {
        const response = await axiosAPI.post('/auth/token/refresh/', {
          refresh,
        });

        this.token = response.data.access;
        localStorage.setItem('token', this.token);

      } catch (error) {
        console.log(error);

        this.logout();
        throw new Error("Échec du rafraichissement du token");
      }
    },
    async login(username, email, password) {
      try {
        const response = await axiosAPI.post('/auth/token/', { // to get token access + refresh
        // const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', { // here we only get the key
          username,
          email,
          password,
        })

        this.token = response.data.access;
        this.refreshToken = response.data.refresh;
        this.user = username;
        this.userEmail = email;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token)
        localStorage.setItem('refreshToken', this.refreshToken); // to get a refresh token if first one expire before the end orf the user's session

      } catch (error) {
        console.log('catch error', error.response?.data?.detail);

        throw new Error(error.response?.data?.detail || 'Nom d\'utilisateur ou mot de passe incorrect');
      }
    },
    async registration(username, email, password, passwordConfirmation) {      
      try {
        const response = await axiosAPI.post('/auth/registration/', {
          username,
          email,
          password1: password, /* "password1" is the name of the Django field */
          password2: passwordConfirmation /* "password2" is the name of the Django field */
        });

        this.token = response.data.access;
        this.refreshToken = response.data.refresh;
        this.user = username;
        this.userEmail = email;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token)
        localStorage.setItem('refreshToken', this.refreshToken);

      } catch (error) {
        console.log('Full error response:', error.response?.data || error.message);
        throw new Error(
          error.response?.data?.email?.[0] ||
          error.response?.data?.password1?.[0] ||
          error.response?.data?.non_field_errors?.[0] ||
          'Erreur lors de l\'inscription'
        );
      }
    },
    async logout() {
      try {
        await axiosAPI.post('/auth/logout/', null, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.token = null;
        this.refreshToken = null;
        this.isAuthenticated = false;

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } catch (error) {
        console.log('catch error', error.response?.data?.detail);

        throw new Error(error.response?.data?.detail || 'Erreur lors de la déconnexion.');
      }
    },
    async updateUserInfo(newUsername, newEmail) {
      try {
        const response = await axiosAPI.put('/user/current/',
          {
            username: newUsername,
            email: newEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        // update the store w/ new infos
        this.user = newUsername;
        this.userEmail = newEmail;

        return response.data;

      } catch (error) {
        console.log('Erreur lors de la mise à jour', error);
        throw new Error('Erreur lors de la mise à jour des informations utilisateur');
      }
    },
    async changeUserPassword (currentPassword, newPassword, newPasswordConfirmation) {
      try {
        const response = await axiosAPI.post('/auth/password/change/', {
          old_password: currentPassword,
          new_password1: newPassword,
          new_password2 : newPasswordConfirmation,
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe', error);
        throw new Error(error.response?.data?.detail || "Impossible de changer le mot de passe.");
      }
    },
    async deleteUser() {
      try {
        await axiosAPI.delete('/user/current/delete', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        // clean the store after deletion
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        this.userEmail = null;
        this.isAuthenticated = false;

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

      } catch (error) {
        console.error('Erreur lors de la suppression du compte utilisateur', error);
        throw new Error('La suppression du compte a échoué.');
      }
    },
  },
})

import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userEmail: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(username, email, password) {

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
          username,
          email,
          password,
        })

        this.token = response.data.access;
        this.user = username;
        this.userEmail = email;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token)

      } catch (error) {
        console.log('catch error', error.response?.data?.detail);

        throw new Error(error.response?.data?.detail || 'Nom d\'utilisateur ou mot de passe incorrect');
      }
    },
    async registration(username, email, password, passwordConfirmation) {      
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/registration/', {
          username,
          email,
          password1: password, /* "password1" is the name of the Django field */
          password2: passwordConfirmation /* "password2" is the name of the Django field */
        });

        this.token = response.data.access;
        this.user = username;
        this.userEmail = email;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);

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
    async logout(){
      console.log("logout auth");

      try {
        await axios.post('http://127.0.0.1:8000/api/auth/logout/');

        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
      } catch (error) {
        console.log('catch error', error.response?.data?.detail);

        throw new Error(error.response?.data?.detail || 'Erreur lors de la déconnexion.');
      }
    },
  },
})

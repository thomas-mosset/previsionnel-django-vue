import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
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
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token)

      } catch (error) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect', error)
      }
    },
    async register(username, email, password, passwordConfirmation) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/registration/', {
          username,
          email,
          password1: password, /* "password1" is the name of the Django field */
          password2: passwordConfirmation /* "password2" is the name of the Django field */
        });

        this.token = response.data.access;
        this.user = username;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);

      } catch (error) {
        console.log(error.response?.data?.detail || error.message);
        throw new Error('Erreur lors de l\'inscription');
      }
    },
  },
})

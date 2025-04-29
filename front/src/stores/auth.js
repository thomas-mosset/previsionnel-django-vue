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
    }
  },
})

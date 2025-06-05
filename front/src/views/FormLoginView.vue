<template>
  <main>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-row justify="center">
        <v-col cols="12">
          <h1 class="font-weight-bold text-center mb-4">Se connecter</h1>
        </v-col>

        <v-col class="mx-auto" cols="12" md="10" lg="6">
          <v-form
            v-model="valid"
            @submit.prevent="handleLogin"
            ref="form"
          >
            <v-text-field
              label="Nom d'utilisateur"
              v-model="username"
              :rule="[rules.required]"
              data-cy="username"
            />

            <v-text-field
              label="Adresse mail"
              v-model="email"
              :rule="[rules.required, rules.email]"
              data-cy="email"
            />

            <v-text-field
              label="Mot de passe"
              type="password"
              v-model="password"
              :rules="[rules.required]"
              data-cy="password"
            />

          <v-btn type="submit" variant="tonal" color="grey-darken-4" :disabled="!valid" class="mt-4" block>
            Se connecter
          </v-btn>

          <v-alert v-if="error" type="error" class="mt-12 text-center">{{ error }}</v-alert>

          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)
const error = ref(null)

const authStore = useAuthStore()

const rules = {
  required: (v) => !!v || 'Champ requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
}

const handleLogin = async () => {
  error.value = null

  try {
    await authStore.login(username.value, email.value, password.value) ;

    // Redirect to profil page after successfull login
    router.push('/profil')
  } catch (err) {
    error.value = err.message ;
  }
}

</script>
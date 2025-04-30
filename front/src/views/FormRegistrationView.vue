<template>
  <main>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-row justify="center">
        <v-col cols="12">
          <h1 class="font-weight-bold text-center mb-4">S'inscrire</h1>
          <p class="text-center mb-6">Pour s'inscrire rien de plus simple ! Il vous faut une adresse mail, un nom d'utilisateur et un mot de passe.</p>
        </v-col>

        <v-col class="mx-auto" cols="12" md="10" lg="6">
          <v-form
            v-model="valid"
            @submit.prevent="handleRegister"
            ref="form"
          >
            <v-text-field
              label="Nom d'utilisateur"
              v-model="username"
              :rule="[rules.required]"
            />

            <v-text-field
              label="Adresse mail"
              v-model="email"
              :rule="[rules.required, rules.email]"
            />

            <v-text-field
              label="Mot de passe"
              type="password"
              v-model="password"
              :rules="[rules.required]"
            />

            <v-text-field
              label="Confirmer le mot de passe"
              type="password"
              v-model="passwordConfirmation"
              :rules="[rules.required]"
            />

          <v-btn type="submit" variant="tonal" color="grey-darken-4" :disabled="!valid" class="mt-4" block>
            S'inscrire
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

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const valid = ref(false)
const error = ref(null)

const authStore = useAuthStore()

const rules = {
  required: (v) => !!v || 'Champ requis',
  email: (v) => /.+@.+\..+/.test(v) || 'Email invalide',
}

const handleRegister = async () => {
  error.value = null

  try {
    await authStore.register(username.value, email.value, password.value, passwordConfirmation.value) ;
    console.log("register ok")
  } catch (err) {
    error.value = err.message ;
  }
}

</script>
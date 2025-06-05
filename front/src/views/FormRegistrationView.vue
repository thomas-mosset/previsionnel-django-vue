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
            @submit.prevent="handleRegistration"
            ref="form"
          >
            <v-text-field
              label="Nom d'utilisateur"
              v-model="username"
              :rule="[rules.required, rules.username]"
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

            <v-text-field
              label="Confirmer le mot de passe"
              type="password"
              v-model="passwordConfirmation"
              :rules="[rules.required]"
              data-cy="passwordConfirmation"
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
import { useRouter } from 'vue-router'

const router = useRouter()

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
  username: (v) => /^[a-zA-Z0-9_]+$/.test(v) || "Nom d'utilisateur invalide (lettres, chiffres, underscores uniquement)",
}

const translateError = (message) => {
  const translations = {
    "A user with that username already exists.": "Un utilisateur avec ce nom existe déjà.",
    "Enter a valid email address.": "Entrez une adresse e-mail valide.",
    "The two password fields didn't match.": "Les deux mots de passe ne correspondent pas.",
    "This password is too short. It must contain at least 8 characters.": "Ce mot de passe est trop court. Il doit contenir au moins 8 caractères.",
    "This field may not be blank.": "Ce champ ne peut pas être vide.",
    "No active account found with the given credentials": "Aucun compte actif trouvé avec les informations d'identification fournies",
  }

  return translations[message] || message
}

const handleRegistration = async () => {
  error.value = null

  try {
    await authStore.registration(username.value, email.value, password.value, passwordConfirmation.value);

    // Redirect to profil page after successfull login
    router.push('/profil')
  } catch (err) {
    error.value = translateError(err.message);
  }
}

</script>
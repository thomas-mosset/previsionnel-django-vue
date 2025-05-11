<template>
  <main>
    <v-container class="fill-height">
      <v-row>
        <v-col>
          <h1 class="font-weight-bold text-center mb-4">Bienvenue sur votre app de prévisionnel</h1>
          <p class="text-center mb-6">Elle vous aide à créer et suivre facilement vos finances de manière claire et adaptée à vos bugets et besoins.</p>
        </v-col>
      </v-row>
     
      <v-row class="d-flex justify-center align-stretch">
        <v-col cols="12" md="5" class="d-flex">
          <v-card class="flex-grow-1 d-flex flex-column" variant="outlined">
            <v-card-text class="flex-grow-1">
              Pour lancer votre prévisionnel ou y accéder, connectez-vous.
            </v-card-text>
            <v-card-actions>
              <RouterLink to="/login">
                <v-btn variant="tonal" color="grey-darken-4">Se connecter</v-btn>
              </RouterLink>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="5" class="d-flex">
          <v-card class="flex-grow-1 d-flex flex-column" variant="outlined">
            <v-card-text class="flex-grow-1">
              Pour créer votre prévisionnel, enregistrez-vous.
            </v-card-text>
            <v-card-actions>
              <RouterLink to="/registration">
                <v-btn variant="tonal" color="grey-darken-4">Créer un compte</v-btn>
              </RouterLink>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>


<script setup>

</script>
<template>
  <main>
    <v-container class="fill-height">
      <v-row>
        <v-col>
          <h1 class="font-weight-bold text-center mb-4">Bienvenue sur votre app de prévisionnel</h1>
          <p class="text-center mb-6">Elle vous aide à créer et suivre facilement vos finances de manière claire et adaptée à vos bugets et besoins.</p>
        </v-col>
      </v-row>
     
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="5">
          <v-card text="Pour lancer votre prévisionnel ou y accéder, connectez-vous." variant="outlined">
            <v-card-actions>
              <RouterLink to="/login">
                <v-btn variant="tonal" color="grey-darken-4">Se connecter</v-btn>
              </RouterLink>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card text="Pour créer votre prévisionnel, enregistrez-vous." variant="outlined">
            <v-card-actions>
              <RouterLink to="/register">
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
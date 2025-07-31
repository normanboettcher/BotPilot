<script setup lang="ts"></script>
<template>
  <v-card id="pilot-form" class="pilot-form-card" elevation="2">
    <v-card-text class="pilot-form-heading">
      Nehmen Sie jetzt an der Pilotgruppe teil und bestellen Sie Ihren individuellen Chatbot!
    </v-card-text>
    <v-card-text class="pilot-form-content">
      <div class="kontaktdaten-heading">Kontaktdaten</div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.pilot-form-heading {
  font-size: var(--font-size-heading);
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.pilot-form-card {
  font-family: var(--font-family), serif;
  background-color: var(--color-card);
}

.kontaktdaten-heading {
  font-size: 20px;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.pilot-form-content {
  background-color: var(--color-card);
  border-radius: var(--border-radius);
}

.v-btn {
  margin-top: 1rem;
}
</style>

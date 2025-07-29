<script setup lang="ts">
import FormModal from '@components/form/pilot/modal/FormModal.vue';
</script>

<template>
  <v-card-title class="text-wrap">Mehr Zeit für das Wesentliche</v-card-title>
  <v-card-subtitle class="font-weight-medium text-wrap"
    >Ein digitaler Assistent, der Ihnen wirklich Arbeit abnimmt - rund um die Uhr</v-card-subtitle
  >
  <v-card-text>
    <v-row class="d-flex pl-3 pt-2"
      >Als Steuerberater stehen Sie täglich zwischen Anfragen, Fristen und Mandanten. Unser
      intelligenter Chatbot ist mehr als nur ein technisches Tool – er ist ein persönlicher
      Assistent für Ihre Kanzlei. Er beantwortet wiederkehrende Fragen, filtert Anliegen vor, und
      gibt potenziellen Mandanten sofort das Gefühl, gut aufgehoben zu sein – selbst wenn Sie gerade
      keine Zeit haben. So gewinnen Sie Ruhe, Präsenz – und das Vertrauen Ihrer Zielgruppe.
    </v-row>
    <v-row class="d-flex pt-4 justify-center">
      <form-modal />
    </v-row>
  </v-card-text>
</template>

<style scoped>
.v-card-title {
  color: var(--color-heading);
  font-family: var(--font-family), serif;
  font-size: var(--font-size-heading);
  word-break: break-word;
}

.v-card-text {
  color: var(--color-text);
  font-family: var(--font-family), serif;
  font-size: var(--font-size-base);
}
.v-card-subtitle {
  color: var(--color-text);
  font-family: var(--font-family), serif;
  font-size: 20px;
  word-break: break-word;
}
</style>

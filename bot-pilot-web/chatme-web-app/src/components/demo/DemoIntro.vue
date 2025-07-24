<script setup lang="ts">
import FormModal from '@components/form/pilot/modal/FormModal.vue';
</script>

<template>
  <v-card-title class="text-wrap">Ein smarter Chatbot für Ihre Kanzlei</v-card-title>
  <v-card-text>
    Automatisieren Sie Ihre häufigsten Anfragen, sparen Sie Zeit und bieten Sie rund um die Uhr
    Service.
    <form-modal />
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
</style>

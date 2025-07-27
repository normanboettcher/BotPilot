<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  validKontaktdaten: boolean;
  validFaq: boolean;
  allValid: boolean;
}>();
</script>

<template>
  <v-stepper-header class="flex align-center">
    <v-stepper-item value="1" title="Willlkommen" color="primary" />
    <v-divider class="pl-6 grey" opacity="1"></v-divider>
    <v-stepper-item value="2" color="primary" title="Kontaktdaten" :complete="validKontaktdaten" />
    <v-divider class="pl-6 grey" opacity="1"></v-divider>
    <v-stepper-item title="FAQs" value="3" color="primary" :complete="validFaq" />
    <v-divider class="pl-6 grey" opacity="1"></v-divider>
    <v-stepper-item title="Absenden" value="4" color="primary" :complete="allValid" />
  </v-stepper-header>
</template>

<style scoped></style>

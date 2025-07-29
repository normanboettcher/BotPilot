<script setup lang="ts">
import FaqList from '@components/form/pilot/FaqList.vue';
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel } from 'vue';
import type { Faq } from '@domain/Faq.ts';

const modelValue = defineModel<number>();
const faqs = defineModel<Array<Faq>>('faqs');
</script>

<template>
  <modal-card v-model="modelValue" title="Willkommen bei unserer Pilotgruppe">
    <template #content>
      <faq-list v-model="faqs" />
    </template>
    <template #actions>
      <v-btn color="primary" title="Zurück" @click="modelValue--">Zurück </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="modelValue++">Weiter</v-btn>
    </template>
  </modal-card>
</template>

<style scoped></style>

<script setup lang="ts">
import FaqList from '@components/form/pilot/FaqList.vue';
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel } from 'vue';
import type { Faq } from '@domain/Faq.ts';
import ModalActions from '@components/form/pilot/modal/ModalActions.vue';

const modelValue = defineModel<number>();
const faqs = defineModel<Array<Faq>>('faqs');
</script>

<template>
  <modal-card v-model="modelValue" title="Willkommen bei unserer Pilotgruppe">
    <template #content>
      <faq-list v-model="faqs" />
    </template>
    <template #actions>
      <modal-actions has-back-button @modal:next="modelValue++" @modal:back="modelValue--" />
    </template>
  </modal-card>
</template>

<style scoped></style>

<script setup lang="ts">
import FaqList from '@components/form/pilot/FaqList.vue';
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { computed, defineModel, defineProps } from 'vue';
import type { Faq } from '@domain/Faq.ts';

const modelValue = defineModel<number>();
const props = defineProps<{
  faqs: Faq[];
}>();
const faqs = computed(() => props.faqs);
</script>

<template>
  <modal-card
    v-model="modelValue"
    title="Willkommen bei unserer Pilotgruppe"
    has-back-button
    @modal:next="modelValue++"
    @modal:back="modelValue--"
  >
    <template #content>
      <faq-list v-model="faqs" />
    </template>
  </modal-card>
</template>

<style scoped></style>

<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel, defineEmits } from 'vue';

const modelValue = defineModel<number>();
const emit = defineEmits<{
  (e: 'modal:submit'): void;
}>();
</script>

<template>
  <modal-card
    v-model="modelValue"
    title="Fast geschafft!"
    has-back-button
    @modal:back="modelValue--"
    @modal:next="emit('modal:submit')"
    weiter-title="Abschicken"
  >
    <template #content>
      <h3>Was als nächstes passiert</h3>
    </template>
  </modal-card>
</template>

<style scoped></style>

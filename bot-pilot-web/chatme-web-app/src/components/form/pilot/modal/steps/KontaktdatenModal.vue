<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import type { Kontaktdaten } from '@domain/Kontaktdaten.ts';
import { defineProps, defineModel, computed } from 'vue';
import KontaktdatenForm from '@components/form/pilot/KontaktdatenForm.vue';
import ModalActions from '@components/form/pilot/modal/ModalActions.vue';

const modelValue = defineModel<number>();

const props = defineProps<{
  kontaktdaten: Kontaktdaten;
}>();
const kontaktdaten = computed(() => props.kontaktdaten);
</script>

<template>
  <modal-card v-model="modelValue" title="Willkommen bei unserer Pilotgruppe">
    <template #content>
      <kontaktdaten-form v-model="kontaktdaten" />
    </template>
    <template #actions>
      <modal-actions has-back-button @modal:next="modelValue++" @modal:back="modelValue--" />
    </template>
  </modal-card>
</template>

<style scoped></style>

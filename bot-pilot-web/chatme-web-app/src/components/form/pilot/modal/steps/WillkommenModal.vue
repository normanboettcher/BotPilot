<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel } from 'vue';

const modelValue = defineModel<number>();
</script>

<template>
  <modal-card
    title="Willkommen bei unserer Pilotgruppe"
    @modal:next="modelValue++"
    @modal:back="modelValue--"
    :has-back-button="false"
  >
    <template #content-title>
      Willkommen zu unserem Formular. Bitte folgen Sie den Schritten, um fortzufahren.
    </template>
  </modal-card>
</template>

<style scoped></style>

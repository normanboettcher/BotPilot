<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel } from 'vue';
import ModalActions from '@components/form/pilot/modal/ModalActions.vue';

const modelValue = defineModel<number>();
</script>

<template>
  <modal-card title="Willkommen bei unserer Pilotgruppe">
    <template #content-title>
      Willkommen zu unserem Formular. Bitte folgen Sie den Schritten, um fortzufahren.
    </template>
    <template #actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="modelValue++">Weiter</v-btn>
    </template>
  </modal-card>
</template>

<style scoped></style>

<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel, defineEmits } from 'vue';
import ModalActions from '@components/form/pilot/modal/ModalActions.vue';

const modelValue = defineModel<number>();
const success = defineModel<boolean>('success');
const emit = defineEmits<{
  (e: 'modal:submit'): void;
}>();
const title = success ? 'Vielen Dank! Ihr Upload war erfolgreich' : 'Fast geschafft!';
</script>

<template>
  <modal-card v-model="modelValue" :title="title" weiter-title="Abschicken">
    <template #content>
      <div class="d-flex align-center justify-center">
        <h4 v-if="!success">Was als nächstes passiert</h4>
        <v-icon v-else color="green" size="64">mdi-check-circle-outline</v-icon>
      </div>
    </template>
    <template #actions>
      <modal-actions
        has-back-button
        @modal:next="emit('modal:submit')"
        @modal:back="modelValue--"
      />
    </template>
  </modal-card>
</template>

<style scoped></style>

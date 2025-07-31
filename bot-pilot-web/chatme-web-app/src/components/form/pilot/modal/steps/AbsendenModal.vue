<script setup lang="ts">
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import { defineModel, defineEmits, computed } from 'vue';

const modelValue = defineModel<number>();
const success = defineModel<boolean>('success');
const formValid = defineModel<boolean>('formValid');
const emit = defineEmits<{
  (e: 'modal:submit'): void;
}>();
const title = computed(() =>
  success.value ? 'Vielen Dank! Ihr Upload war erfolgreich' : 'Fast geschafft!',
);
</script>

<template>
  <modal-card v-model="modelValue" :title="title" weiter-title="Abschicken">
    <template #content>
      <div class="d-flex align-center justify-center pl-4">
        <div v-if="!success && formValid">Was als nächstes passiert</div>
        <div v-else-if="!success && !formValid">
          Bitte füllen Sie die vorangegangenen Schritte aus, um fortfahren zu können.
        </div>
        <v-icon v-else color="green" size="64">mdi-check-circle-outline</v-icon>
      </div>
    </template>
    <template #actions>
      <v-btn color="primary" title="Zurück" @click="modelValue--">Zurück</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="!success" :disabled="!formValid" color="primary" @click="emit('modal:submit')"
        >Abschicken
      </v-btn>
    </template>
  </modal-card>
</template>

<style scoped></style>

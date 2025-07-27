<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  hasBackButton: boolean;
  title: string;
  submit?: () => void;
}>();
const emit = defineEmits<{
  (event: 'modal:next'): void;
  (event: 'modal:back'): void;
}>();
</script>

<template>
  <v-card :title="title" flat>
    <v-card-text>
      <slot name="content-title"></slot>
    </v-card-text>
    <slot name="content"></slot>
    <v-card-actions>
      <v-btn v-if="hasBackButton" color="primary" title="Zurück" @click="emit('modal:back')"
        >Zurück</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submit ?? emit('modal:next')"
        >{{ submit ? 'Abschicken' : 'Weiter' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card {
  background-color: var(--color-card);
  color: var(--color-text);
}
</style>

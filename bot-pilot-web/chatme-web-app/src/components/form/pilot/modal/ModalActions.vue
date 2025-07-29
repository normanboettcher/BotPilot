<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';

withDefaults(
  defineProps<{
    hasBackButton: boolean;
    weiterTitle?: string;
  }>(),
  {
    hasBackButton: false,
  },
);
const emit = defineEmits<{
  (event: 'modal:next'): void;
  (event: 'modal:back'): void;
}>();
</script>

<template>
  <v-btn v-if="hasBackButton" color="primary" title="Zurück" @click="emit('modal:back')"
    >Zurück
  </v-btn>
  <v-spacer></v-spacer>
  <v-btn color="primary" @click="emit('modal:next')">{{ weiterTitle ?? 'Weiter' }}</v-btn>
</template>

<style scoped></style>

<script setup lang="ts">
import { defineModel, defineProps } from 'vue';

defineProps<{
  hasBackButton: boolean;
  title: string;
}>();
const modelValue = defineModel<number>();
</script>

<template>
  <v-card :title="title" flat>
    <v-card-text>
      <slot name="content-title"></slot>
    </v-card-text>
    <slot name="content"></slot>
    <v-card-actions>
      <v-btn v-if="hasBackButton" color="primary" rounded @click="--modelValue">Zurück</v-btn>
      <v-spacer />
      <v-btn color="primary" rounded @click="modelValue++">Weiter</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>

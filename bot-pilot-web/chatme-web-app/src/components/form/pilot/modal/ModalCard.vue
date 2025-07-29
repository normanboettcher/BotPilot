<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  weiterTitle?: string;
}>();
</script>

<template>
  <v-card flat class="modal-card pa-2">
    <v-card-title class="text-wrap">{{ title }}</v-card-title>
    <v-card-text>
      <slot name="content-title"></slot>
    </v-card-text>
    <slot name="content"></slot>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.modal-card {
  background-color: var(--color-card);
  color: var(--color-text);
}
</style>

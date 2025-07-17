<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  clickable?: boolean;
}>();
</script>

<template>
  <v-btn v-if="clickable" class="footer-select-item font-weight-bold">{{ title }}</v-btn>
  <span v-else>{{ title }}</span>
</template>

<style scoped>
.footer-select-item {
  color: var(--color-text);
  background-color: var(--color-background);
  font-family: var(--font-family), serif;
}

div {
  font-family: var(--font-family), serif;
  font-size: var(--font-size-base);
}
</style>

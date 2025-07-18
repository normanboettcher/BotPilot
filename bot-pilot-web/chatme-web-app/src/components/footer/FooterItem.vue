<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  title: string;
  clickable?: boolean;
}>();
const emit = defineEmits<{
  (event: 'footer:click'): void;
}>();
</script>

<template>
  <v-btn v-if="clickable" @click="emit('footer:click')" class="footer-select-item pl-0">{{
    title
  }}</v-btn>
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

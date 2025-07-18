<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <v-col>
    <v-container class="d-flex align-center pl-0 pb-1">
      <v-icon class="footer-item-list" :icon="icon" />
      <div class="pl-2 pt-1 font-weight-bold">
        {{ title }}
      </div>
    </v-container>
    <v-list class="d-flex flex-column footer-item-list-slot pl-4" density="compact">
      <slot name="FooterItems"></slot>
    </v-list>
  </v-col>
</template>

<style scoped>
.v-list {
  color: var(--color-text);
  background-color: var(--color-background);
}
</style>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  title: string;
  clickable?: boolean;
  icon?: string;
}>();
const emit = defineEmits<{
  (event: 'footer:click'): void;
}>();
const longTitle = props.title.length > 30;
</script>

<template>
  <v-list-item v-if="clickable" class="d-flex footer-select-item">
    <v-icon class="mr-2" v-if="icon" :icon="icon" />
    <v-btn @click="emit('footer:click')" class="footer-select-item pl-0 text-wrap"
      ><span>{{ title }}</span>
    </v-btn>
  </v-list-item>
  <v-list-item v-else class="d-flex footer-select-item">
    <div v-if="longTitle" class="d-flex">
      <v-icon v-if="icon" :icon="icon" />
      <v-btn v-if="!clickable" class="footer-select-item pointer-events-none pl-2 text-left">
        <span class="text-wrap long-title align-content-start">{{ title }}</span>
      </v-btn>
    </div>
    <div v-else>
      <v-icon class="mr-2" v-if="icon" :icon="icon" />
      <v-btn v-if="!clickable" class="footer-select-item pointer-events-none pl-0">
        {{ title }}
      </v-btn>
    </div>
  </v-list-item>
</template>

<style scoped>
.d-flex .footer-select-item {
  color: var(--color-text) !important;
  background-color: var(--color-background) !important;
  font-family: var(--font-family), serif !important;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem) !important;
  word-break: break-word;
}
</style>

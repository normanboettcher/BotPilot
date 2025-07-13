<script setup lang="ts">
import type { Advantage } from '@/components/domain/Advantage.ts'
import {defineProps} from 'vue'

defineProps<{ advantage: Advantage }>()
</script>

<template>
  <v-card class="advantage-card" elevation="2">
    <v-card-text>
      <div class="advantages-icon">
        <v-icon size="36" color="primary" class="advantage-icon">{{ advantage.icon ?? '' }}</v-icon>
      </div>
      <div class="advantage-label">
        {{ advantage.label }}
      </div>
      <div class="advantage-description">
        {{ advantage.description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.advantage-card {
  background-color: var(--color-card);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.advantage-icon {
  margin-bottom: 1rem;
}

.advantage-label {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-family: var(--font-family), sans-serif;
}

.advantage-description {
  font-size: 1rem;
  color: var(--color-text);
  font-family: var(--font-family) .sans-serif;
  line-height: 1.4;
}
</style>

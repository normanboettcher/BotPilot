<script setup lang="ts">
import { defineProps } from 'vue'
import type { FeatureItemType } from '@domain/Feature.ts'

defineProps<{ feature: FeatureItemType }>()
</script>

<template>
  <div class="feature-item-container">
    <div class="feature-item-presentation">
      <v-icon class="feature-icon">{{ feature.icon ?? '' }}</v-icon>
      <div class="feature-title">{{ feature.title }}</div>
    </div>
  </div>
</template>

<style scoped>
.feature-item-container {
  background-color: var(--color-background);
  color: var(--color-text);
}

.v-icon {
  padding-right: 1rem;
}

.feature-item-presentation {
  display: flex;
  align-items: flex-start;
}
</style>

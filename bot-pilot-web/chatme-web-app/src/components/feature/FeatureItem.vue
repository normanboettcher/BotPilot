<script setup lang="ts">
import { defineProps } from 'vue'
import type { FeatureItemType } from '@domain/Feature.ts'

defineProps<{ feature: FeatureItemType }>()
</script>

<template>
  <div class="feature-item-presentation">
    <v-icon class="feature-icon">{{ feature.icon ?? '' }}</v-icon>
    <div class="feature-title">{{ feature.title }}</div>
  </div>
</template>

<style scoped>
.v-icon {
  padding-right: 1rem;
}

.feature-item-presentation {
  display: flex;
  align-items: flex-start;
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>

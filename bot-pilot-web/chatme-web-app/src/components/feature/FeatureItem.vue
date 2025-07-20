<script setup lang="ts">
import { defineProps } from 'vue';
import type { FeatureItemType } from '@domain/Feature.ts';

defineProps<{ feature: FeatureItemType }>();
</script>

<template>
  <div class="feature-item-presentation">
    <div class="feature-item-presentation d-flex pt-1 pl-2">
      <v-icon class="feature-icon pr-3">{{ feature.icon ?? '' }}</v-icon>
      <div class="feature-title text=left text-wrap">{{ feature.title }}</div>
    </div>
  </div>
</template>

<style scoped>
.feature-item-presentation {
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>

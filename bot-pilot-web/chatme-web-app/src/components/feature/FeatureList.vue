<script setup lang="ts">
import type { FeatureItemType } from '@/components/domain/Feature.ts';
import FeatureItem from '@/components/feature/FeatureItem.vue';
import FeatureSection from '@/components/feature/FeatureSection.vue';

const currentFeatures: FeatureItemType[] = [
  {
    title: 'Current Feature 1',
    icon: 'mdi-check-circle',
  },
  {
    title: 'Current Feature 2',
    icon: 'mdi-check-circle',
  },
];

const futureFeatures: FeatureItemType[] = [
  {
    title: 'Future Feature 1',
    icon: 'mdi-alert-circle',
  },
  {
    title: 'Future Feature 2',
    icon: 'mdi-alert-circle',
  },
];
</script>

<template>
  <v-container id="feature-list" class="feature-list-container">
    <v-row class="feature-list-row">
      <feature-section title="Aktuelle Features" :features="currentFeatures" />
      <feature-section title="Zukünftige Features" :features="futureFeatures" />
    </v-row>
  </v-container>
</template>

<style scoped>
.feature-list-container {
  background-color: var(--color-card);
  border-radius: var(--border-radius);
  width: 100%;
}
</style>

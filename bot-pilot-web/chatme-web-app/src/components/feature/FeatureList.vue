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
  <div id="feature-list" class="feature-list-container pt-4">
    <v-row class="feature-list-row justify-start align-stretch" dense>
      <v-col class="h-100" cols="12" sm="6" lg="6" md="6">
        <feature-section
          title="Aktuelle Features"
          :features="currentFeatures"
          icon="mdi-puzzle-outline"
        />
      </v-col>
      <v-col class="h-100" cols="12" sm="6" lg="6" md="6">
        <feature-section
          title="Zukünftige Features"
          :features="futureFeatures"
          icon="mdi-arrow-top-right-bold-outline"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.feature-list-container {
  background-color: var(--color-card);
  width: 100%;
}
</style>

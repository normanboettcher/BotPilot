<script setup lang="ts">
import FeatureItem from '@/components/feature/FeatureItem.vue';
import type { FeatureItemType } from '@/components/domain/Feature.ts';
import { defineProps } from 'vue';

defineProps<{ features: FeatureItemType[]; title: string; icon: string }>();
</script>

<template>
  <v-card class="feature-card pa-4" elevation="2">
    <div class="feature-heading d-flex align-center">
      <v-icon size="30" color="primary">{{ icon }}</v-icon>
      <h4 class="feature-col-title ml-2">{{ title }}</h4>
    </div>
    <v-card-text>
      <div class="feature-item" v-for="(featureItem, index) in features" :key="index">
        <feature-item :feature="featureItem" />
        <div class="pt-1"></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.feature-card {
  background-color: var(--color-background);
  width: 100%;
}

.feature-col-title {
  color: var(--color-text);
  font-family: var(--font-family), sans-serif;
}

@media (max-width: 960px) {
  .feature-card {
    justify-content: space-between;
  }
}
</style>

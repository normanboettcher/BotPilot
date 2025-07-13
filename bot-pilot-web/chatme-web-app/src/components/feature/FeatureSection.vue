<script setup lang="ts">
import FeatureItem from '@/components/feature/FeatureItem.vue'
import type { FeatureItemType } from '@/components/domain/Feature.ts'
import { defineProps } from 'vue'

defineProps<{ features: FeatureItemType[]; title: string }>()
</script>

<template>
  <v-col class="feature-col">
    <v-card class="feature-card pa-4">
      <v-row class="feature-heading" justify="start" align="center">
        <v-icon size="30" color="primary">mdi-airplane</v-icon>
        <h4 class="feature-col-title ml-2">{{ title }}</h4>
      </v-row>
      <div class="feature-item" v-for="(featureItem, index) in features" :key="index">
        <feature-item :feature="featureItem" />
      </div>
    </v-card>
  </v-col>
</template>

<style scoped>
.v-row {
  padding: 0.5rem;
}

.feature-heading {
  display: flex;
  align-items: flex-start;
}

.feature-card {
  background-color: var(--color-background);
}

.feature-col-title {
  color: var(--color-text);
  font-family: var(--font-family), sans-serif;
}

.feature-item {
  padding-left: 0.3rem;
  padding-top: 0.3rem;
}
</style>

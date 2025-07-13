<script setup lang="ts">
import type { FeatureItemType } from '@/components/domain/Feature.ts'
import FeatureItem from '@/components/feature/FeatureItem.vue'

const currentFeatures: FeatureItemType[] = [
  {
    title: 'Current Feature 1',
    icon: 'mdi-check-circle',
  },
  {
    title: 'Current Feature 2',
    icon: 'mdi-check-circle',
  },
]

const futureFeatures: FeatureItemType[] = [
  {
    title: 'Future Feature 1',
    icon: 'mdi-alert-circle',
  },
  {
    title: 'Future Feature 2',
    icon: 'mdi-alert-circle',
  },
]
</script>

<template>
  <v-card class="feature-list-container">
    <v-row class="feature-list-row">
      <v-col class="current-feature-col">
        <v-card class="feature-card pa-4">
          <h4 class="feature-col-title">Aktuelle Features des BotPilot</h4>
          <div class="feature-item" v-for="(featureItem, index) in currentFeatures" :key="index">
            <feature-item :feature="featureItem" />
          </div>
        </v-card>
      </v-col>
      <v-col class="future-feature-col">
        <v-card class="feature-card pa-4">
          <h4 class="feature-col-title">Zukünftige Features des BotPilot</h4>
          <div class="feature-item" v-for="(featureItem, index) in futureFeatures" :key="index">
            <feature-item :feature="featureItem" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.feature-item {
  padding-top: 0.3rem;
  padding-left: 0.3rem;
}

.feature-card {
  background-color: var(--color-background);
}

.feature-col-title {
  color: var(--color-text);
  font-family: var(--font-family), sans-serif;
}

.feature-list-container {
  background-color: var(--color-card);
  padding-top: 1rem;
  border-radius: var(--border-radius);
  width: 100%;
}

.feature-list-row {
  display: flex;
  flex-grow: 1;
  padding: 0;
}
</style>

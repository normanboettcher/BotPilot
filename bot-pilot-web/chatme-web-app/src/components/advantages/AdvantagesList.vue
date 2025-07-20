<script setup lang="ts">
import AdvantageItem from '@/components/advantages/AdvantageItem.vue';
import type { Advantage } from '@/components/domain/Advantage.ts';

const advantages: Advantage[] = [
  {
    icon: 'mdi-lightbulb-on',
    label: 'Innovative Solutions',
    description: 'Cutting-edge technology to enhance your experience.',
  },
  {
    icon: 'mdi-account-group',
    label: 'Community Driven',
    description: 'Built by a passionate community of developers.',
  },
  {
    icon: 'mdi-code-json',
    label: 'Open Source',
    description: 'Transparent and accessible code for everyone.',
  },
  {
    icon: 'mdi-cog',
    label: 'Customizable',
    description: 'Easily adaptable to fit your specific needs.',
  },
  {
    icon: 'mdi-security',
    label: 'Secure and Reliable',
    description: 'Robust security measures to protect your data.',
  },
  {
    icon: 'mdi-rocket',
    label: 'Fast Performance',
    description: 'Optimized for speed and efficiency.',
  },
];
</script>

<template>
  <v-container id="advantages-list" class="advantages-section">
    <v-row justify="center" class="advantages-header mb-8">
      <v-col class="text-center">
        <v-icon size="40" color="primary">mdi-star-circle-outline</v-icon>
        <h2 class="advantages-title">Ihre Vorteile</h2>
      </v-col>
    </v-row>
    <v-row class="advantages-list" dense>
      <v-col v-for="(advantage, index) in advantages" cols="12" sm="6" md="6" lg="4" :key="index">
        <advantage-item :advantage="advantage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.advantages-section {
  padding-bottom: 2rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
}

.advantages-header {
  margin-bottom: 2rem;
}

.advantages-title {
  margin-top: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--font-family), sans-serif;
}
</style>

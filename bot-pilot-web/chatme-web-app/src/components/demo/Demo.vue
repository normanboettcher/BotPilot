<script setup lang="ts">
import DemoIntro from '@components/demo/DemoIntro.vue'
import DemoSlideShow from '@components/demo/DemoSlideShow.vue'
import AdvantagesList from '@components/advantages/AdvantagesList.vue'
import PilotForm from '@components/form/pilot/PilotForm.vue'
import FeatureList from '@/components/feature/FeatureList.vue'
</script>

<template>
  <v-container class="demo-container">
    <v-card class="demo-card">
      <demo-intro />
      <v-divider class="demo-divider" />
      <demo-slide-show />
      <v-divider class="demo-divider" />
      <advantages-list />
      <v-divider class="demo-divider" />
      <feature-list />
      <v-divider class="demo-divider" />
      <pilot-form />
    </v-card>
  </v-container>
</template>

<style scoped>
.demo-container {
  background-color: var(--color-card);
}

.demo-card {
  background-color: var(--color-card);
  width: 100%;
  padding: 2rem;
  //border: var(--color-border);
}
</style>

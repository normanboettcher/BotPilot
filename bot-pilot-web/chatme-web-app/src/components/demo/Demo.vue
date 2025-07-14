<script setup lang="ts">
import DemoIntro from '@components/demo/DemoIntro.vue'
import DemoSlideShow from '@components/demo/DemoSlideShow.vue'
import AdvantagesList from '@components/advantages/AdvantagesList.vue'
import PilotForm from '@components/form/pilot/PilotForm.vue'
import FeatureList from '@/components/feature/FeatureList.vue'
</script>

<template>
  <v-container class="demo-container">
    <v-container class="demo-container">
      <demo-intro />
      <v-divider class="demo-divider" />
      <demo-slide-show />
      <v-divider class="demo-divider" />
      <advantages-list />
      <v-divider class="demo-divider" />
      <feature-list />
      <v-divider class="demo-divider" />
      <pilot-form />
    </v-container>
  </v-container>
</template>

<style scoped>
.demo-divider {
  padding: 1rem;
}

.demo-container {
  background-color: var(--color-card);
}

.demo-container {
  background-color: var(--color-card);
  width: 100%;
  //border: var(--color-border);
}
</style>

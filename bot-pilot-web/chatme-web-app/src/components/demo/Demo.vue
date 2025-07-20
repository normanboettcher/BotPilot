<script setup lang="ts">
import DemoIntro from '@components/demo/DemoIntro.vue';
import DemoSlideShow from '@components/demo/DemoSlideShow.vue';
import AdvantagesList from '@components/advantages/AdvantagesList.vue';
import PilotForm from '@components/form/pilot/PilotForm.vue';
import FeatureList from '@/components/feature/FeatureList.vue';
</script>

<template>
  <v-container class="demo-container">
    <demo-intro />
    <demo-slide-show />
    <advantages-list />
    <div class="pb-4">
      <feature-list />
    </div>
    <pilot-form />
  </v-container>
</template>

<style scoped>
.demo-container {
  background-color: var(--color-card);
  width: 100%;
  border: none;
}
</style>

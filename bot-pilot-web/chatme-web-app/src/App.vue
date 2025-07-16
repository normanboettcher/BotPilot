<script setup lang="ts">
import HomeView from '@/views/HomeView.vue';
import BotPilotHeader from '@components/header/BotPilotHeader.vue';
</script>

<template>
  <v-app>
    <BotPilotHeader />
    <v-main class="page-wrapper">
      <HomeView />
    </v-main>
  </v-app>
</template>

<style scoped>
.page-wrapper {
  padding: 4rem 2rem;
  background-color: var(--color-background);
  min-height: 100vh;
  width: 100%;
}

@media (max-width: 600px) {
  .page-wrapper {
    padding: 2rem 1rem;
  }
}
</style>

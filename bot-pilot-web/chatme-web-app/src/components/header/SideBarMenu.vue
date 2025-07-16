<script setup lang="ts">
import SideBarButton from '@components/header/SideBarButton.vue';
</script>

<template>
  <v-card color="white" class="sidebar-menu rounded-sm">
    <v-list density="comfortable">
      <side-bar-button title="Home" icon="mdi-home" element="home-view" />
      <v-divider></v-divider>
      <side-bar-button title="BotPilot" icon="mdi-robot" element="pilot-demo" />
      <v-divider></v-divider>
      <side-bar-button title="Ihre Vorteile" icon="mdi-star" element="advantages-list" />
      <v-divider></v-divider>
      <side-bar-button title="Features" icon="mdi-puzzle" element="feature-list" />
      <v-divider></v-divider>
      <side-bar-button title="Jetzt teilnehmen!" icon="mdi-rocket-launch" element="pilot-form" />
    </v-list>
  </v-card>
</template>

<style scoped></style>

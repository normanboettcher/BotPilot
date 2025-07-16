<script setup lang="ts">
import { ref } from 'vue';
import HeaderButtons from '@components/header/HeaderButtons.vue';

const drawer = ref(false);
</script>

<template>
  <v-app-bar class="bot-pilot-header rounded-lg" app color="primary">
    <!-- Nav Icon for Mobile Navigation -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

    <v-app-bar-title>Willkommen bei BotPilot</v-app-bar-title>
    <v-spacer></v-spacer>

    <!-- Desktop NavButtons -->
    <div class="d-none d-sm-flex">
      <header-buttons />
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary class="d-sm-none">
    <v-list>
      <v-list-item title="Home"></v-list-item>
      <v-list-item title="BotPilot"></v-list-item>
      <v-list-item title="Ihre Vorteile"></v-list-item>
      <v-list-item title="Features"></v-list-item>
      <v-list-item title="Jetzt teilnehmen!"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>

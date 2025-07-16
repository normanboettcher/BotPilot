<script setup lang="ts">
import { provide, ref } from 'vue';
import HeaderButtonList from '@components/header/HeaderButtonList.vue';
import SideBarMenu from '@components/header/SideBarMenu.vue';

const drawer = ref(false);
provide('closeDrawer', () => {
  drawer.value = false;
});
</script>

<template>
  <v-app-bar class="bot-pilot-header rounded-sm" app color="primary" dark>
    <!-- Nav Icon for Mobile Navigation -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />

    <v-app-bar-title class="d-lg-flex d-none text-h5 font-weight-bold"
      >Willkommen bei BotPilot
    </v-app-bar-title>
    <v-app-bar-title class="d-flex d-lg-none text-h6 font-weight-bold">BotPilot</v-app-bar-title>
    <v-spacer></v-spacer>

    <!-- Desktop NavButtons -->
    <div class="d-none d-md-flex">
      <header-button-list />
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary>
    <side-bar-menu />
  </v-navigation-drawer>
</template>

<style scoped></style>

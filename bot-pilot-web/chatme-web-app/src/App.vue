<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import BotPilotHeader from '@/components/header/BotPilotHeader.vue'
</script>

<template>
  <BotPilotHeader />
  <RouterView />
</template>

<style scoped></style>

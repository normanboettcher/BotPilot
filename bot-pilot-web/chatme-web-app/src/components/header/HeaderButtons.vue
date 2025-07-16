<script setup lang="ts">
import { defineProps } from 'vue';

const onClick = (element: string) => {
  document.getElementById(element)?.scrollIntoView({ behavior: 'smooth' });
};
defineProps<{ sidebar?: boolean }>();
</script>

<template>
  <div>
    <v-btn class="nav-button">Home</v-btn>
    <v-btn class="nav-button">BotPilot</v-btn>
    <v-btn class="nav-button">Ihre Vorteile</v-btn>
    <v-btn class="nav-button">Features</v-btn>
    <v-btn class="nav-button" @click="() => onClick('pilot-form')">Jetzt teilnehmen!</v-btn>
  </div>
</template>

<style scoped></style>

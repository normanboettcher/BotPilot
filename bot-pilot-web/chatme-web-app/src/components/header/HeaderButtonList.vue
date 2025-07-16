<script setup lang="ts">
import { defineProps } from 'vue';
import HeaderButton from '@components/header/HeaderButton.vue';

defineProps<{ sidebar?: boolean }>();
</script>

<template>
  <div>
    <header-button title="Home" element="home-view" />
    <header-button title="BotPilot" element="pilot-demo" />
    <header-button title="Ihre Vorteile" element="advantages-list" />
    <header-button title="Features" element="feature-list" />
    <header-button title="Jetzt teilnehmen!" element="pilot-form" />
  </div>
</template>

<style scoped></style>

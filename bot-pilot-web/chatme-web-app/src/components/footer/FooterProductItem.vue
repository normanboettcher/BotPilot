<script setup lang="ts">
import FooterItem from '@components/footer/FooterItem.vue';
</script>

<template>
  <v-col class="d-flex text-center">
    <v-icon class="mr-2">mdi-robot</v-icon>
    <footer-item title="BotPilot - Your AI Assistant" />
    <v-divider class="ml-2 mr-2" thickness="2" vertical opacity="3"></v-divider>
    <footer-item title="2025 SNB technologies UG" />
  </v-col>
</template>

<style scoped>
v-divider {
  color: var(--color-text);
}
</style>

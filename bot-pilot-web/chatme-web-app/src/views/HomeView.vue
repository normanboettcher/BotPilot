<script setup lang="ts">
import Demo from '@/components/demo/Demo.vue'
</script>

<template>
  <v-main class="page-wrapper">
    <v-container class="full-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="11" lg="10" xl="9">
          <Demo />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
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

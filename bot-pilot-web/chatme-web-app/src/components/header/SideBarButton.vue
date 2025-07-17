<script setup lang="ts">
import { defineProps, inject } from 'vue';
import onMenuClick from '@components/header/functions/MenuClick.functions.ts';

defineProps<{
  title: string;
  icon: string;
  element: string;
}>();
const closeDrawer = inject('closeDrawer');
</script>

<template>
  <v-list-item
    :title="title"
    @click="
      () => {
        onMenuClick(element);
        closeDrawer();
      }
    "
  >
    <template #prepend>
      <v-icon>{{ icon }}</v-icon>
    </template>
  </v-list-item>
</template>

<style scoped></style>

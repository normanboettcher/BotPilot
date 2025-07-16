<script setup lang="ts">
import onMenuClick from '@components/header/functions/MenuClick.functions.ts';
import { defineProps } from 'vue';

defineProps<{
  element: string;
  title: string;
}>();
</script>

<template>
  <v-btn class="nav-button" @click="() => onMenuClick(element)">{{ title }}</v-btn>
</template>

<style scoped></style>

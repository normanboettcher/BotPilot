<script setup lang="ts">
import type { PilotFormTextField } from '@/components/domain/PilotFormTextField.ts';

import { defineProps, defineModel } from 'vue';

const props = defineProps<PilotFormTextField>();
const modelValue = defineModel<string>();
</script>

<template>
  <v-text-field
    :label="props.label"
    :type="props.type || 'text'"
    v-model="modelValue"
    required
    outlined
  ></v-text-field>
</template>

<style scoped>
.v-text-field {
  color: var(--color-text);
}
</style>

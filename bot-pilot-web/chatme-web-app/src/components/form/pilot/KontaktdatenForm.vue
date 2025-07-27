<script setup lang="ts">
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts';
import { defineProps, computed } from 'vue';
import usePilotFormRules from '@components/form/pilot/rules/usePilotFormRules.ts';

const props = defineProps<{
  modelValue: Kontaktdaten;
}>();

const kontaktdaten = computed(() => props.modelValue);

const { emailRules, textFieldRules, phoneRules } = usePilotFormRules();
</script>

<template>
  <v-text-field
    id="kanzlei"
    v-model="kontaktdaten.kanzlei"
    :rules="[textFieldRules[0]]"
    label="Kanzlei:"
    required
    outlined
  />
  <v-text-field
    id="ansprechpartner"
    v-model="kontaktdaten.ansprechpartner"
    :rules="[textFieldRules[0]]"
    label="Ansprechpartner:"
    required
    outlined
  />
  <v-text-field
    v-model="kontaktdaten.email"
    label="E-Mail:"
    :rules="[emailRules[0], emailRules[1]]"
    type="email"
    outlined
    required
  />
  <v-text-field
    v-model="kontaktdaten.telefon"
    label="Telefonnummer:"
    :rules="[phoneRules[0], phoneRules[1]]"
    type="tel"
    required
    outlined
  />
  <v-textarea v-model="kontaktdaten.anmerkungen" label="Anmerkungen:" outlined />
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}

.v-text-field {
  color: var(--color-text);
}
</style>

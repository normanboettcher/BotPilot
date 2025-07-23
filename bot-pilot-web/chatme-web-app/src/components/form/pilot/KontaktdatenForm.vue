<script setup lang="ts">
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts';
import { defineProps, defineEmits, computed } from 'vue';
import usePilotFormRules from '@components/form/pilot/rules/usePilotFormRules.ts';

const props = defineProps<{
  modelValue: Kontaktdaten;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: Kontaktdaten): void;
}>();

const updateKontaktdaten = (field: keyof Kontaktdaten, value: string | undefined) => {
  if (!value) {
    return;
  }
  const newValue = { ...props.modelValue, [field]: value };
  emit('update:modelValue', newValue);
};

const kontaktdaten = computed(() => props.modelValue);
const { emailRules, textFieldRules, phoneRules } = usePilotFormRules();
</script>

<template>
  <v-text-field
    id="kanzlei"
    @update:model-value="(value) => updateKontaktdaten('kanzlei', value)"
    :model-value="kontaktdaten.kanzlei"
    :rules="[textFieldRules]"
    label="Kanzlei:"
    required
    outlined
  />
  <v-text-field
    id="ansprechpartner"
    @update:model-value="(value) => updateKontaktdaten('ansprechpartner', value)"
    v-model="kontaktdaten.ansprechpartner"
    :rules="[textFieldRules]"
    label="Ansprechpartner:"
    required
    outlined
  />
  <v-text-field
    v-model="kontaktdaten.email"
    label="E-Mail:"
    @update:model-value="(value) => updateKontaktdaten('email', value)"
    :rules="[emailRules]"
    type="email"
    outlined
    required
  />
  <v-text-field
    v-model="kontaktdaten.telefon"
    @update:model-value="(value) => updateKontaktdaten('telefon', value)"
    label="Telefonnummer:"
    :rules="[phoneRules]"
    type="tel"
    required
    outlined
  />
  <v-textarea
    v-model="kontaktdaten.anmerkungen"
    @update:model-value="(value) => updateKontaktdaten('anmerkungen', value)"
    label="Anmerkungen:"
    :rules="[textFieldRules]"
    outlined
  />
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}

.v-text-field {
  color: var(--color-text);
}
</style>

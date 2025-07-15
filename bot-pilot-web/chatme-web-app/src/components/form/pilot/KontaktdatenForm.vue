<script setup lang="ts">
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts';
import PilotFormTextField from '@/components/form/pilot/PilotFormTextField.vue';
import { defineProps, defineEmits, computed } from 'vue';
import { isStringInputEmpty } from '@/components/form/pilot/utils/pilotform.utils.ts';

const props = defineProps<{
  modelValue: Kontaktdaten;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: Kontaktdaten): void;
}>();

const updateKontaktdaten = (field: keyof Kontaktdaten, value: string | undefined) => {
  if (isStringInputEmpty(value)) {
    return;
  }
  const newValue = { ...props.modelValue, [field]: value };
  emit('update:modelValue', newValue);
};

const kontaktdaten = computed(() => props.modelValue);
</script>

<template>
  <pilot-form-text-field
    id="kanzlei"
    @update:model-value="(value) => updateKontaktdaten('kanzlei', value)"
    :model-value="kontaktdaten.kanzlei"
    label="Kanzlei"
  />
  <pilot-form-text-field
    id="ansprechpartner"
    @update:model-value="(value) => updateKontaktdaten('ansprechpartner', value)"
    v-model="kontaktdaten.ansprechpartner"
    label="Ansprechpartner"
  />
  <pilot-form-text-field
    v-model="kontaktdaten.email"
    label="E-Mail"
    @update:model-value="(value) => updateKontaktdaten('email', value)"
    type="email"
  />
  <pilot-form-text-field
    v-model="kontaktdaten.telefon"
    @update:model-value="(value) => updateKontaktdaten('telefon', value)"
    label="Telefonnummer"
    type="tel"
  />
  <v-textarea
    v-model="kontaktdaten.anmerkungen"
    @update:model-value="(value) => updateKontaktdaten('anmerkungen', value)"
    label="Anmerkungen:"
    outlined
  />
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}
</style>

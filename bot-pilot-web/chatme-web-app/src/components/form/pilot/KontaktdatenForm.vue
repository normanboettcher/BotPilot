<script setup lang="ts">
import { defineModel } from 'vue'
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts'
import PilotFormTextField from '@/components/form/pilot/PilotFormTextField.vue'

const modelValue = defineModel<Kontaktdaten>({
  type: Object,
  default: () => ({
    ansprechpartner: '',
    email: '',
    telefon: '',
    anmerkungen: '',
    kanzlei: '',
  }),
})
</script>

<template>
  <pilot-form-text-field id="kanzlei" v-model="modelValue.kanzlei" label="Kanzlei" />
  <pilot-form-text-field
    id="ansprechpartner"
    v-model="modelValue.ansprechpartner"
    label="Ansprechpartner"
  />
  <pilot-form-text-field v-model="modelValue.email" label="E-Mail" type="email" />
  <pilot-form-text-field v-model="modelValue.telefon" label="Telefonnummer" type="tel" />
  <v-textarea v-model="modelValue.anmerkungen" label="Anmerkungen:" outlined />
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}
</style>

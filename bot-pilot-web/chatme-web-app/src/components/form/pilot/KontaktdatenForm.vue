<script setup lang="ts">
import { defineModel } from 'vue'
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts'
import PilotFormTextField from '@/components/form/pilot/PilotFormTextField.vue'

const model = defineModel<Kontaktdaten>({
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
  <pilot-form-text-field id="kanzlei" v-model="model.kanzlei" label="Kanzlei" />
  <pilot-form-text-field
    id="ansprechpartner"
    v-model="model.ansprechpartner"
    label="Ansprechpartner"
  />
  <pilot-form-text-field v-model="model.email" label="E-Mail" type="email" />
  <pilot-form-text-field v-model="model.telefon" label="Telefonnummer" type="tel" />
  <v-textarea v-model="model.anmerkungen" label="Anmerkungen:" outlined />
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}
</style>

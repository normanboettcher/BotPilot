<script setup lang="ts">
import PilotFormTextField from '@/components/form/pilot/PilotFormTextField.vue'
import type { Faq } from '@/components/domain/Faq.ts'
import { defineModel } from 'vue'

const model = defineModel<{ faqs: Array<Faq> }>({
  type: Object,
  default: () => ({
    faqs: Array(10).fill({ question: '', answer: '' }),
  }),
})
</script>

<template>
  <div class="faq-scroll-wrapper">
    <div class="faq-list-container" v-for="i in 10" :key="i">
      <h3>{{ i }}. FAQ</h3>
      <pilot-form-text-field label="Frage:" />
      <v-textarea v-model="model.faqs[i]" label="Antwort:" required outlined></v-textarea>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<style scoped>
.faq-scroll-wrapper {
  max-height: 400px; /* passt du je nach Design an */
  overflow-y: auto;
  padding-right: 8px; /* damit Scrollbar nicht überlappt */
}

.v-textarea {
  color: var(--color-text);
}

@media (min-width: 600px) {
  .faq-scroll-wrapper {
    max-height: 500px;
  }
}

@media (max-width: 599px) {
  .faq-scroll-wrapper {
    max-height: 300px;
  }
}

.faq-list-container {
  margin-top: 0.5rem;
}
</style>

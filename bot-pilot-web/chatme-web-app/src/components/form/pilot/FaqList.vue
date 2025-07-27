<script setup lang="ts">
import type { Faq } from '@/components/domain/Faq.ts';
import { defineProps, defineEmits } from 'vue';
import usePilotFormRules from '@components/form/pilot/rules/usePilotFormRules.ts';

const props = defineProps<{ modelValue: Array<Faq> }>();
const emit = defineEmits(['update:modelValue']);

function updateFaq(index: number, field: 'question' | 'answer', value: string | undefined) {
  if (!value) {
    return;
  }
  const newFaqs = [...props.modelValue];
  newFaqs[index] = { ...newFaqs[index], [field]: value };
  emit('update:modelValue', newFaqs);
}

const { textFieldRules } = usePilotFormRules();
</script>

<template>
  <div class="faq-scroll-wrapper">
    <div class="faq-list-container" v-for="(faq, i) in props.modelValue" :key="i">
      <h3>{{ i + 1 }}. FAQ</h3>
      <v-text-field
        v-model="faq.question"
        label="Frage:"
        @update:model-value="(value) => updateFaq(i, 'question', value)"
        :rules="[...textFieldRules]"
        required
        outlined
      />
      <v-textarea
        v-model="faq.response"
        label="Antwort:"
        @update:model-value="(value) => updateFaq(i, 'answer', value)"
        :rules="[...textFieldRules]"
        required
        outlined
      ></v-textarea>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<style scoped>
.faq-scroll-wrapper {
  max-height: 400px;
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

.v-text-field {
  color: var(--color-text);
}

h3 {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}
</style>

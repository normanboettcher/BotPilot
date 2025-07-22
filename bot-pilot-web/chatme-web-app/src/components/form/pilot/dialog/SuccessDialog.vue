<script setup lang="ts">
import { defineModel } from 'vue';

const modelValue = defineModel<boolean>();
console.log('modelValue', modelValue.value);
</script>
<template>
  <v-dialog v-model="modelValue" max-width="600px">
    <v-card class="success-dialog-card pa-4">
      <v-card-title class="success-dialog-headline pl-6">Vielen Dank!</v-card-title>
      <v-card-text>
        Ihre Anmeldung wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="success-dialog-button"
          variant="elevated"
          color="primary"
          @click="$emit('update:modelValue', modelValue)"
          >Bestätigen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.success-dialog-card {
  background-color: var(--color-card);
  color: var(--color-text);
}

.success-dialog-headline {
  color: var(--color-heading);
}
</style>

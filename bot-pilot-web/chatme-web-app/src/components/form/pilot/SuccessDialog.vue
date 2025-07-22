<script setup lang="ts">
import { defineModel } from 'vue';

const modelValue = defineModel<boolean>();
console.log('modelValue', modelValue.value);
</script>
<template>
  <v-dialog v-model="modelValue" max-width="600px">
    <v-card>
      <v-card-title class="headline">Vielen Dank!</v-card-title>
      <v-card-text>
        Ihre Anmeldung wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('update:modelValue', modelValue)">Bestätigen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>

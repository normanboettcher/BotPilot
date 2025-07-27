<script setup lang="ts">
import { computed, ref } from 'vue';
import useFormData from '@components/form/pilot/modal/composables/useFormData.ts';
import AbsendenModal from '@components/form/pilot/modal/steps/AbsendenModal.vue';
import ModalHeader from '@components/form/pilot/modal/ModalHeader.vue';
import KontaktdatenModal from '@components/form/pilot/modal/steps/KontaktdatenModal.vue';
import WillkommenModal from '@components/form/pilot/modal/steps/WillkommenModal.vue';
import FaqModal from '@components/form/pilot/modal/steps/FaqModal.vue';
import useFormValidations from '@components/form/pilot/modal/composables/useFormValidations.ts';

const { formData } = useFormData();
const showModal = ref<boolean>(false);
const step = ref(0);
const onClick = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};
const submitForm = () => {
  console.log('submitForm', formData);
};
const kontakdatenValid = ref<boolean>();
const faqsValid = ref<boolean>();
</script>

<template>
  <v-dialog v-model="showModal" max-width="600px">
    <v-stepper v-model="step">
      <v-stepper-header class="flex align-center">
        <v-stepper-item value="1" title="Willlkommen" color="primary" :complete="step > 0" />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item
          value="2"
          color="primary"
          title="Kontaktdaten"
          :rules="[kontakdatenValid ? () => true : () => false]"
          :complete="kontakdatenValid && step > 1"
        />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item
          title="FAQs"
          value="3"
          color="primary"
          :rules="[faqsValid ? () => true : () => false]"
          :complete="faqsValid && step > 2"
        />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item title="Absenden" value="4" color="primary" />
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="1">
          <willkommen-modal v-model="step" />
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          <v-form v-model="kontakdatenValid" lazy-validation>
            <kontaktdaten-modal v-model="step" :kontaktdaten="formData.kontaktdaten" />
          </v-form>
        </v-stepper-window-item>
        <v-stepper-window-item value="3">
          <v-form v-model="faqsValid" lazy-validation>
            <faq-modal v-model="step" :faqs="formData.faqs" />
          </v-form>
        </v-stepper-window-item>
        <v-stepper-window-item value="4">
          <absenden-modal v-model="step" @modal:submit="submitForm" />
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
    <div class="d-flex pt-2">
      <v-spacer />
      <v-btn color="primary" rounded @click="closeModal">Schließen</v-btn>
    </div>
  </v-dialog>
  <v-btn @click="onClick">Test</v-btn>
</template>

<style scoped>
.v-dialog {
  background-color: var(--color-card);
  color: var(--color-text);
}

.v-stepper-header {
  background-color: var(--color-card);
  color: var(--color-text);
}

.v-stepper-window {
  background-color: var(--color-card);
  color: var(--color-text);
}

.v-stepper-window-item {
  background-color: var(--color-card);
  color: var(--color-text);
}

.v-stepper {
  background-color: var(--color-card);
  color: var(--color-text);
}
</style>

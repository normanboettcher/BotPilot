<script setup lang="ts">
import { computed, ref } from 'vue';
import useFormData from '@components/form/pilot/modal/composables/useFormData.ts';
import AbsendenModal from '@components/form/pilot/modal/steps/AbsendenModal.vue';
import KontaktdatenModal from '@components/form/pilot/modal/steps/KontaktdatenModal.vue';
import WillkommenModal from '@components/form/pilot/modal/steps/WillkommenModal.vue';
import FaqModal from '@components/form/pilot/modal/steps/FaqModal.vue';

const { formData } = useFormData();
const showModal = ref<boolean>(false);
const step = ref(0);
const sending = ref(false);
const success = ref(false);
const onClick = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};
const submitForm = () => {
  sending.value = true;
  console.log('submitForm', formData);
  console.log(allValid.value);
  setTimeout(() => {
    sending.value = false;
    success.value = true;
  }, 2000);
};
const kontakdatenValid = ref<boolean>();
const faqsValid = ref<boolean>();
const allValid = computed(() => kontakdatenValid.value && faqsValid.value);
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
            <faq-modal v-model="step" v-model:faqs="formData.faqs" />
          </v-form>
        </v-stepper-window-item>
        <v-stepper-window-item value="4">
          <absenden-modal
            v-if="!sending"
            v-model:form-valid="allValid"
            v-model:success="success"
            v-model="step"
            @modal:submit="submitForm"
          />
          <div v-else class="d-flex justify-center align-center" style="height: 100%">
            <v-progress-circular indeterminate color="primary" size="64" />
          </div>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
    <div class="d-flex pt-2">
      <v-spacer />
      <v-btn color="primary" rounded @click="closeModal">Schließen</v-btn>
    </div>
  </v-dialog>
  <v-btn color="primary" rounded @click="onClick"
    >Jetzt an Pilotgruppe teilnehmen!
    <template #append>
      <v-icon>mdi-open-in-new</v-icon>
    </template>
  </v-btn>
</template>

<style scoped>
.v-dialog {
  background-color: var(--color-card);
  color: var(--color-text);
}

.v-stepper-item {
  pointer-events: none;
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

<script setup lang="ts">
import { ref } from 'vue';
import ModalCard from '@components/form/pilot/modal/ModalCard.vue';
import KontaktdatenForm from '@components/form/pilot/KontaktdatenForm.vue';
import type { Kontaktdaten } from '@domain/Kontaktdaten.ts';

const showModal = ref<boolean>(false);
const step = ref(0);
const onClick = () => {
  showModal.value = true;
};
const kontaktdaten = ref<Kontaktdaten>();
</script>

<template>
  <v-dialog v-model="showModal" max-width="600px">
    <v-stepper v-model="step">
      <v-stepper-header class="flex align-center">
        <v-stepper-item value="1" title="Willlkommen" color="primary" />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item value="2" color="primary" title="Kontaktdaten" />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item title="FAQs" value="3" color="primary" />
        <v-divider class="pl-6 grey" opacity="1"></v-divider>
        <v-stepper-item title="Absenden" value="4" color="primary" />
      </v-stepper-header>
      <v-stepper-window>
        <v-stepper-window-item value="1">
          <modal-card
            v-model="step"
            title="Willkommen bei unserer Pilotgruppe"
            :has-back-button="false"
          >
            <template #content-title>
              Willkommen zu unserem Formular. Bitte folgen Sie den Schritten, um fortzufahren.
            </template>
          </modal-card>
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          <modal-card v-model="step" title="Willkommen bei unserer Pilotgruppe" has-back-button>
            <template #content>
              <kontaktdaten-form :model-value="kontaktdaten" />
            </template>
          </modal-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
    <v-spacer />
    <v-btn color="primary" rounded @click="showModal = false">Schließen</v-btn>
  </v-dialog>
  <v-btn @click="onClick">Test</v-btn>
</template>

<style scoped></style>

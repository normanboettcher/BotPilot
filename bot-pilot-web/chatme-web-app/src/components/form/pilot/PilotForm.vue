<script setup lang="ts">
import { ref } from 'vue'
import type { Faq } from '@components/domain/Faq.ts'
import type { Kontaktdaten } from '@components/domain/Kontaktdaten.ts'
import KontaktdatenForm from '@components/form/pilot/KontaktdatenForm.vue'
import FaqList from '@components/form/pilot/FaqList.vue'

type FormData = {
  kontaktdaten: Kontaktdaten
  faqs: Array<Faq>
}

const faqs = ref<Array<Faq>>([])

const formData = ref<FormData>({
  kontaktdaten: {
    ansprechpartner: '',
    email: '',
    telefon: '',
    kanzlei: '',
    anmerkungen: '',
  },
  faqs: faqs.value,
})

const submitForm = () => {
  // Hier können Sie die Logik zum Absenden des Formulars implementieren
  console.log('Formulardaten:', formData.value)
  // Beispiel: Senden der Daten an einen Server oder eine API
  // axios.post('/api/pilot', formData.value).then(response => {
  //   console.log('Erfolgreich gesendet:', response.data)
  // }).catch(error => {
  //   console.error('Fehler beim Senden:', error)
  // })
}
</script>
<template>
  <v-card class="pilot-form-card" elevation="2">
    <v-card-text class="pilot-form-heading">
      Nehmen Sie jetzt an der Pilotgruppe teil und bestellen Sie Ihren individuellen Chatbot!
    </v-card-text>
    <v-card-text class="pilot-form-content">
      <div class="kontaktdaten-heading">Kontaktdaten</div>
      <v-form>
        <kontaktdaten-form v-model="formData.kontaktdaten" />
        <v-divider></v-divider>
        <faq-list v-model="formData.faqs" />
        <v-row class="absenden-button-row pr-5 pt-4 pb-4" align="end" justify="end">
          <v-btn color="primary" @click="submitForm">Absenden</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.pilot-form-heading {
  font-size: var(--font-size-heading);
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.pilot-form-card {
  font-family: var(--font-family), serif;
  background-color: var(--color-card);
}

.kontaktdaten-heading {
  font-size: 20px;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.pilot-form-content {
  background-color: var(--color-card);
  border-radius: var(--border-radius);
}

h3 {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.v-btn {
  margin-top: 1rem;
}
</style>

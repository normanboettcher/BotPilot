<script setup lang="ts">
import { ref } from 'vue'
import type { Faq } from '@/components/domain/Faq.ts'
import type { Kontaktdaten } from '@/components/domain/Kontaktdaten.ts'
import PilotFormTextField from '@/components/form/pilot/PilotFormTextField.vue'

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
        <pilot-form-text-field
          id="ansprechpartner"
          v-model="formData.kontaktdaten.ansprechpartner"
          label="Ansprechpartner"
        />
        <pilot-form-text-field v-model="formData.kontaktdaten.email" label="E-Mail" type="email" />
        <pilot-form-text-field
          v-model="formData.kontaktdaten.email"
          label="Telefonnummer"
          type="tel"
        />
        <v-divider></v-divider>
        <div class="faq-scroll-wrapper">
          <div class="faq-list-container" v-for="i in 10" :key="i">
            <h3>{{ i }}. FAQ</h3>
            <pilot-form-text-field label="Frage:" />
            <v-textarea v-model="faqs[i]" label="Antwort:" required outlined></v-textarea>
            <v-divider></v-divider>
          </div>
        </div>
        <v-btn color="primary" @click="submitForm">Absenden</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-textarea {
  color: var(--color-text);
}

.faq-scroll-wrapper {
  max-height: 400px; /* passt du je nach Design an */
  overflow-y: auto;
  padding-right: 8px; /* damit Scrollbar nicht überlappt */
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

.faq-list-container {
  margin-top: 0.5rem;
}

.v-btn {
  margin-top: 1rem;
}
</style>

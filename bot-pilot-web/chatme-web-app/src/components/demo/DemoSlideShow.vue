<script setup lang="ts">
const slides = [
  {
    image: '/screenshots/faq-demo-1.png',
    alt: 'Mandantenfrage an Steuerberater',
    title: 'Der Bot beantwortet typische Mandantenfragen',
    description: 'Rund um die Uhr verfügbar, ohne Wartezeiten.',
  },
  {
    image: '/screenshots/faq-demo-2.png',
    alt: 'Formularbasierte Datenerfassung',
    title: 'Wichtige Informationen automatisiert erfassen',
    description: 'Fragen zu Fahrtkosten, Unterlagen, Fristen etc.',
  },
  {
    image: '/screenshots/faq-demo-3.png',
    alt: 'Integration in Website',
    title: 'Einfache Integration in Ihre Kanzlei-Website',
    description: '100% DSGVO-konform und anpassbar.',
  },
];
</script>

<template>
  <v-carousel id="pilot-demo" height="400" show-arrows hide-delimiters cycle>
    <v-carousel-item v-for="(slide, i) in slides" :key="i">
      <v-img :src="slide.image" :alt="slide.alt" height="100%" cover />
      <div class="caption">
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.description }}</p>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
.caption {
  position: absolute;
  bottom: 20px;
  left: 24px;
  color: var(--color-text);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 8px;
  max-width: 80%;
}

@media (prefers-color-scheme: dark) {
  .caption {
    background-color: rgba(0, 0, 0, 0.5);
    color: var(--color-text);
  }
}
</style>

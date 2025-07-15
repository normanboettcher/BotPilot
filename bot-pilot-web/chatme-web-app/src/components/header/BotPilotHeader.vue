<script setup lang="ts">
const onClick = (element: string) => {
  document.getElementById(element)?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <header>
    <nav>
      <v-btn class="nav-button">Home</v-btn>
      <v-btn class="nav-button">BotPilot</v-btn>
      <v-btn class="nav-button">Ihre Vorteile</v-btn>
      <v-btn class="nav-button">Features</v-btn>
      <v-btn class="nav-button" @click="() => onClick('pilot-form')">Jetzt teilnehmen!</v-btn>
    </nav>
  </header>
</template>

<style scoped>
header {
  line-height: 1;
  max-height: 100vh;
  background-color: var(--color-background);
  align-content: center;
}

nav {
  width: 100%;
  font-size: 14px;
  color: var(--color-text);
}

.nav-button {
  color: var(--color-text);
  background-color: transparent;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: stretch;
    flex-wrap: wrap;
  }

  nav {
    text-align: center;
    font-size: 1rem;
    margin-top: 1rem;
  }
}
</style>

<script setup lang="ts">
import FooterItemList from '@components/footer/FooterItemList.vue';
import FooterItem from '@components/footer/FooterItem.vue';
</script>

<template>
  <footer-item-list title="Rechtliches" icon="mdi-scale-balance">
    <template #FooterItems>
      <footer-item title="Impressum" clickable />
      <footer-item title="Datenschutzerklärung" clickable />
      <footer-item title="Nutzungsbedingungen" clickable />
      <footer-item title="AV-Vertrag anfordern" clickable />
    </template>
  </footer-item-list>
</template>

<style scoped></style>

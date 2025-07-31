<script setup lang="ts">
import FooterItem from '@components/footer/FooterItem.vue';
import FooterProductItem from '@components/footer/FooterProductItem.vue';
import FooterNavigationList from '@components/footer/FooterNavigationList.vue';
import FooterRechtlichesList from '@components/footer/FooterRechtlichesList.vue';
import FooterKontaktList from '@components/footer/FooterKontaktList.vue';

const dateItem = `${new Date().getFullYear()}` + ' - All rights reserved.';
</script>

<template>
  <v-footer class="footer" padless>
    <v-container>
      <v-row class="d-flex">
        <footer-product-item />
      </v-row>
      <v-row class="d-flex">
        <footer-navigation-list />
        <footer-rechtliches-list />
        <footer-kontakt-list />
      </v-row>
      <v-row class="d-flex justify-center">
        <footer-item :title="dateItem" />
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>

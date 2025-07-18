<script setup lang="ts">
import FooterItemList from '@components/footer/FooterItemList.vue';
import FooterItem from '@components/footer/FooterItem.vue';
</script>

<template>
  <footer-item-list title="Kontakt" icon="mdi-mailbox-open">
    <template #FooterItems>
      <footer-item title="snb.technologies@web.de" icon="mdi-email" clickable />
      <footer-item title="+49 177 1234657" icon="mdi-phone" />
      <footer-item title="Hosting: DSGVO-Konform in deutschen Rechenzentren" icon="mdi-web" />
    </template>
  </footer-item-list>
</template>

<style scoped></style>

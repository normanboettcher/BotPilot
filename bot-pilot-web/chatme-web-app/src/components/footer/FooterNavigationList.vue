<script setup lang="ts">
import FooterItem from '@components/footer/FooterItem.vue';
import FooterItemList from '@components/footer/FooterItemList.vue';
import onMenuClick from '@components/header/functions/MenuClick.functions.ts';
</script>

<template>
  <footer-item-list title="Navigation" icon="mdi-home">
    <template #FooterItems>
      <footer-item title="Home" clickable @footer:click="onMenuClick('home-view')" />
      <footer-item title="BotPilot" clickable @footer:click="onMenuClick('pilot-demo')" />
      <footer-item title="Ihre Vorteile" clickable @footer:click="onMenuClick('advantages-list')" />
      <footer-item title="Features" clickable @footer:click="onMenuClick('feature-list')" />
      <footer-item title="Jetzt teilnehmen!" clickable @footer:click="onMenuClick('pilot-form')" />
    </template>
  </footer-item-list>
</template>

<style scoped></style>

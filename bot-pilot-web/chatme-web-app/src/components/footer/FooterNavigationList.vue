<script setup lang="ts">
import FooterItem from '@components/footer/FooterItem.vue';
import FooterItemList from '@components/footer/FooterItemList.vue';
import onMenuClick from '@components/header/functions/MenuClick.functions.ts';
</script>

<template>
  <footer-item-list title="Navigation" icon="mdi-home">
    <template #FooterItems>
      <v-list-item>
        <footer-item title="Home" clickable @footer:click="onMenuClick('home-view')" />
      </v-list-item>
      <v-list-item>
        <footer-item title="BotPilot" clickable @footer:click="onMenuClick('pilot-demo')" />
      </v-list-item>
      <v-list-item>
        <footer-item
          title="Ihre Vorteile"
          clickable
          @footer:click="onMenuClick('advantages-list')"
        />
      </v-list-item>
      <v-list-item>
        <footer-item title="Features" clickable @footer:click="onMenuClick('feature-list')" />
      </v-list-item>
      <v-list-item>
        <footer-item
          title="Jetzt teilnehmen!"
          clickable
          @footer:click="onMenuClick('pilot-form')"
        />
      </v-list-item>
    </template>
  </footer-item-list>
</template>

<style scoped></style>

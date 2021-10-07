<script setup lang="ts">
import { isDark, toggleDark } from '~/logic'
</script>

<template>
  <nav class="text-xl mt-6">
    <button class="icon-btn mx-2 !outline-none" @click="toggleDark()">
      <i-carbon-moon v-if="isDark" />
      <i-carbon-sun v-else />
    </button>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank" title="GitHub">
      <i-carbon-logo-github />
    </a>
  </nav>
</template>

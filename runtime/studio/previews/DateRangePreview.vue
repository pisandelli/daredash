<script setup lang="ts">
import { ref } from 'vue'
const range = ref({ start: '2026-08-01', end: '2026-08-31' })
</script>
<template><section class="dd-studio-preview"><header class="dd-studio-preview-header"><h2>Date Range</h2><p>Two-month date interval picker with preset periods and a custom trigger.</p></header><div class="dd-studio-preview-block"><DdDateRange v-model="range" initial-date="2026-08-01"><button type="button">August 2026</button></DdDateRange></div></section></template>

<script setup lang="ts">
import { BlotterBlock } from '~/logic/steam/types'

const props = defineProps<{
  blotters: BlotterBlock[]
  date: number
}>()
const dateString = computed(() => {
  const date = new Date(props.date * 1000)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
})
</script>

<template>
  <div>
    <div v-once class="flex items-center">
      <span class="flex-auto border-b border-current"></span>
      <span>{{ dateString }}</span>
      <span class="flex-auto border-b border-current"></span>
    </div>
    <Blotter v-for="blotter, i in props.blotters" :key="i" class="m-4" :blotter="blotter"></Blotter>
  </div>
</template>

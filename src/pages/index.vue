<script setup lang="ts">
import { fetchUserNewsSince } from '~/logic/steam/api'
import { parseHtml } from '~/logic/steam/transformers'
import { BlotterBlock } from '~/logic/steam/types'
import { daysEarlier, today } from '~/logic/utils'

const unixtime = today() / 1000

const blottersList: BlotterBlock[][] = shallowReactive([])
const loading = ref(true)

async function loadNewsSince(unixtime: number) {
  const blotters = shallowReactive<BlotterBlock[]>([])
  blottersList.push(blotters)
  const json = await fetchUserNewsSince(unixtime)
  blotters.push(...parseHtml(json.blotter_html))
}
loadNewsSince(unixtime).then(() => {
  loading.value = false
})

const bottom = ref<Element|null>(null)

function loadMore() {
  if (!loading.value) {
    const checkline = bottom.value!.getBoundingClientRect().top
    if (window.innerHeight > checkline) {
      loading.value = true
      loadNewsSince(daysEarlier(blottersList.length) / 1000).then(() => {
        loading.value = false
      })
    }
  }
}
onMounted(() => {
  document.addEventListener('scroll', loadMore, true)
})
onUnmounted(() => {
  document.removeEventListener('scroll', loadMore, true)
})

</script>

<template>
  <main class="max-w-screen-sm h-full mx-auto">
    <section v-for="blotters, index in blottersList" :key="index">
      <BlotterList v-if="blotters.length > 0" :blotters="blotters" :date="unixtime - 24*3600*index"></BlotterList>
      <div v-else class="flex justify-center p-4">
        <i-eos-icons-bubble-loading></i-eos-icons-bubble-loading>
      </div>
    </section>
    <div ref="bottom" class="flex justify-center">
      ⭐
    </div>
  </main>
</template>

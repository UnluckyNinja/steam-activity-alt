<template>
  <div
    class="fixed inset-0 flex-col overflow-y-auto bg-blue-gray-300 dark:bg-blue-gray-700 transition-transform transform z-9000 duration-200"
    :class="{ '-translate-y-full': !showFeeds }"
  >
    <div class="flex w-full">
      <button
        class="w-10 h-10 rounded flex ml-auto mt-1 mr-1 items-center filter focus:outline-none hover:brightness-150 active:brightness-75"
        @click="toggle(false)"
      >
        <i-mdi-close-box-outline class="flex-1 text-3xl"></i-mdi-close-box-outline>
      </button>
    </div>
    <div class="min-h-0 text-blue-gray-700 dark:text-blue-gray-400">
      <router-view />
      <!-- <Footer /> -->
    </div>
    <teleport v-show="false" :to="insertPos">
      <button
        class="btn_grey_grey btn_small_thin ico_hover"
        :style="{
          display: 'flex',
          width: '100%',
          'align-items': 'center',
          padding: '0.5rem',
          margin: '0.5rem auto',
          'font-size': '1.875rem', /* 30px */
          'line-height': '2.25rem', /* 36px */
        }"
        @click="toggle(true)"
      >
        <i-mdi-new-box style="flex: none;" />
        <span style="flex: auto;">
          Change to Alt Feeds
        </span>
      </button>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'

const insertPos = ref(document.body)

const [showFeeds, toggle] = useToggle(false)

let handler: ReturnType<typeof watch> | null

function startWatch() {
  handler = watch(showFeeds, (newVal, oldVal) => {
    if (newVal)
      document.body.style.overflow = 'hidden'
      // const ele = document.querySelector<any>('#injected-styles') // check vite.config.ts
      // if (ele)
      //   ele.disabled = false
      // setTimeout(() => {
      //   showFeeds.value = true
      // }, 200)

    else
      document.body.style.overflow = 'auto'
      // const ele = document.querySelector<any>('#injected-styles') // check vite.config.ts
      // if (ele) {
      //   setTimeout(() => {
      //     ele.disabled = true
      //   }, 200)
      // }
      // showFeeds.value = false
  })
}

onMounted(() => {
  startWatch()
  // insert mount target below profile avatar
  if (insertPos.value === document.body) {
    const anchor = document.querySelector('#friendactivity_right_column > div > div:nth-child(1)')
    insertPos.value = document.createElement('div')
    if (anchor)
      anchor.insertAdjacentElement('afterend', insertPos.value)
  }
})
onUnmounted(() => {
  if (handler) {
    handler()
    handler = null
  }
})
</script>

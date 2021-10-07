<script setup lang="ts">
import { BlotterBlock, BlotterType } from '~/logic/steam/types'

const props = defineProps<{ blotter: BlotterBlock }>()
</script>

<template>
  <div class="border border-blue-gray-500">
    <!-- body -->
    <div v-if="blotter.type === BlotterType.GAME_PURCHASE" class="relative">
      <div class="absolute right-full rounded mr-4 w-10 h-10 bg-red-500">
        <img :src="blotter.assets.avatarURL" alt="">
      </div>
      <header class="header">
        {{ blotter.authorName }} just bought
        <template v-for="game, i in blotter.games" :key="i">
          <a :href="`https://store.steampowered.com/${game.type}/${game.id}/`">
            {{ game.title }}
          </a>
          <span v-if="i !== blotter.games.length - 1"> | </span>
        </template>
      </header>
      <p v-if="blotter.description" class="content">
        {{ blotter.description }}
      </p>
    </div>
    <div v-else-if="blotter.type === BlotterType.USER_STATUS" class="relative">
      <div class="absolute right-full rounded mr-4 w-10 h-10 bg-red-500">
        <img :src="blotter.assets.avatarURL" alt="">
      </div>

      <header v-if="blotter.game" class="header">
        {{ blotter.authorName }} posted a status about
        <a :href="`https://store.steampowered.com/${blotter.game.type}/${blotter.game.id}/`">
          {{ blotter.game.title }}
        </a>
      </header>
      <header v-else class="header">
        {{ blotter.authorName }} posted a status
      </header>

      <p class="content">
        {{ blotter.content }}
      </p>
    </div>
    <div v-else-if="blotter.type === BlotterType.GROUP_STATUS" class="relative">
      <div class="absolute right-full rounded mr-4 w-max bg-red-500">
        <a :href="blotter.origin"><img :src="blotter.assets.imageURL" alt=""></a>
      </div>
      <header class="header">
        <a :href="blotter.link">{{ blotter.title }}</a>
        <span class="text-sm">
          by <a :href="blotter.origin">{{ blotter.name }}</a>
        </span>
      </header>
      <p class="content">
        Just click the link above.
      </p>
    </div>
    <div v-else>
      Blotter is {{ BlotterType[props.blotter.type] }}
    </div>
    <!-- footer -->
    <div class="grid grid-cols-3">
      <div class="border-t border-blue-gray-500 flex justify-center">
        <i-mdi-share class="m-2"></i-mdi-share>
      </div>
      <div class="border border-b-0 border-blue-gray-500 flex justify-center">
        <i-mdi-comment-text class="m-2"></i-mdi-comment-text>
      </div>
      <div class="border-t border-blue-gray-500 flex justify-center">
        <i-mdi-heart-outline class="m-2"></i-mdi-heart-outline>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.header{
  @apply m-2 text-lg;
}
.content{
  @apply m-4;
}
a {
  @apply text-blue-700;
}
</style>

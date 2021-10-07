import path from 'path'
import { defineConfig, Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'userscript',
      formats: ['iife'],
      fileName: () => 'script.user.js',
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          'vue': 'Vue',
          'GM_addStyle': 'GM_addStyle',
          'vue-router': 'VueRouter',
        },
        inlineDynamicImports: true,
      },
    },
    minify: 'terser',
    terserOptions: {
      // compress: {
      //   defaults: false,
      //   unused: true,
      //   dead_code: true,
      // },
      mangle: false,
      format: {
        beautify: true,
      },
    },
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Inspect(), // only applies in dev mode
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [
        // auto import icons
        // https://github.com/antfu/vite-plugin-icons
        IconsResolver({
          componentPrefix: 'i',
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    Icons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    // custom plugin
    (() => {
      const headers = `\
// ==UserScript==
// @name         Steam Activity Alt
// @namespace    https://github.com/unluckyninja
// @version      0.1.0
// @description  make steam activites easier to look through
// @author       UnluckyNinja
// @include      /https://steamcommunity\.com/.*/home/?/
// @grant        GM_addStyle
// @noframes
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.6/dist/vue.global.min.js
// @require      https://unpkg.com/vue-router@4.0.11/dist/vue-router.global.prod.js
// ==/UserScript==
`
      const styleIdentifier = 'injected-styles'
      return {
        name: 'inject-css',
        apply: 'build',
        enforce: 'post',
        generateBundle(options, bundle) {
          const keyword = 'user.js'
          if (!bundle['style.css'] || bundle['style.css'].type !== 'asset') return
          const css = bundle['style.css'].source
          const [, target] = Object.entries(bundle).find(([name]) => {
            return name.includes(keyword)
          }) ?? []
          if (!target || target.type !== 'chunk') return
          target.code = `${headers}
          var styleEle = GM_addStyle(\`${css}\`)
          styleEle.id = '${styleIdentifier}'
          ${target.code}`
        },
      } as Plugin
    })(),
  ],

  server: {
    fs: {
      strict: true,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})

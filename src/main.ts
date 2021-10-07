// register vue composition api globally
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { name } from '../package.json'
import App from './App.vue'

// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import './styles/main.css'
import 'virtual:windi-utilities.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.use(router)
const appRoot = document.createElement('div')
appRoot.dataset.desp = `root of userscript ${name}`

// const shadow = appRoot.attachShadow({ mode: 'closed' })
// const realRoot = document.createElement('div')
// shadow.appendChild(realRoot)

document.body.appendChild(appRoot)
app.mount(appRoot)
const win: any = window

if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win)

    win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
}

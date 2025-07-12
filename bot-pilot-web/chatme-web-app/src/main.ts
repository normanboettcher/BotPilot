import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/theme.css'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
})

const app = createApp(App)

//app.use(createPinia())
app.use(vuetify)
//app.use(router)

app.mount('#app')

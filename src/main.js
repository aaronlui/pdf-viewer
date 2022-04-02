import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// eslint-disable-next-line no-undef
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

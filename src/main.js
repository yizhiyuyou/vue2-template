import Vue from 'vue'
import App from '@/App.vue'

import '@/plugins/axiosExtend'
import store from '@/store'

import '@/plugins/routerGuards'
import router from '@/router'

import directive from '@/directive'

// 按需加载组件
import '@/utils/importElementComponent'

Vue.config.productionTip = false

// 全局注册自定义指令
Object.entries(directive).forEach(([key, value]) => void Vue.directive(key, value))

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

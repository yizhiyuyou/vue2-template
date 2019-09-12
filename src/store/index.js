import Vue from 'vue'
import Vuex from 'vuex'

import createVuexLoadingPlugin from 'vuex-plugin-loading'

import { root } from './modules/root'

Vue.use(Vuex)

const store = {
  strict: process.env.NODE_ENV !== 'production',
  ...root,
  modules: {},
  plugins: [createVuexLoadingPlugin()],
}

export default new Vuex.Store(store)

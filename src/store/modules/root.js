import { Message } from 'element-ui'

import router from '@/router'
import { pages } from '@/config'
import injectInfo from '@/utils/injectInfo'
import {
  appSessionLogin,
  appTokenLogin,
  pageLogin,
  pageLogout,
  getDictionaryByType,
} from '@/services'

const state = {
  id: '',
  post: '',
  mobile: '',
  realname: '',
  username: '',
  roles: [],
  loaded: false,
  timestamp: `${Date.now()}`,
  dictionary: {},
}

const getters = {
  getDicByType: state => type => {
    const dic = state.dictionary[type]

    return Array.isArray(dic) ? dic : []
  },
}

const mutations = {
  setUser(state, user) {
    Object.assign(state, user)
  },
  setLoaded(state, loaded = false) {
    state.loaded = loaded
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
  clearInfo(state) {
    const user = {
      id: '',
      post: '',
      mobile: '',
      realname: '',
      username: '',
      roles: [],
    }

    const loaded = false

    const timestamp = `${Date.now()}`

    const dictionary = {}

    Object.assign(state, {
      user,
      loaded,
      timestamp,
      dictionary,
    })
  },
  setDictionary(state, payload) {
    state.dictionary = {
      ...state.dictionary,
      ...payload,
    }
  },
}

const actions = {
  // 系统登录方式。token 登录 | session 登录
  async appLogin({ dispatch }) {
    let res = { code: 'success' }

    // try catch 仅仅只为了捕获 JSON.parse 错误
    try {
      /**
       * 无法识别是跨系统统一登录，还是单系统刷新页面
       * 所以认定为多系统统一登录认证的情况，使用token
       */
      const name = window.name
      // 避免token泄露执行清空操作
      window.name = ''

      const token = JSON.parse(name).token

      // token登录 方式成功就成功，不成功就使用 刷新登录 方式
      res = await dispatch('appTokenLogin', token)

      if (res.code !== 'success') {
        res = await dispatch('appSessionLogin')
      }
    } catch (e) {
      res = await dispatch('appSessionLogin')
    }

    return res
  },
  // token登录
  async appTokenLogin({ dispatch }, token) {
    return dispatch('_login', {
      fn: appTokenLogin,
      params: { token },
    })
  },
  // session登录
  async appSessionLogin({ dispatch }) {
    return dispatch('_login', {
      fn: appSessionLogin,
    })
  },
  // 用于页面登录
  async pageLogin({ dispatch }, palyload) {
    const { code, msg } = await dispatch('_login', {
      fn: pageLogin,
      params: palyload,
    })

    if (code === 'success') {
      Message({
        type: 'success',
        duration: 1200,
        message: '登录成功, 正在跳转...',
        customClass: 'message-show-index',
      })

      // 不知道为什么就是想让你看一下我的登录效果600
      await (time => new Promise((resolve, reject) => void setTimeout(resolve, time)))(800)

      router.push({ path: pages.home.path })
    } else {
      Message({
        type: 'error',
        duration: 1600,
        message: msg || '登录失败，请重新登录',
        customClass: 'message-show-index',
      })

      // 不知道为什么就是想让你看一下我的登录效果600
      await (time => new Promise((resolve, reject) => void setTimeout(resolve, time)))(800)
    }

    return { code, msg }
  },
  async _login({ commit }, { fn, params }) {
    const res = await fn(params)

    if (res.code === 'success') {
      const info = injectInfo(res)

      if (typeof info !== 'boolean') {
        commit('setUser', info.user)
        commit('setLoaded', info.loaded)
        commit('setTimestamp', info.timestamp)
      }

      return info ? { code: 'success' } : { code: 'error', msg: '用户信息注入失败' }
    } else {
      return {
        code: res.code || 'error',
        msg: res.msg || '登录失败了',
      }
    }
  },
  // 清除信息
  async clearInfo({ commit }) {
    const user = {
      id: '',
      post: '',
      mobile: '',
      realname: '',
      username: '',
      roles: [],
    }

    const loaded = false

    const timestamp = `${Date.now()}`

    commit('setUser', user)
    commit('setLoaded', loaded)
    commit('setTimestamp', timestamp)

    return true
  },
  // 用于用户注销
  async pageLogout({ commit }) {
    const { code, msg } = await pageLogout()

    if (code === 'success') {
      commit('clearInfo')

      Message({
        type: 'success',
        duration: 1600,
        message: '注销成功, 正在跳转...',
      })

      await (time => new Promise((resolve, reject) => void setTimeout(resolve, time)))(1000)

      router.push({ path: pages.login.path })
    } else {
      Message({
        type: 'error',
        duration: 1600,
        message: msg || '注销失败，请重新注销',
      })
    }

    return { code, msg }
  },
  /**
   * @descriptio                  发送获取字典数据
   * @param {Object}   context    context对象
   */
  async sendGetDictionaryReq({ commit, state }, { type }) {
    // 调用获取字典接口
    const res = await getDictionaryByType({ type })

    const { code } = res

    // 成功则修改字典
    if (code === 'success') {
      const data = res.data.list

      commit('setDictionary', { [type]: data })

      return state.dictionary[type]
    }
  },
  // 获取字典数据
  async getDictionaryByType({ commit, dispatch, state }, { type, isUpload }) {
    const {
      dictionary: { [type]: dic = [] },
    } = state

    // 如果已经获取且不需要强制请求，则从数据中取
    if (Array.isArray(dic) && dic.length && !isUpload) {
      return dic
    }

    // Promise 处理同时加载相同的字典
    if (dic && dic.then) {
      const data = await dic

      return data
    }

    const fetchPro = dispatch('sendGetDictionaryReq', { type })

    commit('setDictionary', { [type]: fetchPro })

    // 否则发送请求从后端获取
    const data = await fetchPro

    return data
  },
  // 调用例子
  // 获取事件类型字典
  getEventType({ dispatch }, isUpload) {
    return dispatch('getDictionaryByType', { type: 'eventType', isUpload })
  },
}

export const root = {
  state,
  getters,
  actions,
  mutations,
}

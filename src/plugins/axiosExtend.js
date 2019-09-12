/**
 * Axios扩展
 * 1. 浏览器端页面弹出网络异常提示
 * 2. 用户会话超时重定向至登录页
 * 可调整的配置项：
 * timeout
 * waringMsg
 * sessionTimeoutMsgPath
 * sessionTimeoutMsg
 * loginPage
 */
import Vue from 'vue'
import Axios from 'axios'

import { get, post } from '@/utils/request'

export default function install(Vue) {
  Vue.prototype.$http = Axios.create()
  Vue.prototype.$http.get = get
  Vue.prototype.$http.post = post

  Vue.prototype.$axios = Axios
}

Vue.use(install)

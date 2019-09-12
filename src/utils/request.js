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
import Axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

import store from '@/store'
import router from '@/router'
import { getPropVal, compose } from '../utils/objectUtil'
import { devMode, restData, pages } from '@/config'

// 网络请求超时时长
const timeout = restData.timeout

// 网络请求异常的统一提示信息
const waringMsg = restData.waringMsg

// 登录状态超时提示信息
const sessionTimeoutMsg = restData.sessionTimeoutMsg

// 会话过期消息取值路径
const sessionTimeoutMsgPath = restData.sessionTimeoutMsgPath

// 会话过期判定消息
const sessionTimeoutCode = restData.sessionTimeoutCode

// 登录页地址
const loginPageName = pages.login.name

/**
 * @description                    整理格式化相应的数据
 * @param     {Objet}   res        响应数据
 * @return    {Object}             整理后的数据
 */
function resFormat(res) {
  const { respCode, respMessage, serverDate, respBody, respList } = res.data

  const temp = {
    code: respCode,
    msg: respMessage,
    timestamp: serverDate,
    data: {},
  }

  // 返回数据为list
  if (respList) {
    const data = {
      list: respList,
      pageIndex: res.data.pageIndex,
      pageSize: res.data.pageSize,
      pageCount: res.data.pages,
      total: res.data.recCount,
    }

    temp.data = data
    // 开发对接接口过程中的辅助字段说明
    if (res.data.zhConsult) {
      temp.remarks = res.data.zhConsult
    }
  } else {
    temp.data = { ...respBody }
  }

  return temp
}

/**
 * @description                       session 超时时的处理（不是请求超时）
 * @param  {Object}                   响应
 * @return {Object}                   响应数据或者是错误对象
 */
function sessionTimeout(res) {
  // 开发模式直接返回数据
  if (devMode) {
    return res
  }

  // 会话超时情况下，跳转至登录页并携带来时页面地址
  // 如果不是去往登录页或公开页，则执行跳转
  if (getPropVal(res, sessionTimeoutMsgPath) === sessionTimeoutCode) {
    // 区分已登录超时，还是刷新登录超时
    if (store.state.loaded) {
      Message({
        type: 'warning',
        duration: 1500,
        message: sessionTimeoutMsg,
        customClass: 'message-show-index',
      })

      store.dispatch('clearInfo')
    }

    router.push({ name: loginPageName })
  }

  return res
}

/**
 * @description                       统一的错误处理
 * @param  {Error}                    错误对象
 */
function catchError(e) {
  Message({
    type: 'warning',
    duration: 1500,
    message: waringMsg,
    customClass: 'message-show-index',
  })

  return Promise.reject(new Error(waringMsg))
}

// 相应处理（compose 从右往左执行）
const resProcess = compose(
  sessionTimeout,
  resFormat
)

export function get(url, data, config) {
  // 组装配置
  const conf = {
    ...config,
    method: 'get',
    url,
    params: data || null,
  }

  return request(conf)
}

export function post(url, data, config) {
  // 组装配置
  const conf = {
    transformRequest(data) {
      return qs.stringify(data)
    },
    ...config,
    method: 'post',
    url,
    data: data || null,
  }

  return request(conf)
}

async function request(config) {
  try {
    // 发起网络请求
    const res = await Axios.request(config)

    return await resProcess(res)
  } catch (e) {
    return catchError(e)
  }
}

// 网络请求拦截处理
Axios.defaults.timeout = timeout
Axios.defaults.headers.common['ProductInfo-Name'] = process.env.VUE_APP_NAME
Axios.defaults.headers.common['ProductInfo-Version'] = process.env.VUE_APP_VERSION

export default {
  get,
  post,
}

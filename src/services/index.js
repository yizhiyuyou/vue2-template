import md5 from 'md5'

import request from '@/utils/request'
import { restData } from '@/config'

// token登录
export function appTokenLogin(params) {
  return request.post(restData.checkUserInfoUrl, params)
}

// session登录
export function appSessionLogin() {
  return request.post(restData.checkUserInfoUrl)
}

// 用于页面登录
export function pageLogin(params) {
  const { username, password } = params

  return request.post(restData.checkLoginUrl, {
    username,
    password: params.md5 ? password : md5(password),
  })
}

// 用于页面注销
export function pageLogout() {
  return request.post(restData.logoutUrl)
}

export async function getDictionaryByType({ type }) {
  const res = await request.get('/rest/systemdicttype/findbydicttypegetdictinfo', {
    dictType: type,
  })

  if (res.code === 'success') {
    res.data.list = reduceDic(res.data.list)
  }

  return res
}

// 递归格式化字典数据
function reduceDic(list) {
  return list.map(({ name, value, parentName, typeId, dictChildList }) => {
    const item = {
      value,
      text: name,
    }

    parentName && Object.assign(item, { parentName })

    typeId && Object.assign(item, { typeId })

    Array.isArray(dictChildList) && Object.assign(item, { children: reduceDic(dictChildList) })

    return item
  })
}

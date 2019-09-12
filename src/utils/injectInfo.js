import { restData } from '@/config'
import { getPropVal } from '@/utils/objectUtil'

/**
 * @description                     注入用户信息
 * @param  {Object}           res   响应对象
 * @return {boolean | Object}       如果不成功返回 false
 *                                  否则返回通过响应拿到的用户数据
 */
function injectInfo(res) {
  try {
    const info = getRoleConfiguration(res)

    // 如果不合法就返回就结束注入用户信息
    if (!info) {
      return false
    }

    const user = getUserInfo(info)

    const loaded = true

    const timestamp = `${Date.now()}`

    return {
      user,
      loaded,
      timestamp,
    }
  } catch (e) {
    return false
  }
}

/**
 * @description                     获取后端返回的 角色信息并进行校验
 *                                  如果合法则返回用户信息，否则返回false
 * @param  {Object}           res   响应对象
 * @return {boolean | Object}       如果不成功返回 false，否则返回通过响应拿到的用户数据
 */
function getRoleConfiguration(info) {
  let user

  if (getPropVal(info, restData.authUserPath + '.roles')) {
    user = getPropVal(info, restData.authUserPath)
  }

  if (!user || !user.roles) {
    console.warn('用户角色信息配置不合法!')

    return false
  }

  // if (!user || !user.roles || !user.roles.length) {
  //   console.warn('用户角色信息配置不合法!')

  //   return false
  // }

  // 处理路网没有角色奇怪需求
  if (!user.roles.length) {
    Object.assign(user, { roles: ['我是个奇怪需求'] })
  }

  return user
}

// 整理并获得 用户信息
function getUserInfo(info) {
  const { id, post, mobile, realname, username, roles } = info

  return {
    id,
    post,
    mobile,
    realname,
    username,
    roles,
  }
}

export default injectInfo

import { Loading, Message } from 'element-ui'

import store from '@/store'
import router from '@/router'
import { devMode, pages } from '@/config'

router.beforeEach(getBeforeEachCallback())

router.afterEach((to, from) => {
  setTitle(to)
})

// 通过环境应用不同的前置守卫
function getBeforeEachCallback() {
  const isProduction = !devMode || process.env.NODE_ENV === 'production'

  return isProduction ? beforeEachProductionCallback : beforeEachDevelopmentCallback
}

// 生产环境前置守卫
async function beforeEachProductionCallback(to, from, next) {
  // 只要 matched 数组中只要有一个 authority 不为false，则为校验路由
  const hasCheck = to.matched.find(({ meta }) => meta && meta.authority)

  // 根据路由状态判断是否加载数据
  await loadUserData(hasCheck)

  // 如果是去开放路由，直接放行
  if (!hasCheck) {
    next()
  } else {
    // 如果不是去开放路由，判断用户信息
    if (!store.state.loaded) {
      next(pages.login.path)
    } else {
      const meta = to.matched[to.matched.length - 1].meta

      if (meta.hasRoute()) {
        next()
      } else {
        console.log(`控制台：您在生产环境中没有进入 ${to.name} 相应权限`)

        next('/403')
      }
    }
  }
}

// 开发环境前置守卫
function beforeEachDevelopmentCallback(to, from, next) {
  const meta = to.matched[to.matched.length - 1].meta

  if (meta.hasRoute()) {
    next()
  } else {
    Message({
      type: 'warning',
      duration: 2000,
      message: '无访问权限, 但是我让你过去。生产环境可就没这么爽快了。',
      customClass: 'message-show-index',
    })

    next()
  }
}

// 根据是否是校验路由去决定是否去加载用户信息
async function loadUserData(hasCheck) {
  /**
   * 无用户信息时显示loading,并加载用户信息
   * 注意：此处是用户新进入页面或者刷新页面
   */
  if (hasCheck && !store.state.loaded) {
    const loading = Loading.service({
      fullscreen: true,
      text: '极速加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)',
      customClass: 'loading-show-index',
    })

    // 获取用户信息, 执行用户身份校验。添加catch的原因是为了在失败后也能走到下面关闭弹窗
    await store.dispatch('appLogin').catch(e => void 0)

    // 关闭弹窗
    loading.close()
  }
}

// 设置title
function setTitle(to) {
  const {
    meta: { title },
  } = [...to.matched].reverse().find(item => item.meta.title) || { meta: {} }

  const systemName = process.env.VUE_APP_SYSTEM_NAME

  document.title = title ? `${systemName}-${title}` : systemName
}

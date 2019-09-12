import { pages } from '@/config'

import { initRoutesMeta, getNavMenuConfig, downToUpReduceMetaAuthority } from '@/utils/router'

const HomeLayout = () => import(/* webpackChunkName: "home" */ '@/layout/HomeLayout')
const HomePage = () => import(/* webpackChunkName: "home" */ '@/views/HomePage')

const LoginPage = () => import(/* webpackChunkName: "login" */ '@/views/LoginPage')

const TheNoFind = () => import(/* webpackChunkName: "404" */ '@/components/TheNoFind.vue')
const TheNoPermission = () =>
  import(/* webpackChunkName: "403" */ '@/components/TheNoPermission.vue')

const routes = [
  {
    path: pages.home.path,
    component: HomeLayout,
    meta: { hideInMenu: true },
    children: [
      {
        path: '',
        alias: pages.home.name,
        name: pages.home.name,
        component: HomePage,
        meta: {
          name: '首页',
          title: '地图模式',
          authority: true,
        },
      },
    ],
  },
  {
    path: pages.login.path,
    name: pages.login.name,
    component: LoginPage,
    meta: {
      title: '登录页面',
      hideInMenu: true,
    },
  },
  {
    path: '/',
    redirect: pages.home.path,
    meta: { hideInMenu: true },
  },
  {
    path: '/403',
    component: TheNoPermission,
    meta: { hideInMenu: true, title: '你没有权限访问该页面' },
  },
  {
    path: '*',
    component: TheNoFind,
    meta: { hideInMenu: true, title: '没有找到你要去的页面' },
  },
]

const reduceRoute = downToUpReduceMetaAuthority(initRoutesMeta(routes))

export const navMenuConfig = getNavMenuConfig(reduceRoute)

export default reduceRoute

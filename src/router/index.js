import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
// import routes from './ppt-route'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import NoAuth from '@/views/no-auth'
import store from '@/store'
// import { getList, getRouteKey } from './dev-test'
// const list = []
// getList(routes.find(item => item.path === '/').children, list)

// const allRouteKey = getRouteKey(list)

Vue.use(Router)
Vue.use(NProgress)

const router = new Router({
  routes: [],
  base: "/back/",
  mode: ['demo', 'demoout'].includes(process.env.VUE_APP_CURRENTMODE)
    ? 'hash'
    : 'history'
})

let flag = false
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const exreactInitialized = store.getters.exreactInitialized
  if (to.path.includes('/rd/exreact') && !exreactInitialized) {
    if (from.path.includes('/rd/dev')) {
      openNewWindow('/exreact/initialize')
    } else {
      next({
        path: '/exreact/initialize'
      })
    }
    return
  }
  if (to.path === '/exreact/initialize' && exreactInitialized) {
    next({
      path: '/rd/exreact'
    })
  }
  if (from.path === '/exreact/initialize' && to.path.includes('/rd/exreact') && !flag) {
    flag = true
    next(to)
    return
  }
  flag = false
  if (Object.keys(store.getters.menuAuths).length === 0) {
    await store.dispatch('getMenuAuths')
    await initRoutes()
    if (store.getters.menuAuths === 'null') {
      next('/500')
      return
    }
    const routesPathMap = getRouteMap(router.options.routes, {})
    // 绑到vue原型上
    Vue.prototype.$routesPathMap = routesPathMap
    next(to)
  }
  

  let route = {
    ...to
  }
  if (to.redirectedFrom) {
    route = Vue.prototype.$routesPathMap[route.redirectedFrom]
  }
  if (route && route.meta.href && !['/', '/home'].includes(from.path)) {
    openNewWindow(route.meta.href)
    // next()
    return
  }

  // if (allRouteKey.includes(route.name) && !Vue.prototype.$routesPathMap[route.path]) {
  // }

  if (route && route.path.indexOf('/rd/dev') > -1) {
    // 用于更新 数据源 的数据
    store.dispatch('getMetadata')
  }
  next()
})

router.afterEach((to, from, next) => {
  NProgress.done()
  if (window) {
    const name = to.meta.name ? to.meta.name + ' - ' : ''
    // window.document.title = name + router.app.$config.name
    window.document.title = name + store ? store.getters.title : ''
    window && window.scrollTo(0, 0)
  }
})

async function initRoutes(next) {
  await store.dispatch('getTitle')
  // store.dispatch('getBtnAuths')
  const i = routes.findIndex(item => item.path === '/'),
    menuRoutes = filterRoute(routes[i].children);
  if (menuRoutes) {
    const serveApi = menuRoutes.find(item => item.name === 'server')
    if (serveApi) {
      const index = serveApi.children.findIndex(item => item.name === 'api-dev')
      if (index > -1) {
        store.commit('SET_IS_SERVE_API', true)
      } else {
        store.commit('SET_IS_SERVE_API', false)
      }
    }
  }
  router.options.routes = routes
  router.addRoutes(routes, {
    override: true
  })

}

function openNewWindow(path) {
  // window.open(path)
  window.open('/back' + path)
  NProgress.done()
}

function filterRoute(routes, replaceComponent = NoAuth) {
  const result = []
  routes.forEach(route => {
    if (store.getters.menuAuths[route.name]) {
      if (route.children && route.children.length) {
        route.children = filterRoute(route.children)
      }
      route.meta.name = store.getters.menuAuths[route.name].menuName
      result.push(route)
    } else {
      route.meta.hideInMenu = true
      route.component = replaceComponent
      if (route.children && route.children.length) {
        route.children = filterRoute(route.children)
      }
      result.push(route)
    }
  })
  return result
}

function getRouteMap(routes, map) {
  return routes.reduce((prev, cur) => {
    prev[cur.path] = cur
    if (cur.children) {
      getRouteMap(cur.children, prev)
    }
    return prev
  }, map)
}
export default router

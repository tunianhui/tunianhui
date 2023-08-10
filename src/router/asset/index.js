import govern from './govern'
import safety from './safety'
import safetyNew from './safety-new'
import security from './security'
import quality from './quality'
import catalogue from './catalogue'
import standard from './standard'
import standardNew from './standard-new'
// import standup from './standup'
// import authority from './authority'

const WrapperView = {
  render: c => c('router-view')
}

const Wholescene = _ =>
  import(
    /* webpackChunkName: "asset-wholescene" */ '@/views/asset/wholescene/index.vue'
  )
// const Wholescene = _ => import(/* webpackChunkName: "asset-wholescene" */ '@/views/asset/wholescene/index.new.vue')

const MapWrapper = _ =>
  import(
    /* webpackChunkName: "asset-map-map" */ '@/views/asset/map/wrapper/index.vue'
  )
const Search = _ =>
  import(
    /* webpackChunkName: "asset-map-search" */ '@/views/asset/map/wrapper/search-result/index.vue'
  )
const Overview = _ =>
  import(
    /* webpackChunkName: "asset-map-overview" */ '@/views/asset/map/wrapper/overview/index.vue'
  )

const Detail = _ =>
  import(
    /* webpackChunkName: "asset-map-detail" */ '@/views/asset/map/detail/index.vue'
  )

const ListWrapper = _ =>
  import(
    /* webpackChunkName: "asset-list-map" */ '@/views/asset/list/wrapper/index.vue'
  )
const listSearch = _ =>
  import(
    /* webpackChunkName: "asset-list-search" */ '@/views/asset/list/wrapper/search-result/index.vue'
  )
const listOverview = _ =>
  import(
    /* webpackChunkName: "asset-list-overview" */ '@/views/asset/list/wrapper/overview/index.vue'
  )

const dataTableDetail = _ =>
  import(
    /* webpackChunkName: "asset-dataTable-detail" */ '@/views/asset/list/dataTableDetail/index.vue'
  )
const indicatorDetail = _ =>
  import(
    /* webpackChunkName: "asset-indicator-detail" */ '@/views/asset/list/indicatorDetail/index.vue'
  )
const functionDetail = _ =>
  import(
    /* webpackChunkName: "asset-function-detail" */ '@/views/asset/list/functionDetail/index.vue'
  )
const projectDetail = _ =>
  import(
    /* webpackChunkName: "asset-project-detail" */ '@/views/asset/list/projectDetail/index.vue'
  )
const dataSourceDetail = _ =>
  import(
    /* webpackChunkName: "asset-dataSource-detail" */ '@/views/asset/list/dataSourceDetail/index.vue'
  )
const serviceDetail = _ =>
  import(
    /* webpackChunkName: "asset-service-detail" */ '@/views/asset/list/serviceDetail/index.vue'
  )
// const Govern = _ =>
//   import(/* webpackChunkName: "asset-govern" */ '@/views/asset/govern/index.vue')
// const Application = _ =>
//   import(/* webpackChunkName: "asset-application" */ '@/views/asset/application/index.vue')

const LogInfo = _ =>
  import(
    /* webpackChunkName: "quality-logInfo" */ '@/views/asset/logInfo/index.vue'
  )

export default {
  path: '/asset',
  name: 'asset',
  meta: {
    name: '资产',
    icon: 'iconfont icon-zichan',
    headMenu: true
  },
  redirect: '/asset/wholescene',
  component: WrapperView,
  children: [
    {
      path: '/asset/wholescene',
      name: 'wholescene',
      meta: {
        name: '全景'
      },
      component: Wholescene
    },
    {
      path: '/asset/map',
      name: 'map',
      meta: {
        name: '地图',
        href: '/asset/map'
      },
      component: WrapperView,
      redirect: '/asset/map-view',
      children: [
        {
          path: '/asset/map-view',
          name: 'map-view',
          meta: {
            name: '地图'
          },
          component: MapWrapper,
          redirect: '/asset/map/overview',
          children: [
            {
              path: '/asset/map/overview',
              name: 'map-overview',
              meta: {
                name: '地图概览'
              },
              component: Overview
            },
            {
              path: '/asset/map/search-result',
              name: 'search',
              meta: {
                name: '地图搜索'
              },
              component: Search
            }
          ]
        },
        {
          path: '/asset/map/detail',
          name: 'detail',
          meta: {
            name: '地图'
          },
          component: Detail
        }
      ]
    },
    {
      path: '/asset/list',
      name: 'list',
      meta: {
        name: '目录',
        href: '/asset/list'
      },
      component: WrapperView,
      redirect: '/asset/list-view',
      children: [
        {
          path: '/asset/list-view',
          name: 'list-view',
          meta: {
            name: '目录'
          },
          component: ListWrapper,
          redirect: '/asset/list/overview',
          children: [
            {
              path: '/asset/list/overview',
              name: 'list-overview',
              meta: {
                name: '目录概览'
              },
              component: listOverview
            }
          ]
        },
        {
          path: '/asset/list/search-result',
          name: 'list-search',
          meta: {
            name: '目录搜索'
          },
          component: listSearch
        },
        {
          path: '/asset/list/dataTableDetail',
          name: 'dataTable-detail',
          meta: {
            name: '数据表详情'
          },
          component: dataTableDetail
        },
        {
          path: '/asset/list/indicatorDetail',
          name: 'indicator-detail',
          meta: {
            name: '指标详情'
          },
          component: indicatorDetail
        },
        {
          path: '/asset/list/functionDetail',
          name: 'function-detail',
          meta: {
            name: '函数详情'
          },
          component: functionDetail
        },
        {
          path: '/asset/list/projectDetail',
          name: 'project-detail',
          meta: {
            name: '项目详情'
          },
          component: projectDetail
        },
        {
          path: '/asset/list/dataSourceDetail',
          name: 'dataSource-detail',
          meta: {
            name: '数据源详情'
          },
          component: dataSourceDetail
        },
        {
          path: '/asset/list/serviceDetail',
          name: 'service-detail',
          meta: {
            name: '服务'
          },
          component: serviceDetail
        }
      ]
    },
    {
      path: '/asset/log',
      name: 'log',
      meta: {
        name: '运行日志',
        hideInMenu: true
      },
      component: LogInfo
    }
  ]
    .concat(standard)
    .concat(standardNew)
    .concat(quality)
    .concat(safety)
    .concat(safetyNew)
    .concat(security)
    .concat(govern)
    .concat(catalogue)

  // .concat(standup)
}

/*
 * @Author: 大炸鹅
 * @Date: 2023-02-02 13:34:35
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-03-03 09:43:56
 * @FilePath: \智能BId:\项目\数据智能构建\src\router\tag\workbench.js
 */
import {
  iconMap,
  types
} from '@/config/rd-config'
const WrapperView = {render: c => c('router-view')}
// const Layout = _ =>
//   import(
//     /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
//   )
const Layout = _ => import(/* webpackChunkName: "DevLayout" */ '@/views/rd/exreact/index.js')
// 行为中心
const BehaviorRegular = _ => import(/* webpackChunkName: "behavior-regular" */ '@/views/rd/exreact/behavior-center/behavior/regular/index.vue')
const DomainBus = _ => import(/* webpackChunkName: "domain-bus" */ '@/views/rd/exreact/behavior-center/element/domain-bus/index.vue')
const Action = _ => import(/* webpackChunkName: "action" */ '@/views/rd/exreact/behavior-center/element/action/index.vue')
const ObjectComponent = _ => import(/* webpackChunkName: "object" */ '@/views/rd/exreact/behavior-center/element/object/index.vue')
const ObjectAttr = _ => import(/* webpackChunkName: "object-attr" */ '@/views/rd/exreact/behavior-center/element/object-attr/index.vue')
// 标签中心
const Factory = _ => import(/* webpackChunkName: "tag-factory" */ '@/views/rd/exreact/tag-center/factory/index.vue')
const Logic = _ => import(/* webpackChunkName: "tag-logic" */ '@/views/rd/exreact/tag-center/logic/index.vue')
const Category = _ => import(/* webpackChunkName: "tag-category" */ '@/views/rd/exreact/tag-center/category/index.vue')
const Service = _ => import(/* webpackChunkName: "tag-service" */ '@/views/rd/exreact/tag-center/service/index.vue')
// ID中心
const EntityId = _ => import(/* webpackChunkName: "entity-ids-indexs" */ '@/views/rd/exreact/idsCenter/entity-id/index.vue')
const mappingTableId = _ => import(/* webpackChunkName: "mapping-table-ids-indexs" */ '@/views/rd/exreact/idsCenter/mapping-table/index.vue')
const Main = _ => import(/* webpackChunkName: "Main" */ '@/views/rd/exreact/idsCenter/main/index.vue')
export default [
  {
    path: '/tag/workbench',
    name: 'workbench',
    meta: {
      name: '工作台',
      sideMenu: true,
      // href: '/tag/workbench'
    },
    redirect: '/tag/workbench/id-center/main',
    component: Layout,
    children: [
      {
        path: '/tag/workbench/id-center',
        name: 'id-center',
        meta: {
          name: 'ID中心'
        },
        component: WrapperView,
        redirect: '/tag/workbench/id-center/main',
        children: [
          {
            path: '/tag/workbench/id-center/main',
            name: types.MAIN,
            meta: {
              name: '主体',
              ...iconMap[types.MAIN]
            },
            component: Main
          },
          {
            path: '/tag/workbench/id-center/entity-id',
            name: types.ENTITYID,
            meta: {
              name: '实体ID',
              ...iconMap[types.ENTITYID]
            },
            component: EntityId
          },
          {
            path: '/tag/workbench/id-center/mapping-table-id',
            name: types.MAPPINGTABLEID,
            meta: {
              name: 'ID映射表',
              ...iconMap[types.MAPPINGTABLEID]
            },
            component: mappingTableId
          },
        ]
      },
      {
        path: '/tag/workbench/behavior-center',
        name: 'behavior-center',
        meta: {
          name: '行为中心'
        },
        component: WrapperView,
        redirect: '/tag/workbench/behavior-center/element/domain-bus',
        children: [
          {
            path: '/tag/workbench/behavior-center/element',
            name: 'element',
            meta: {
              name: '行为元素',
              jump: false
            },
            component: WrapperView,
            redirect: '/tag/workbench/behavior-center/element/domain-bus',
            children: [
              {
                path: '/tag/workbench/behavior-center/element/domain-bus',
                name: types.DOMAINBUS,
                meta: {
                  name: '行为域&业务线',
                  ...iconMap[types.DOMAINBUS]
                },
                component: DomainBus
              },
              {
                path: '/tag/workbench/behavior-center/element/action',
                name: types.ACTION,
                meta: {
                  name: '动作',
                  ...iconMap[types.ACTION]
                },
                component: Action
              },
              {
                path: '/tag/workbench/behavior-center/element/object',
                name: types.OBJECT,
                meta: {
                  name: '对象',
                  ...iconMap[types.OBJECT]
                },
                component: ObjectComponent
              },
              {
                path: '/tag/workbench/behavior-center/element/object-attr',
                name: types.OBJECTATTR,
                meta: {
                  name: '对象属性',
                  ...iconMap[types.OBJECTATTR]
                },
                component: ObjectAttr
              }
            ]
          },
          {
            path: '/tag/workbench/behavior-center/behavior',
            name: 'behavior',
            meta: {
              name: '行为规则',
              jump: false
            },
            component: WrapperView,
            children: [
              {
                path: '/tag/workbench/behavior-center/behavior/regular',
                name: types.REGULAR,
                meta: {
                  name: '行为规则',
                  ...iconMap[types.REGULAR]
                },
                component: BehaviorRegular
              }
            ]
          }
        ]
      },
      {
        path: '/tag/workbench/tag-center',
        name: 'tag-center',
        meta: {
          name: '标签中心'
        },
        component: WrapperView,
        redirect: '/tag/workbench/tag-center/factory',
        children: [
          {
            path: '/tag/workbench/tag-center/factory-p',
            name: 'tag-center-factory',
            meta: {
              name: '标签工厂',
              jump: false
            },
            component: WrapperView,
            redirect: '/tag/workbench/tag-center/factory',
            children: [
              {
                path: '/tag/workbench/tag-center/factory',
                name: types.FACTORY,
                meta: {
                  name: '标签工厂',
                  ...iconMap[types.FACTORY]
                },
                component: Factory
              },
              {
                path: '/tag/workbench/tag-center/logic',
                name: types.TAGLOGIC,
                meta: {
                  name: '标签逻辑表',
                  ...iconMap[types.TAGLOGIC]
                },
                component: Logic
              }
            ]
          },
          {
            path: '/tag/workbench/tag-center/category-p',
            name: 'tag-center-category-p',
            meta: {
              name: '标签类目',
              jump: false
            },
            component: WrapperView,
            redirect: '/tag/workbench/tag-center/category',
            children: [
              {
                path: '/tag/workbench/tag-center/category',
                name: types.CATEGORY,
                meta: {
                  name: '标签类目',
                  ...iconMap[types.CATEGORY]
                },
                component: Category
              }
            ]
          },
          {
            path: '/tag/workbench/tag-center/service-p',
            name: 'tag-center-service-p',
            meta: {
              name: '标签服务',
              jump: false
            },
            component: WrapperView,
            children: [
              {
                path: '/tag/workbench/tag-center/service',
                name: types.TAGSERVICE,
                meta: {
                  name: '标签服务',
                  ...iconMap[types.TAGSERVICE]
                },
                component: Service
              }
            ]
          }
        ]
      }
    ]
  }
]
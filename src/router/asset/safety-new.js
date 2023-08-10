/*
 * @Author: 大炸鹅
 * @Date: 2022-10-24 13:44:37
 * @LastEditors: YONG
 * @LastEditTime: 2023-05-31 09:35:55
 * @FilePath: \智能数据构建\src\router\asset\safety-new.js
 */
import {safetyType} from '@/config/safety-config.js'
const WrapperView = {render: c => c('router-view')}

// const Layout = _ =>
//   import(
//     /* webpackChunkName: "sidemenu-layout" */ '@/views/layout/sidemenu-layout.vue'
//   )
const Layout = _ =>
  import(
    /* webpackChunkName: "Layout" */ '@/views/asset/safety-new/layout/index.js'
  )
// -------- 权限申请 ------------
const TableApply = _ =>
  import(
    /* webpackChunkName: "TableApply" */ '@/views/asset/safety-new/power-apply/table'
  )
const DatasourcePower = _ =>
  import(
    /* webpackChunkName: "DatasourcePower" */ '@/views/asset/safety-new/power-apply/datasource'
  )
const FunctionPower = _ =>
  import(
    /* webpackChunkName: "FunctionPower" */ '@/views/asset/safety-new/power-apply/function'
  )
const AbilityPower = _ =>
  import(
    /* webpackChunkName: "AbilityPower" */ '@/views/asset/safety-new/power-apply/ability'
  )
const VariablePower1 = _ =>
  import(
    /* webpackChunkName: "VariablePower1" */ '@/views/asset/safety-new/power-apply/variable'
  )
const KeyPower1 = _ =>
  import(
    /* webpackChunkName: "KeyPower1" */ '@/views/asset/safety-new/power-apply/key'
  )
const DataserverPower = _ =>
  import(
    /* webpackChunkName: "DataserverPower" */ '@/views/asset/safety-new/power-apply/dataserver'
  )
// -------- 权限管理 ------------
const DataSectionPower = _ =>
  import(
    /* webpackChunkName: "DataSectionPower" */ '@/views/asset/safety-new/power-manage/data-section'
  )
const VariablePower2 = _ =>
  import(
    /* webpackChunkName: "VariablePower2" */ '@/views/asset/safety-new/power-manage/variable'
  )
const KeyPower2 = _ =>
  import(
    /* webpackChunkName: "KeyPower2" */ '@/views/asset/safety-new/power-manage/key'
  )
const detailsDialog = _ =>
  import(
    /* webpackChunkName: "detailsDialog" */ '@/views/asset/safety-new/power-manage/key/detailsDialog.vue'
  )
const ProjectPower = _ =>
  import(
    /* webpackChunkName: "ProjectPower" */ '@/views/asset/safety-new/power-manage/project'
  )
const TablePower = _ =>
  import(
    /* webpackChunkName: "TablePower" */ '@/views/asset/safety-new/power-manage/table'
  )
const DataSourcePowerNew = _ =>
  import(
    /* webpackChunkName: "DataSourcePower" */ '@/views/asset/safety-new/power-manage/datasource'
  )
const FunctionalPower = _ =>
  import(
    /* webpackChunkName: "FunctionalPower" */ '@/views/asset/safety-new/power-manage/functional'
  )
const DataserverPowerNew = _ =>
  import(
    /* webpackChunkName: "DataserverPowerNew" */ '@/views/asset/safety-new/power-manage/dataserver'
  )
// ---------------- 权限审计 --------------
const AssetPermissions = _ =>
  import(
    /* webpackChunkName: "AssetPermissions" */ '@/views/asset/safety-new/power-manage/audit/asset-permissions'
  )
const PermissionsOperation = _ =>
  import(
    /* webpackChunkName: "PermissionsOperation" */ '@/views/asset/safety-new/power-manage/audit/permissions-operation'
  )
// --------------- 权限归属 ---------------
const FunSetting = _ =>
  import(
    /* webpackChunkName: "funSetting" */ '@/views/asset/safety-new/power-owner/fun-setting'
  )

export default [
  {
    path: '/asset/safety-new',
    name: 'safety-new',
    meta: {
      name: '权限',
      sideMenu: true
    },
    redirect: '/asset/safety-new/power-apply/table',
    component: Layout,
    children: [
      {
        path: '/asset/safety-new/power-apply',
        name: 'power-apply',
        meta: {
          name: '权限申请',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/safety-new/power-apply/table',
            name: 'table-apply',
            meta: {
              name: '表权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: TableApply
          },
          {
            path: '/asset/safety-new/power-apply/datasource',
            name: 'datasource-power',
            meta: {
              name: '数据源权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: DatasourcePower
          },
          {
            path: '/asset/safety-new/power-apply/function',
            name: 'function-power',
            meta: {
              name: '函数权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: FunctionPower
          },
          {
            path: '/asset/safety-new/power-apply/variable',
            name: 'variablePower',
            meta: {
              name: '变量权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: VariablePower1
          },
          {
            path: '/asset/safety-new/power-apply/key',
            name: 'keyPower',
            meta: {
              name: '密钥权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: KeyPower1
          },
          {
            path: '/asset/safety-new/power-apply/ability',
            name: 'ability-power',
            meta: {
              name: '功能权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: AbilityPower
          },
          {
            path: '/asset/safety-new/power-apply/dataserver',
            name: 'dataserver-power',
            meta: {
              name: '数据服务权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: DataserverPower
          }
        ]
      },
      {
        path: '/asset/safety-new/power-manage',
        name: 'power-manage',
        meta: {
          name: '权限管理',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/safety-new/power-manage/project',
            name: 'project-power',
            meta: {
              name: '项目权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: ProjectPower
          },
          {
            path: '/asset/safety-new/power-manage/table',
            name: 'table-power',
            meta: {
              name: '表权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: TablePower
          },
          {
            path: '/asset/safety-new/power-manage/dataSource',
            name: 'data-source-power',
            meta: {
              name: '数据源权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: DataSourcePowerNew
          },
          {
            path: '/asset/safety-new/power-manage/variable',
            name: 'variable-power',
            meta: {
              name: '变量权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: VariablePower2
          },
          {
            path: '/asset/safety-new/power-manage/key',
            name: 'key-power',
            meta: {
              name: '密钥权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: KeyPower2
          },
          {
            path: '/asset/safety-new/power-manage/key/detailsDialog',
            name: 'detailsDialog', 
            meta: {
             name: '密钥权限详情',
             hideInMenu: true,
             // icon: 'iconfont icon-zhilifangan'
            },
            component: detailsDialog,
          },
          {
            path: '/asset/safety-new/power-manage/functional',
            name: 'functional-power',
            meta: {
              name: '功能权限',
              icon: 'iconfont icon-zhilifangan'
            },
            component: FunctionalPower
          },
          {
            path: '/asset/safety-new/power-manage/dataserver',
            name: 'data-server-power',
            meta: {
              name: '数据服务权限',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: DataserverPowerNew
          }
        ]
      },
      {
        path: '/asset/safety-new/powermanage/audit',
        name: 'audit',
        meta: {
          name: '权限审计',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/safety-new/powermanage/audit/assetPermissions',
            name: 'assetPermissions',
            meta: {
              name: '资产权限审计',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: AssetPermissions
          },
          {
            path: '/asset/safety-new/powermanage/audit/permissionsOperation',
            name: 'permissionsOperation',
            meta: {
              name: '权限操作审计',
              icon: 'iconfont icon-shujuyuanquanxian'
            },
            component: PermissionsOperation
          }
        ]
      },
      {
        path: '/asset/safety-new/powerowner',
        name: 'power-owner',
        meta: {
          name: '权限归属',
          jump: false
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/safety/powerowner/belong/functionPowerSetting',
            name: safetyType.FUNCTIONPOWERSETTING,
            meta: {
              name: '功能权限配置',
              icon: 'iconfont icon-gongnengquanxianpeizhi'
            },
            component: FunSetting
          }
        ]
      }
    ]
  }
]

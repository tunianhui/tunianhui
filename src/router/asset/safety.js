import {safetyType} from '@/config/safety-config.js'
const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/asset/safety/index.js')

export default [
  {
    path: '/asset/safety',
    name: 'safety',
    meta: {
      name: '权限',
      href: '/asset/safety',
      sideMenu: true
    },
    component: Layout,
    children: [
      {
        path: '/asset/safety/powermanage',
        name: 'powermanage',
        meta: {
          name: '权限管理'
        },
        component: WrapperView,
        children: [
          {
            path: '/asset/safety/powermanage/myPower',
            name: 'myPower',
            meta: {
              name: '我的权限',
              jump: false,
              block: true
            },
            children: [
              {
                path: '/asset/safety/powermanage/myPower/dimensionPower',
                name: safetyType.DIMENSIONPOWER,
                meta: {
                  name: '逻辑表权限',
                  icon: 'iconfont icon-luojibiaoquanxian',
                  block: true
                }
              },
              {
                path: '/asset/safety/powermanage/myPower/physicePower',
                name: safetyType.PHYSICEPOWER,
                meta: {
                  name: '物理表权限',
                  icon: 'iconfont icon-wulibiaoquanxian',
                  block: true
                }
              },
              {
                path: '/asset/safety/powermanage/myPower/datasourcePower',
                name: safetyType.DATASOURCEPOWER,
                meta: {
                  name: '数据源权限',
                  icon: 'iconfont icon-shujuyuanquanxian',
                  block: true
                }
              },
              {
                path: '/asset/safety/powermanage/myPower/apiPower',
                name: safetyType.APIPOWER,
                meta: {
                  name: 'API权限',
                  icon: 'iconfont icon-APIquanxian',
                  block: true
                }
              },
              {
                path: '/asset/safety/powermanage/myPower/functionPower',
                name: safetyType.FUNCTIONPOWER,
                meta: {
                  name: '功能权限',
                  icon: 'iconfont icon-gongnengquanxian',
                  block: true
                }
              }
            ]
          },
          {
            path: '/asset/safety/powermanage/myManage',
            name: 'myManage',
            meta: {
              name: '我管理的',
              jump: false
            },
            children: [
              {
                path: '/asset/safety/powermanage/myManage/businessPower',
                name: safetyType.BUSINESSPOWER,
                meta: {
                  name: '业务板块权限',
                  icon: 'iconfont icon-yewubankuaiquanxianguanli'
                }
              },
              {
                path: '/asset/safety/powermanage/myManage/porjectPower',
                name: safetyType.PORJECTPOWER,
                meta: {
                  name: '项目权限',
                  icon: 'iconfont icon-xiangmuquanxianguanli'
                }
              },
              {
                path: '/asset/safety/powermanage/myManage/datasourceManage',
                name: safetyType.DATASOURCEMANAGE,
                meta: {
                  name: '数据源权限',
                  icon: 'iconfont icon-xiangmuquanxianguanli'
                }
              },
              {
                path: '/asset/safety/powermanage/myManage/functionPowerManage',
                name: safetyType.FUNCTIONPOWERMANAGE,
                meta: {
                  name: '功能权限',
                  icon: 'iconfont icon-gongnengquanxianguanli'
                }
              }
            ]
          },
          {
            path: '/asset/safety/powermanage/audit',
            name: 'audit',
            meta: {
              name: '权限审计',
              jump: false
            },
            children: [
              {
                path: '/asset/safety/powermanage/audit/assetPermissions',
                name: safetyType.ASSETPERMISSIONS,
                meta: {
                  name: '资产权限审计',
                  icon: 'iconfont icon-gongnengquanxianpeizhi'
                }
              },
              {
                path: '/asset/safety/powermanage/audit/permissionsOperation',
                name: safetyType.PERMISSIONSOPERATION,
                meta: {
                  name: '权限操作审计',
                  icon: 'iconfont icon-gongnengquanxianpeizhi'
                }
              }
            ]
          },
          {
            path: '/asset/safety/powermanage/belong',
            name: 'belong',
            meta: {
              name: '权限归属',
              jump: false
            },
            children: [
              {
                path: '/asset/safety/powermanage/belong/functionPowerSetting',
                name: safetyType.FUNCTIONPOWERSETTING,
                meta: {
                  name: '功能权限配置',
                  icon: 'iconfont icon-gongnengquanxianpeizhi'
                }
              }
            ]
          }
        ]
      }
    ]
  }
]

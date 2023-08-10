import ObjectTable from '@c/object-table'
import {safetyType} from '@/config/safety-config'
const tabs = [
  {
    label: '业务板块权限',
    name: safetyType.BUSINESSPOWER,
    component: 'BusinessPower',
    path: '/asset/safety/powermanage/myManage/businessPower'
  },
  {
    label: '项目权限',
    name: safetyType.PORJECTPOWER,
    component: 'ProjectPower',
    path: '/asset/safety/powermanage/myManage/porjectPower'
  },
  {
    label: '数据源权限',
    name: safetyType.DATASOURCEMANAGE,
    component: 'DataSourceManage',
    path: '/asset/safety/powermanage/myManage/datasourceManage'
  },
  {
    label: '功能权限',
    name: safetyType.FUNCTIONPOWERMANAGE,
    component: 'FunctionManage',
    path: '/asset/safety/powermanage/myManage/functionPowerManage'
  }
]
export default ObjectTable('myManage', tabs)

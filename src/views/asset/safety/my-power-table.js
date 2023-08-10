import ObjectTable from '@c/object-table'
import {safetyType} from '@/config/safety-config'
const tabs = [
  {
    label: '逻辑表权限',
    name: safetyType.DIMENSIONPOWER,
    component: 'LogicTable',
    path: '/asset/safety/powermanage/myPower/dimensionPower',
    flag: 'myPower'
  },
  {
    label: '物理表权限',
    name: safetyType.PHYSICEPOWER,
    component: 'PhysiceTable',
    path: '/asset/safety/powermanage/myPower/physicePower',
    flag: 'myPower'
  },
  {
    label: '数据源权限',
    name: safetyType.DATASOURCEPOWER,
    component: 'DataSource',
    path: '/asset/safety/powermanage/myPower/datasourcePower',
    flag: 'myPower'
  },
  {
    label: 'API权限',
    name: safetyType.APIPOWER,
    component: 'API',
    path: '/asset/safety/powermanage/myPower/apiPower',
    flag: 'myPower'
  },
  {
    label: '功能权限',
    name: safetyType.FUNCTIONPOWER,
    component: 'FunctionPower',
    path: '/asset/safety/powermanage/myPower/functionPower',
    flag: 'myPower'
  }
]
export default ObjectTable('myPower', tabs)

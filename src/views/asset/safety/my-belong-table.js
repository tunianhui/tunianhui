import ObjectTable from '@c/object-table'
import {safetyType} from '@/config/safety-config'
const tabs = [
  {
    label: '功能权限配置',
    name: safetyType.FUNCTIONPOWERSETTING,
    component: 'FunctionSetting',
    path: '/asset/safety/powermanage/belong/functionPowerSetting'
  }
]
export default ObjectTable('belong', tabs)

/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 14:32:59
 * @LastEditTime: 2022-08-26 14:39:48
 * @Description:
 */
import ObjectTable from '@c/object-table'
import {safetyType} from '@/config/safety-config'
const tabs = [
  {
    label: '资产权限审计',
    name: safetyType.ASSETPERMISSIONS,
    component: 'AssetPermissions',
    path: '/asset/safety/powermanage/audit/assetPermissions',
    flag: 'audit'
  },
  {
    label: '权限操作审计',
    name: safetyType.PERMISSIONSOPERATION,
    component: 'PermissionsOperation',
    path: '/asset/safety/powermanage/audit/permissionsOperation',
    flag: 'audit'
  }
]
export default ObjectTable('audit', tabs)

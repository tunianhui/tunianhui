/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:42
 * @LastEditTime: 2022-08-26 14:12:01
 * @Description:
 */
export const safetyType = {
  // 我的权限
  DIMENSIONPOWER: 'dimensionPower', // 逻辑表权限
  PHYSICEPOWER: 'physicePower', // 物理表权限
  DATASOURCEPOWER: 'datasourcePower', // 数据源权限
  APIPOWER: 'apiPower', // api权限
  FUNCTIONPOWER: 'functionPower', // 功能权限
  // 我管理的
  BUSINESSPOWER: 'businessPower', // 业务板块
  PORJECTPOWER: 'porjectPower', // 项目权限
  DATASOURCEMANAGE: 'datasourceManage', // 数据源权限
  FUNCTIONPOWERMANAGE: 'functionPowerManage', // 功能权限
  // 权限审计
  ASSETPERMISSIONS: 'assetPermissions', // 资产权限审计
  PERMISSIONSOPERATION: 'permissionsOperation', // 权限操作审计
  // 归属我的
  FUNCTIONPOWERSETTING: 'functionPowerSetting' // 功能权限设置
}

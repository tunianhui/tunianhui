/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-02-09 14:05:35
 * @Description:
 */
import ObjectTable from '@c/object-table'
import {
  types
} from '@/config/rd-config'

const tabs = [
  {
    label: '行为域&业务线',
    name: types.DOMAINBUS,
    component: 'DomainBusTable',
    path: '/tag/workbench/behavior-center/element/domain-bus'
  },
  {
    label: '动作',
    name: types.ACTION,
    component: 'ActionTable',
    path: '/tag/workbench/behavior-center/element/action'
  },
  {
    label: '对象',
    name: types.OBJECT,
    component: 'ObjectTable',
    path: '/tag/workbench/behavior-center/element/object'
  }, 
  {
    label: '对象属性',
    name: types.OBJECTATTR,
    component: 'ObjectAttrTable',
    path: '/tag/workbench/behavior-center/element/object-attr'
  }, 
  {
    label: '行为规则',
    name: types.REGULAR,
    component: 'RegularTable',
    path: '/tag/workbench/behavior-center/behavior/regular'
  }, 
  {
    label: '工厂标签',
    name: types.FACTORY,
    component: 'FactoryTable',
    path: '/tag/workbench/tag-center/factory'
  }, 
  {
    label: '标签类目',
    name: types.CATEGORY,
    component: 'CategoryTable',
    path: '/tag/workbench/tag-center/category'
  },
  {
    label: '实体ID',
    name: types.ENTITYID,
    component: 'EntityIdTable',
    path: '/tag/workbench/idsCenter/entity-id'
  },
  {
    label: 'ID映射表',
    name: types.MAPPINGTABLEID,
    component: 'MappingTableIdTable',
    path: '/tag/workbench/idsCenter/mapping-table-id'
  }
]

export default ObjectTable('exreact', tabs)

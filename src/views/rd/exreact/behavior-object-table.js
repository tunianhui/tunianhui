import ObjectTable from '@c/object-table'
import {
  types
} from '@/config/rd-config'

const tabs = [{
  label: '行为规则',
  name: types.REGULAR,
  component: 'RegularTable'
}, {
  label: '域&业务线',
  name: types.DOMAINBUS,
  component: 'DomainBusTable'
}, {
  label: '动作',
  name: types.ACTION,
  component: 'ActionTable'
}, {
  label: '对象',
  name: types.OBJECT,
  component: 'ObjectTable'
}, {
  label: '对象属性',
  name: types.OBJECTATTR,
  component: 'ObjectAttrTable'
}]
export default ObjectTable('behavior', tabs)

import ObjectTable from '@c/object-table'
import {types} from '@/config/rd-config'

const tabs = [
  {
    label: '维度',
    name: types.DIMENSION,
    component: 'DimensionObjectTable',
    path: '/rd/dev/norm-define/dimension'
  },
  {
    label: '业务过程',
    name: types.FACT,
    component: 'FactObjectTable',
    path: '/rd/dev/norm-define/fact'
  },
  {
    label: '业务限定',
    name: types.LIMIT,
    component: 'LimitObjectTable',
    path: '/rd/dev/norm-define/limit'
  },
  {
    label: '原子指标',
    name: types.ATOM,
    component: 'AtomObjectTable',
    path: '/rd/dev/norm-define/atom'
  },
  {
    label: '衍生指标',
    name: types.DERIVE,
    component: 'DeriveObjectTable',
    path: '/rd/dev/norm-define/derive'
  }
]

export default ObjectTable('dev', tabs)

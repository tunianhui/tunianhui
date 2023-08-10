import ObjectTable from '@c/object-table'
import {types} from '@/config/server-config'

// 服务 5个
const tabs = [
  {
    label: 'Api生成',
    name: types.APICREATE,
    component: 'ApiCreateTable',
    path: '/server/api-dev/dev'
  },
  {
    label: 'Api注册',
    name: types.REGISTER,
    component: 'ApiRegisterTable',
    path: '/server/api-dev/dev'
  },
  {
    label: '函数',
    name: types.FUNC,
    component: '',
    path: ''
  },
  {
    label: '服务编排',
    name: types.ARRANGE,
    component: '',
    path: ''
  },
  {
    label: '业务过程',
    name: types.FLOW,
    component: 'FactTable',
    path: '/rd/dev/norm-define/fact'
  }
]

export default ObjectTable('server', tabs)

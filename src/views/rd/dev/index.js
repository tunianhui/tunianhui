import Layout from '../layout'
import components from './components'
import {types} from '@/config/rd-config'

const editComponents = [
  {
    value: 'normDefine',
    label: '规范定义',
    children: [
      {
        value: types.DIMENSION, // 'dimension',
        label: '维度',
        type: 'tab',
        btnId: '研发-开发-规范建模-规范定义-维度-新建'
      },
      {
        value: types.FACT, // 'fact',
        label: '业务过程',
        type: 'dialog',
        btnId: '研发-开发-规范建模-规范定义-业务过程-新建'
      },
      {
        value: types.LIMIT, // 'limit',
        label: '业务限定',
        btnId: '研发-开发-规范建模-规范定义-业务限定-新建'
      },
      {
        value: types.ATOM, // 'atom',
        label: '原子指标',
        component: 'AtomEdit',
        btnId: '研发-开发-规范建模-规范定义-原子指标-新建'
      },
      {
        value: types.DERIVEATOM, // 'deriveAtom',
        label: '衍生原子指标',
        component: 'AtomEditDialog',
        type: 'dialog',
        btnId: '研发-开发-规范建模-规范定义-衍生原子指标-新建'
      },
      {
        value: types.DERIVE, // 'derive',
        label: '派生指标',
        btnId: '研发-开发-规范建模-规范定义-派生指标-新建'
      }
    ]
  },
  {
    value: 'logicTable',
    label: '逻辑表',
    children: [
      {
        value: types.DIMENSIONTABLE, // 'dimensionTable',
        label: '维度逻辑表',
        disabled: true,
        tip: '维度逻辑表基于维度自动创建',
        btnId: '研发-开发-规范建模-逻辑表-维度逻辑表-新建'
      },
      {
        value: types.FACTTABLE, // 'factTable',
        label: '事实逻辑表',
        component: 'FactTableCreate',
        type: 'dialog',
        btnId: '研发-开发-规范建模-逻辑表-事实逻辑表-新建'
      },
      {
        value: types.POLYMERTABLE, // 'polymerTable',
        component: 'PolymerTableCreate',
        type: 'dialog',
        label: '汇总逻辑表',
        btnId: '研发-开发-规范建模-逻辑表-汇总逻辑表-新建'
      }
    ]
  },
  {
    value: 'dataProcess',
    label: '数据处理',
    children: [
      {
        value: types.CODETASK, // 'codeTask',
        label: '代码任务',
        btnId: '研发-开发-规范建模-数据处理-代码任务-新建'
      },
      // {
      //   value: types.SYNCTASK, // 'syncTask',
      //   label: '同步任务',
      //   btnId: '研发-开发-规范建模-数据处理-同步任务-新建'
      // },
      {
        value: types.FUNCMANAGE, // 'funcManage',
        label: '函数管理',
        type: 'dialog',
        btnId: '研发-开发-规范建模-数据处理-同步任务-新建'
      },
      {
        value: types.SOURCEMANAGE, // 'sourceManage',
        label: '资源管理',
        type: 'dialog',
        btnId: '研发-开发-规范建模-数据处理-资源管理-新建'
      },
      {
        value: 'computingTask',
        label: '计算任务',
        btnId: '研发-开发-规范建模-数据处理-计算任务-新建'
      },
      {
        value: types.ADSEARCH, // 'adSearch',
        label: '即席查询',
        type: 'dialog',
        component: 'AdSearchNewFile',
        btnId: '研发-开发-规范建模-即席查询-新建'
      }
    ]
  }
]

export default Layout('dev', {
  editComponents,
  components
})

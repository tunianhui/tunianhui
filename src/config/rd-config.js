import styleVars from './style-vars'

export const types = {
  // 开发
  DIMENSION: 'dimension',
  FACT: 'fact',
  LIMIT: 'limit',
  ATOM: 'atom',
  DERIVE: 'derive',
  DIMENSIONTABLE: 'dimensionTable',
  FACTTABLE: 'factTable',
  POLYMERTABLE: 'polymerTable',
  PHYSICALTABLE: 'physicalTable',
  CODETASK: 'codeTask',
  CODETASKSQL: 'codeTaskSql',
  CODETASKSHELL: 'codeTaskShell',
  SYNCTASK: 'syncTask',
  FUNCMANAGE: 'funcManage',
  SOURCEMANAGE: 'sourceManage',
  OBJECTTABLE: 'objectTable',
  ADSEARCH: 'adSearch',
  // 萃取
  REGULAR: 'regular',
  DOMAIN: 'domain',
  BUS: 'bus',
  DOMAINBUS: 'domainBus',
  ACTION: 'action',
  OBJECT: 'object',
  OBJECTATTR: 'objectAttr',
  TAG: 'tag',
  MANUAL: 'manual',
  FACTORY: 'factory',
  TAGFRONT: 'tagFront',
  BEHAVIORBOARD: 'behaviorBoard',
  TAGBOARD: 'tagBoard',
  TAGLOGIC: 'tagLogic',
  CATEGORY: 'category',
  TAGSERVICE: 'tagService',
  TAGCONFIG: 'tagConfig',
  ENTITYID: 'entityId',
  MAPPINGTABLEID: 'mappingTableId',
  MAIN: 'main',
  // 数据集成
  COMPONENTLIBRARY: 'ComponentLibrary', // 组件库
  // 服务开发
  APICREATE: 'apiCreate',
  REGISTER: 'register',
  FUNC: 'func',
  ARRANGE: 'arrange',
  FLOW: 'flow',
  TABLEMANAGE: 'tableManage',
}

export const iconMap = {
  // 维度
  [types.DIMENSION]: {
    icon: 'iconfont icon-weidu1',
    color: ''
  },
  // 业务过程
  [types.FACT]: {
    icon: 'iconfont icon-tubiaoshangshengqushi',
    color: ''
  },
  // 业务限定
  [types.LIMIT]: {
    icon: 'iconfont icon-quanbu1',
    color: ''
  },
  // 原子指数
  [types.ATOM]: {
    icon: 'iconfont icon-yewuchangjing',
    color: ''
  },
  // 衍生指数
  [types.DERIVE]: {
    icon: 'iconfont icon-tubiao-zhexiantu',
    color: ''
  },
  // 维度逻辑表
  [types.DIMENSIONTABLE]: {
    icon: 'iconfont icon-weiduluojibiao1',
    color: styleVars.dimensionTable
  },
  // 事实逻辑表
  [types.FACTTABLE]: {
    icon: 'iconfont icon-shishiluojibiao2',
    color: styleVars.factTable
  },
  // 汇总逻辑表
  [types.POLYMERTABLE]: {
    icon: 'iconfont icon-huizongluojibiao2',
    color: styleVars.polymerTable
  },
  // 物理表
  [types.PHYSICALTABLE]: {
    icon: 'iconfont  icon-code-wulibiao',
    color: ''
  },
  // 代码任务
  [types.CODETASK]: {
    icon: 'iconfont icon-code',
    color: ''
  },
  [types.CODETASKSQL]: {
    icon: 'iconfont icon-MxSQL',
    color: ''
  },
  [types.CODETASKSHELL]: {
    icon: 'iconfont icon-Shell',
    color: ''
  },
  // 同步任务
  [types.SYNCTASK]: {
    icon: 'iconfont icon-tongbu',
    color: ''
  },
  // 函数管理
  [types.FUNCMANAGE]: {
    icon: 'iconfont icon-hanshu1',
    color: ''
  },
  // 资源管理
  [types.SOURCEMANAGE]: {
    icon: 'iconfont icon-ziyuan3',
    color: ''
  },
  // 即席查询
  [types.ADSEARCH]: {
    icon: 'iconfont icon-MxSQL'
  },
  // 对象列表页
  [types.OBJECTTABLE]: {
    icon: 'iconfont icon-liebiao',
    color: ''
  },
  [types.ENTITYID]: {
    icon: 'iconfont icon-liebiao',
    color: ''
  },
  [types.MAPPINGTABLEID]: {
    icon: 'iconfont icon-hangweiguize1',
    color: ''
  },
  // 行为规则
  [types.REGULAR]: {
    icon: 'iconfont icon-hangweiguize1',
    color: ''
  },
  // 行为规则
  [types.CENTRE]: {
    icon: 'iconfont icon-sanwei',
    color: ''
  },
  // 行为域&业务线
  [types.DOMAINBUS]: {
    icon: 'iconfont icon-yuyewuxianxiaoicon',
    color: ''
  },
  // 动作
  [types.ACTION]: {
    icon: 'iconfont icon-dongzuoku',
    color: ''
  },
  // 对象
  [types.OBJECT]: {
    icon: 'iconfont icon-duixiangxiaoicon',
    color: ''
  },
  // 对象属性
  [types.OBJECTATTR]: {
    icon: 'iconfont icon-duixiangshuxingxiaoicon',
    color: ''
  },
  // 标签工厂
  [types.FACTORY]: {
    icon: 'iconfont icon-biaoqian',
    color: ''
  },
  // 标签逻辑表
  [types.TAGLOGIC]: {
    icon: 'iconfont icon-biaoqian1',
    color: styleVars.tagColor
  },
  // 标签类目
  [types.CATEGORY]: {
    icon: 'iconfont icon-biaoqianleimu',
    color: ''
  },
  // 标签服务
  [types.TAGSERVICE]: {
    icon: 'iconfont icon-luojibiao1',
    color: ''
  },
  // 行为看板
  [types.BEHAVIORBOARD]: {
    icon: 'iconfont icon-hangweikanban1',
    color: ''
  },
  [types.TAGCONFIG]: {
    icon: 'iconfont icon-guize'
  },
  // 组件库
  [types.COMPONENTLIBRARY]: {
    icon: 'iconfont icon-fuwubianpai1'
  },
  [types.MAIN]: {
    icon: 'iconfont icon-zhutiicon',
    color: ''
  },
  [types.TABLEMANAGE]: {
    icon: 'iconfont icon-yuanbiao-xianxing',
    color: ''
  }
}

export const logicTypeMapIcon = {
  // 维度逻辑表
  10: 'iconfont icon-weiduluojibiao1',
  16: 'iconfont icon-weiduluojibiao1',
  // 事实逻辑表
  17: 'iconfont icon-shishiluojibiao2',
  // 汇总逻辑表
  18: 'iconfont icon-huizongluojibiao2',
  // 物理表
  100: 'iconfont icon-code-wulibiao',
  11: 'iconfont icon-weiduluojibiao1',
  19: 'iconfont icon-weiduluojibiao1',
  20: 'iconfont icon-weiduluojibiao1',
  21: 'iconfont icon-weiduluojibiao1',
  22: 'iconfont icon-weiduluojibiao1',
  23: 'iconfont icon-weiduluojibiao1',
  24: 'iconfont icon-weiduluojibiao1',
  25: 'iconfont icon-weiduluojibiao1',
  26: 'iconfont icon-weiduluojibiao1',
  50: 'iconfont icon-weiduluojibiao1',
  42: 'iconfont icon-shougongbiaoqian',
  51: 'iconfont icon-elasticsearch-copy-copy'
}

export const iconMapColor = {
  // 维度逻辑表
  10: 'iconfont icon-weiduluojibiao1 active2',
  16: 'iconfont icon-weiduluojibiao1 active2',
  // 事实逻辑表
  17: 'iconfont icon-shishiluojibiao2 active1',
  // 汇总逻辑表
  18: 'iconfont icon-huizongluojibiao2 active3',
  // 物理表
  100: 'iconfont icon-code-wulibiao active4',
  11: 'iconfont icon-weiduluojibiao1 active4',
  19: 'iconfont icon-weiduluojibiao1 active4',
  20: 'iconfont icon-weiduluojibiao1 active4',
  21: 'iconfont icon-weiduluojibiao1 active4',
  22: 'iconfont icon-weiduluojibiao1 active4',
  23: 'iconfont icon-weiduluojibiao1 active4',
  24: 'iconfont icon-weiduluojibiao1 active4',
  25: 'iconfont icon-weiduluojibiao1 active4',
  26: 'iconfont icon-weiduluojibiao1 active4',
  50: 'iconfont icon-weiduluojibiao1 active4',
  42: 'iconfont icon-shougongbiaoqian active4',
  51: 'iconfont icon-elasticsearch-copy-copy active4'
}

// 页面获取树的数据的type
export const treeTypes = {
  // 维度
  [types.DIMENSION]: 10,
  // 事实
  [types.FACT]: 11,
  // 原子指标
  [types.ATOM]: 12,
  // 业务限定
  [types.LIMIT]: 13,
  // 业务过程
  [types.FACT]: 14,
  // 派生指标
  [types.DERIVE]: 15,
  // 维度逻辑表
  [types.DIMENSIONTABLE]: 16,
  // 事实逻辑表
  [types.FACTTABLE]: 17,
  // 汇总逻辑表
  [types.POLYMERTABLE]: 18,
  // 物理表
  [types.PHYSICALTABLE]: 100,
  [types.REGULAR]: 30,
  // [types.DOMAIN]: 31,
  // [types.BUS]: 32,
  [types.DOMAINBUS]: 31,
  [types.ACTION]: 32,
  [types.OBJECT]: 33,
  [types.TAG]: 34,
  [types.ADSEARCH]: 1
}

export const logicPkTypes = {
  group_name: '主键',
  group_type: 'primarykey'
}
export const logicSystemTypes = {
  group_type: 'system',
  group_name: '系统'
}

export const dimLogicRelationTypes = [
  {name: '关联维度', value: '10', type: 'relation'},
  {name: '属性', value: '1', type: 'attr'}
]

export const factLogicRelationTypes = [
  {name: '关联维度', value: '3', type: 'relation'},
  {name: '事实属性', value: '1', type: 'attr'},
  {name: '度量', value: '2', type: 'measure'}
]

export const factLogicRelationTypesMap = reverseListToMap(
  factLogicRelationTypes
)

export const dimLogicRelationTypesMap = reverseListToMap(dimLogicRelationTypes)

// 是否累加
export const cumulTags = {0: '是', 1: '否'}

function reverseListToMap(data) {
  return data.reduce((prev, cur) => {
    prev[cur.value] = {
      group_name: cur.name,
      group_type: cur.type
    }
    return prev
  }, {})
}

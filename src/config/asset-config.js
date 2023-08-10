// import styleVars from './style-vars'

export const types = {
  // 标准
  CRITERION: 'criterion',
  CATEGORY: 'category',
  DICT: 'dict',
  REGULAR: 'regular',
  METADATA: 'metadata',
  OBJECTTABLE: 'objectTable'
}

export const iconMap = {
  // 标准定义
  [types.CRITERION]: {
    icon: 'iconfont icon-yuyewuxianxiaoicon',
    color: ''
  },
  // 类目定义
  [types.CATEGORY]: {
    icon: 'iconfont icon-dongzuoku',
    color: ''
  },
  // 字典定义
  [types.DICT]: {
    icon: 'iconfont icon-zidian',
    color: ''
  },
  // 规则映射
  [types.REGULAR]: {
    icon: 'iconfont icon-duixiangshuxingxiaoicon',
    color: ''
  },
  // 元数据映射
  [types.METADATA]: {
    icon: 'iconfont icon-duixiangxiaoicon',
    color: ''
  }
}

export const logicTypeMapIcon = {
  // 维度逻辑表
  16: 'iconfont icon-weiduluojibiao1',
  // 事实逻辑表
  17: 'iconfont icon-shishiluojibiao2',
  // 汇总逻辑表
  18: 'iconfont icon-huizongluojibiao2',
  // 物理表
  100: 'iconfont icon-code-wulibiao'
}

export const iconMapColor = {
  // 维度逻辑表
  16: 'iconfont icon-weiduluojibiao1 active2',
  // 事实逻辑表
  17: 'iconfont icon-shishiluojibiao2 active1',
  // 汇总逻辑表
  18: 'iconfont icon-huizongluojibiao2 active3',
  // 物理表
  100: 'iconfont icon-code-wulibiao active4'
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
  [types.CRITERION]: 31,
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

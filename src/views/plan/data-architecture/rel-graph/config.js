/*
 * @Author: 大炸鹅
 * @Date: 2023-05-29 10:34:19
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-12 11:03:42
 * @FilePath: \dataphin\src\views\plan\data-architecture\rel-graph\config.js
 */
export const nodeTypes = {
  shujubankuai: '-1', // 数据板块
  zhutiyu: '0', // 主题域
  putongduixiang: '1', // 普通对象
  cengjiduixiang: '4', // 层级对象
  meijuduixiang: '2', // 枚举对象
  xuniduixiang: '3', // 虚拟对象
  yewushijian: '5', // 业务事件
  yewukuaizhao: '6', // 业务快照
  yewuliucheng: '7' // 业务流程
}

export const nodeTypeText = {
  [nodeTypes.shujubankuai]: '数据板块',
  [nodeTypes.zhutiyu]: '主题域',
  [nodeTypes.putongduixiang]: '普通对象',
  [nodeTypes.cengjiduixiang]: '层级对象',
  [nodeTypes.meijuduixiang]: '枚举对象',
  [nodeTypes.xuniduixiang]: '虚拟对象',
  [nodeTypes.yewushijian]: '业务事件',
  [nodeTypes.yewukuaizhao]: '业务快照',
  [nodeTypes.yewuliucheng]: '业务流程'
}

export const nodeColors = {
  [nodeTypes.shujubankuai]: '#1a7dff',
  [nodeTypes.zhutiyu]: '#ff751a',
  [nodeTypes.putongduixiang]: '#16cad6',
  [nodeTypes.cengjiduixiang]: '#16cad6',
  [nodeTypes.meijuduixiang]: '#16cad6',
  [nodeTypes.xuniduixiang]: '#16cad6',
  [nodeTypes.yewushijian]: '#7067f5',
  [nodeTypes.yewukuaizhao]: '#7067f5',
  [nodeTypes.yewuliucheng]: '#7067f5',
}

export const nodeIcons = {
  [nodeTypes.shujubankuai]: 'iconfont icon-bankuaitubiao',
  [nodeTypes.zhutiyu]: 'iconfont icon-zhutiyutubiao',
  [nodeTypes.putongduixiang]: 'iconfont icon-putongduixiang',
  [nodeTypes.cengjiduixiang]: 'iconfont icon-cengjiduixiang',
  [nodeTypes.meijuduixiang]: 'iconfont icon-meijuduixiang',
  [nodeTypes.xuniduixiang]: 'iconfont icon-XuNiHua',
  [nodeTypes.yewushijian]: 'iconfont icon-shijianzhongxin-shijianshengchengguanli',
  [nodeTypes.yewukuaizhao]: 'iconfont icon-a-yewukuaizhao1',
  [nodeTypes.yewuliucheng]: 'iconfont icon-yewukuaizhao',
}

export const edgeAttrs = {
  line: {
    stroke: '#A2B1C3',
    strokeWidth: 2,
    targetMarker: {
      name: 'block',
      width: 12,
      height: 8,
    },
    strokeDasharray: 0, // 0 表示实线
    style: {
      animation: 'act-line 30s infinite linear',
      'z-index': 1,
      'pointer-events': 'none',
    }
  }
}

export const entityRelTyps = {
  jichengguanxi: '1', // 继承关系
  guanlianguanxi: '2', // 关联关系
  qianxuhouxu: '3', // 前序后序
  baohanguanxi: '4', // 包含关系
  liuzhuanguanxi: '5', // 流转关系
  cengjiguanxi: '6', // 层级关系
}

export const entityRelTypsText = {
  [entityRelTyps.jichengguanxi]: '继承关系',
  [entityRelTyps.guanlianguanxi]: '关联关系',
  [entityRelTyps.qianxuhouxu]: '前序后序',
  [entityRelTyps.baohanguanxi]: '包含关系',
  [entityRelTyps.liuzhuanguanxi]: '流转关系',
  [entityRelTyps.cengjiguanxi]: '层级关系',
}

export const entityRelTypsColor = {
  [entityRelTyps.jichengguanxi]: 'rgba(191,191,191,1)',
  [entityRelTyps.guanlianguanxi]: 'rgba(191,191,191,1)',
  [entityRelTyps.qianxuhouxu]: 'rgba(191,191,191,1)',
  [entityRelTyps.baohanguanxi]: 'rgba(191,191,191,1)',
  [entityRelTyps.liuzhuanguanxi]: 'rgba(191,191,191,1)',
  [entityRelTyps.cengjiguanxi]: 'rgba(191,191,191,1)',
}

export const entityRelTypsIcon = {
  [entityRelTyps.jichengguanxi]: 'iconfont icon-jichengguanxi',
  [entityRelTyps.guanlianguanxi]: 'iconfont icon-guanlianguanxi',
  [entityRelTyps.qianxuhouxu]: 'iconfont icon-a-qianxuhouxuguanxi',
  [entityRelTyps.baohanguanxi]: 'iconfont icon-baohanguanxi',
  [entityRelTyps.liuzhuanguanxi]: 'iconfont icon-liuzhuanguanxi',
  [entityRelTyps.cengjiguanxi]: 'iconfont icon-a-5cengjiguanxi',
}
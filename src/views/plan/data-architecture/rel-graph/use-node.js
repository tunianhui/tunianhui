/*
 * @Author: 大炸鹅
 * @Date: 2023-05-29 15:27:57
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-31 11:38:35
 * @FilePath: \数据智能构建\src\views\plan\data-architecture\rel-graph\use-node.js
 */
import { Graph } from "@antv/x6"
import '@antv/x6-vue-shape'
import customrect from './nodes/node.vue'
import entityrelnode from './nodes/entity-rel-node.vue'
export function registerShape() {
  Graph.registerVueComponent(
    'my-custom',
    {
      width: 168,
      height: 44,
      template: `<customrect />`,
      components: {
        customrect,
      }
    },
    true
  )
}

export function registerShapeEntity() {
  Graph.registerVueComponent(
    'my-entityrelnode',
    {
      width: 168,
      height: 44,
      template: `<entityrelnode />`,
      components: {
        entityrelnode,
      }
    },
    true
  )
}
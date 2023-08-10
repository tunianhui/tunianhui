/*
 * @Author: 大炸鹅
 * @Date: 2023-05-29 15:27:57
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-08 14:37:25
 * @FilePath: \dataphin\src\views\rd\operation-new\component\flow\use-node.js
 */
import { Graph } from "@antv/x6"
import '@antv/x6-vue-shape'
import FlowNode from './nodes/index.vue'
import {nodeWidth, nodeHeight} from './config'
export function registerShape() {
  Graph.registerVueComponent(
    'my-custom',
    {
      width: nodeWidth,
      height: nodeHeight,
      template: `<FlowNode />`,
      components: {
        FlowNode,
      }
    },
    true
  )
}
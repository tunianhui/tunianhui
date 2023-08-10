/*
 * @Author: 大炸鹅
 * @Date: 2023-05-29 14:24:56
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-13 15:22:24
 * @FilePath: \dataphin\src\views\plan\data-architecture\rel-graph\graph.js
 */
import { Graph, Shape } from '@antv/x6'
import {registerShape} from "./use-node.js"
import { nodeColors, nodeIcons, edgeAttrs } from './config'
import { DagreLayout } from '@antv/layout'
const baseNodeAttrs = {
  width: 168,
  height: 40,
  shape: 'vue-shape',
  component: 'my-custom',
}
export default {
  data() {
    return {
      currentEntityRelData: null,
    }
  },
  async mounted() {
    registerShape()
    const data = await this.getGraphData()
    this.initGraph(data)
  },
  methods: {
    // 初始化画布
    initGraph(data) {
      this.graph = new Graph({
        container: this.$refs.graphContainer,
        width: this.$refs.graphContainer.clientWidth,
        height: this.$refs.graphContainer.clientHeight,
        grid: false,
        panning: true,
        mousewheel: true,
        interacting: false,
        connecting: {
          anchor: 'orth',
          connector: 'rounded',
          connectionPoint: 'boundary',
          router: {
            name: 'er',
            args: {
              offset: 0,
              direction: 'H',
            },
          },
        }
      })
      this.graph.fromJSON({
        nodes: data.nodes,
        edges: data.edges,
      })
      this.initEvent(this.graph)
      this.formatHand()
      this.graph.centerContent()
    },
    initEvent(graph) {
      graph.on('node:click', ({ node }) => {
        const nodesAll = this.graph.getNodes()
        this.setActiveNode(node, nodesAll)
      })
      graph.on('custom-node:click', (data) => {
        this.drawer = true
        this.currentEntityRelData = data
      })
      // 点击画布空白处取消选中
      graph.on('blank:click', () => {
        this.setActiveNode(null)
      })
    },
    // 设置节点选中状态的样式
    setActiveNode(activeNode, nodesAll) {
      if (!nodesAll) {
        nodesAll = this.graph.getNodes()
      }
      nodesAll.forEach(node => {
        node.updateData({selected: false})
      })
      if (activeNode) {
        activeNode.updateData({selected: true})
      }
    },
    // 创建节点和边
    flattenNestedArray(nodes, edges, arr, parentId = null) {
      for (let item of arr) {
        const { id, parent_id, children, ...rest } = item;
        const data = {
          id,
          ...baseNodeAttrs,
          data: {
            nodeBaseData: {
              nodeType: rest.type,
              nodeName: rest.name,
              nodeDesc: rest.code,
              nodeIcon: nodeIcons[rest.type],
              nodeColor: nodeColors[rest.type],
            },
            selected: false,
            ...rest,
            isLefa: children && children.length > 0 ? false : true,
            isCollapsed: children && children.length > 0 ? false : true,
            isHide: false,
            id
          },
          children: children && children.length > 0 ? children : null,
        }
        // 创建节点
        const node = data
        nodes.push(node)
        
        // 创建边
        if (parentId !== null) {
          const edge = { source: parentId, target: id }
          edges.push({...edge, attrs: {...edgeAttrs}})
        }
        
        // 递归处理子节点
        if (Array.isArray(children)) {
          this.flattenNestedArray(nodes, edges, children, id)
        }
      }
    },
    // 布局
    formatHand() {
      const nodes = this.graph.getNodes()
      const esges = this.graph.getEdges()
      const nodesIds = [], edgesIds = []
      nodes.forEach(item => {
        nodesIds.push({
          id: item.id
        })
        item.setZIndex(99)
      })
      esges.forEach(item => {
        edgesIds.push({
          source: item.source.cell,
          target: item.target.cell
        })
      })
      const dagreLayout = new DagreLayout ({
        type: 'dagre',
        rankdir: 'LR',
        align: undefined,
        nodesep: 10,
        ranksep: 70
      })
      const newModel = dagreLayout.layout({nodes: nodesIds, edges: edgesIds})
      nodes.forEach(item => {
        const position = newModel.nodes.find(d => d.id === item.id)
        if (position) {
          item.position(position.x, position.y)
        }
      })
    },
  }
}
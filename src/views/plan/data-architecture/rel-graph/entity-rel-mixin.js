/*
 * @Author: 大炸鹅
 * @Date: 2023-05-31 10:57:39
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:09:14
 * @FilePath: \数据智能构建\src\views\plan\data-architecture\rel-graph\entity-rel-mixin.js
 */

import { Graph, Util } from '@antv/x6'
import { nodeColors, nodeIcons, edgeAttrs as newedgeAttrs, nodeTypes, entityRelTyps } from './config'
import { registerShapeEntity } from './use-node.js'
import { GridLayout, ForceLayout, RadialLayout } from '@antv/layout'
const baseNodeAttrs = {
  width: 168,
  height: 44,
  shape: 'vue-shape',
  component: 'my-entityrelnode',
}
export default {
  data() {
    return {
      graph: null,
      graphData: null,
    }
  },
  watch: {
    'currentData.id': {
      handler(val) {
        if (val) {
          this.$nextTick(async () => {
            registerShapeEntity()
            await this._queryEntityRelDiagram()
            this.initGraph()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化画布
    initGraph(layout) {
      const width = this.$refs.entityGraph.clientWidth
      const height = this.$refs.entityGraph.clientHeight
      this.graph = new Graph({
        container: this.$refs.entityGraph,
        width,
        height,
        grid: false,
        panning: true,
        mousewheel: true,
        interacting: false,
        connecting: {
          // anchor: 'orth',
          // connector: 'rounded',
          // connectionPoint: 'boundary',
          // router: {
          //   name: 'er',
          // },
        }
      })
      const nodes = this.createNode(this.graphData.nodes)
      const edges = this.createEdge(this.graphData.edges)
      this.formatLayout(this.graph, nodes, edges, [width / 2, height / 2])
      this.initEvent(this.graph)
    },
    // 创建节点
    createNode(nodes) {
      // 创建节点
      const n = []
      for (const node of nodes) {
        const { entity_id, ...rest } = node
        const types = [nodeTypes.putongduixiang, nodeTypes.cengjiduixiang, nodeTypes.meijuduixiang, nodeTypes.xuniduixiang]
        const nodeAttrs = {
          ...baseNodeAttrs,
          id: entity_id,
          data: {
            nodeBaseData: {
              nodeType: rest.type,
              nodeName: rest.entity_name,
              nodeDesc: rest.entity_code,
              nodeIcon: nodeIcons[rest.type],
              nodeColor: nodeColors[rest.type],
            },
            ...rest,
            entity_id,
            currentID: this.currentData.id,
            selected: entity_id === this.currentData.id,
          },
          sortBy: entity_id === this.currentData.id ? 0 : types.includes(rest.type) ? 1 : 2,
        }
        n.push(nodeAttrs)
      }
      return n
    },
    // 创建边
    createEdge(edges) {
      // 创建边
      const e = []
      for (const edge of edges) {
        const { source, target, ...rest } = edge
        const baseLineAttr = {
          stroke: '#A2B1C3',
          strokeWidth: 1,
        }
        let lineAttr = {}
        if (entityRelTyps.cengjiguanxi === rest.row_type) {
          // 层级关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'path',
              d: 'M 10 -5 0 0 10 5',
              offsetX: -5,
              fill: 'none',
            },
          }
        } else if (entityRelTyps.guanlianguanxi === rest.row_type) {
          // 关联关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'path',
              d: Util.normalizeMarker('M 11.8005 5.7787 V 0.056 h -1.2718 v 5.1874 L 1.5592 0.7579 L 0.9907 1.8962 l 7.7677 3.8827 H 0.9907 V 7.0505 h 7.7626 L 0.9907 10.9318 l 0.5684 1.1383 l 8.9695 -4.4842 v 5.1874 h 1.2717 V 7.0505 z'),
              offsetX: -5,
              fill: '#A2B1C3'
            },
            sourceMarker: {
              name: 'path',
              d: 'M 0 0 L 0 12',
              fill: '#A2B1C3',
              offsetX: -8,
              strokeWidth: 2,
            }
          }
        } else if (entityRelTyps.baohanguanxi === rest.row_type) {
          // 包含关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'path',
              d: 'M 10 -5 0 0 10 5',
              offsetX: -5,
              fill: 'none',
            },
            strokeDasharray: 4,
          }
        } else if (entityRelTyps.jichengguanxi === rest.row_type) {
          // 继承关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'circle',
              r: 5,
              cx: 5,
              fill: '#fff',
              stroke: '#A2B1C3',
            }
          }
        } else if (entityRelTyps.qianxuhouxu === rest.row_type) {
          // 前序后序关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'path',
              d: 'M 10 -5 0 0 10 5Z',
              fill: '#fff',
              stroke: '#A2B1C3',
              offsetX: -5,
            }
          }
        } else if (entityRelTyps.liuzhuanguanxi === rest.row_type) {
          // 流转关系
          lineAttr = {
            ...baseLineAttr,
            targetMarker: {
              name: 'path',
              d: 'M 10 -5 0 0 10 5Z',
              fill: '#A2B1C3',
              stroke: '#A2B1C3',
              offsetX: -5,
            }
          }
        }
        const edgeAttrs = {
          source,
          target,
          data: {
            ...rest,
          },
          connector: { name: 'rounded' },
          attrs: {
            line: {
              ...lineAttr,
            }
          }
        }
        e.push(edgeAttrs)
      }
      return e
    },
    // 格式化布局
    formatLayout(graph, nodes, edges, center) {
      // const gridLayout  = new GridLayout({
      //   type: 'grid',
      //   center,
      //   width: center[0] * 2,
      //   height: center[1] * 2,
      //   preventOverlap: true,
      //   nodeSize: [168, 44],
      //   sortBy: 'sortBy',
      // })
      const gridLayout = new RadialLayout({
        type: 'radial',
        // center: [369, 180],
        preventOverlap: true,
        linkDistance: 200,
        unitRadius: 200,
        width: center[0] * 2,
        height: center[1] * 2,
      })
      const newModel = gridLayout.layout({ nodes, edges })
      console.log(newModel)
      graph.fromJSON(newModel)
      graph.getNodes().forEach(node => {
        node.setZIndex(10)
      })
    },
    initEvent(graph) {
      graph.on('node:click', ({ node }) => {
        const nodesAll = this.graph.getNodes()
        this.setActiveNode(node, nodesAll)
        // 获取当前点击节点相关联的边
        const edges = this.graph.getConnectedEdges(node)
        // 将获取的边高亮及箭头高亮
        edges.forEach(edge => {
          const data = edge.getData()
          const { row_type } = data
          this.setEdgeActive(row_type, 1, edge)
          edge.setZIndex(9)
        })
        // 将其他边置灰
        const otherEdges = this.graph.getEdges().filter(edge => !edges.includes(edge))
        otherEdges.forEach(edge => {
          const data = edge.getData()
          const { row_type } = data
          this.setEdgeActive(row_type, 0, edge)
        })
      })
      // 点击画布空白处清除高亮
      graph.on('blank:click', () => {
        const nodesAll = this.graph.getNodes()
        this.setActiveNode(null, nodesAll)
        const edges = this.graph.getEdges()
        edges.forEach(edge => {
          const data = edge.getData()
          const { row_type } = data
          this.setEdgeActive(row_type, 0, edge)
        })
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
    // 设置边高亮
    setEdgeActive(row_type, type, edge) {
      if (type === 1) {
        if (entityRelTyps.cengjiguanxi === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', 'none')
        } else if (entityRelTyps.guanlianguanxi === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', '#1a7dff')
          edge.attr('line/sourceMarker/fill', '#1a7dff')
        } else if (entityRelTyps.baohanguanxi === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', 'none')
        } else if (entityRelTyps.jichengguanxi === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', '#fff')
          edge.attr('line/targetMarker/stroke', '#1a7dff')
        } else if (entityRelTyps.qianxuhouxu === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', '#fff')
          edge.attr('line/targetMarker/stroke', '#1a7dff')
        } else if (entityRelTyps.liuzhuanguanxi === row_type) {
          edge.attr('line/stroke', '#1a7dff')
          edge.attr('line/targetMarker/fill', '#1a7dff')
        }
      } else {
        if (entityRelTyps.cengjiguanxi === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', 'none')
        } else if (entityRelTyps.guanlianguanxi === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', '#A2B1C3')
          edge.attr('line/sourceMarker/fill', '#A2B1C3')
        } else if (entityRelTyps.baohanguanxi === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', 'none')
        } else if (entityRelTyps.jichengguanxi === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', '#fff')
          edge.attr('line/targetMarker/stroke', '#A2B1C3')
        } else if (entityRelTyps.qianxuhouxu === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', '#fff')
          edge.attr('line/targetMarker/stroke', '#A2B1C3')
        } else if (entityRelTyps.liuzhuanguanxi === row_type) {
          edge.attr('line/stroke', '#A2B1C3')
          edge.attr('line/targetMarker/fill', '#A2B1C3')
        }
      }
    }
  }
}
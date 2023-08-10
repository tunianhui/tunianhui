/*
 * @Author: 大炸鹅
 * @Date: 2023-06-08 11:35:34
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:12:02
 * @FilePath: \智能数据构建\src\views\rd\operation-new\component\flow\flow.js
 */
import { Graph } from '@antv/x6'
import { registerShape } from './use-node'
import { icons, nodeWidth, nodeHeight, isRound, pageTypeMenu, nodeStatusColors } from './config'
import { DagreLayout } from '@antv/layout'


export default {
  props: {
    data: Object,
    loading: Boolean,
    pageType: String,
    mainId: [String, Number],
  },
  data() {
    return {
      graph: null,
      zoom: 0,
      currentNode: null,
    }
  },
  watch: {
    data: {
      handler(val) {
        this.graph && this.graph.dispose()
        this.graph = null
        this.currentNode = null
        if (val && JSON.stringify(val) !== '{}' && !this.graph) {
          this.graph && this.graph.dispose()
          this.$nextTick(_ => {
            registerShape()
            this.initGraph()
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
  },
  methods: {
    initGraph() {
      this.graph = new Graph({
        container: this.$refs.flow,
        width: this.$refs.flow.clientWidth,
        height: this.$refs.flow.clientHeight,
        grid: false,
        panning: true,
        interacting: false,
        background: '#F9F9F9',
        mousewheel: {
          enabled: true, // 是否开启滚轮缩放
          // modifiers: ['ctrl'], // 缩放修饰键
          minScale: 0.5, // 最小缩放等级
          maxScale: 2, // 最大缩放等级
          zoomAtMousePosition: true // 是否将鼠标位置作为缩放中心
        },
        connecting: {
          anchor: 'orth',
          connector: 'rounded',
          connectionPoint: 'boundary',
          router: {
            name: 'er'
          },
        }
      })
      this.zoom = this.graph.zoom() * 100
      const nodes = this.createNode(this.data.nodes, 'name')
      const edges = this.createEdge(this.data.edges)
      this.formatLayout(nodes, edges)
      this.initEvent(this.graph)
    },
    createNode(nodes, labelKey) {
    // 创建节点
      const result = [] 
      for (const node of nodes) {
        const { id, ...rest } = node
        const nodeAttrs = {
          shape: 'vue-shape',
          component: 'my-custom',
          width: nodeWidth,
          height: nodeHeight,
          id,
          data: {
            nodeBaseData: {
              nodeType: rest.type,
              nodeName: rest[labelKey],
              nodeIcon: icons[rest.type],
              nodeColor: nodeStatusColors[rest.state + ''] ? nodeStatusColors[rest.state + ''] : nodeStatusColors['default'],
            },
            id,
            ...rest,
            selected: false,
            isRound: isRound[rest.type],
            isMain: id === this.mainId ? true : false,
            menusList: pageTypeMenu[this.pageType]
          }
        }
        result.push(nodeAttrs)
      }
      return result
    },
    createEdge(edges) {
      const result = []
      for(const edge of edges) {
        const {source, target} = edge
        result.push({
          source,
          target,
          attrs: {
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
                'pointer-events': 'none',
              }
            }
          }
        })
      }
      return result
    },
    formatLayout(nodes = [], edges = []) {
      const dagreLayout = new DagreLayout ({
        type: 'dagre',
        rankdir: 'TB',
        align: undefined,
        nodesep: 115,
        ranksep: 36
      })
      const newModel = dagreLayout.layout({nodes, edges})
      this.graph.fromJSON(newModel)
      this.graph.centerContent()
    },
    initEvent(graph) {
      graph.on('resize', ({ width, height }) => {
        graph.centerContent()
      })
      graph.on('node:click', ({ node }) => {
        const {id} = node
        this.currentNode = node.getData()
        this.setCurrentHighlight(id)
        this.setEdgeHighlight(id)
      })
      graph.on('blank:click', ({ e, x, y }) => {
        this.setCurrentHighlight(null)
        this.setEdgeHighlight(null)
        this.currentNode = null
      })
      graph.on('custom:command', data => {
        const { command } = data.currentMenu
        // this.$emit('command', data)
        this[command](data.data)
      })
      // 画布缩放
      graph.on('scale', ({ sx, sy, ox, oy }) => {
        this.zoom = parseInt(graph.zoom() * 100)
      })
    },
    // 设置节点高亮
    setCurrentHighlight(id) {
      const allNodes = this.graph.getNodes()
      allNodes.forEach(node => {
        node.updateData({selected: false})
      })
      const activeNode = allNodes.find(d => d.id + '' === id + '')
      if (activeNode) {
        activeNode.updateData({selected: true})
      }
    },
    // 设置节点边高亮
    setEdgeHighlight(id) {
      const nodes = this.graph.getNodes()
      const esges = this.graph.getEdges()
      esges.forEach(edge => {
        edge.attr('line/stroke', '#A2B1C3')
        // edge.setZIndex(-10)
      })
      const currentNode = nodes.find(d => d.id + '' === id + '')
      if (currentNode) {
        const edges = this.graph.getConnectedEdges(currentNode)
        edges.forEach(edge => {
          edge.attr('line/stroke',nodeStatusColors['default'])
          edge.setZIndex(1)
        })
      }
    },
    // 查看运行日志
    showRunLog(data) {
      const route = this.$router.resolve({
        path: '/rd/operation-new/operation-new-log', 
        query: {
          id: data.taskInstanceId
        }
      })
      window.open(route.href,'_blank')
    }
  }
}

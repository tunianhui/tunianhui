<template>
  <section class="g6-flow">
    <div class="bg-text">生产数据运维，请谨慎操作</div>
    <div class="flow-container" ref="flow">
      <div class="flow-node-info" v-show="visibleNodeInfo">
        <div class="flow-node-info-item">
          <span class="label">节点ID：</span>
          <span class="value">
            {{ nodeInfo.id }}
            <span
              class="tag"
              v-if="!!nodeInfo.id"
              v-clipboard="{value: nodeInfo.id}"
            >复制</span>
          </span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">节点：</span>
          <span class="value">
            <i class="iconfont icon-MxSQL font-16"></i>
            {{ nodeInfo.name }}
            <span
              class="tag"
              v-if="!!nodeInfo.name"
              v-clipboard="{value: nodeInfo.name}"
            >复制</span>
          </span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">优先级：</span>
          <span class="value">{{ nodeInfo.priority }}</span>
        </div>
        <div class="flow-node-info-item" v-if="nodeInfo.status">
          <span class="label">节点状态：</span>
          <span class="value">
            <i :class="`font-16 ${nodeInfo.statusIcon}`"></i>
            {{ nodeInfo.statusLabel }}
          </span>
        </div>
        <div class="flow-node-info-item split-line">
          <span class="label">
            <span class="hr"></span>
          </span>
          <span class="value">
            <span class="hr"></span>
          </span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">所在项目：</span>
          <span class="value">{{ nodeInfo.projectName }}</span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">负责人：</span>
          <span class="value">{{ nodeInfo.person }}</span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">运行时间：</span>
          <span class="value">{{ nodeInfo.excuteTime }}</span>
        </div>
        <div class="flow-node-info-item">
          <span class="label">运行时长：</span>
          <span class="value">{{ nodeInfo.duration }}</span>
        </div>
        <div class="flow-node-info-item" v-if="nodeInfo.desc">
          <span class="label">节点描述：</span>
          <span class="value">{{ nodeInfo.desc }}</span>
        </div>
      </div>
      <div class="flow-minimap" ref="minimap" v-if="minimap"></div>
    </div>
    <div class="flow-top-tool">
      <div class="flow-top-tool-item layer-select">
        <span class="label">展开层数：</span>
        <el-select v-model="layers">
          <el-option v-for="num in 6" :key="num" :label="num" :value="num"></el-option>
        </el-select>
      </div>
      <div class="flow-top-tool-item">
        <el-autocomplete
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="请搜索节点ID或名称"
          :fetch-suggestions="filterSuggestionList"
          :trigger-on-focus="false"
          @select="selectNodeById"
        >
          <template slot-scope="{item}">
            <span class="text-ellipsis">{{ item.label }}</span>
          </template>
        </el-autocomplete>
      </div>
      <div class="flow-top-tool-item">
        <el-button type="primary" plain icon="el-icon-refresh" @click="refresh"></el-button>
      </div>
    </div>
    <div class="flow-bottom-tool">
      <div class="flow-bottom-tool-left">
        <div class="zoom-input">
          <el-input v-model.number="zoom" @blur="setZoom" @keyup.enter.native.stop="setZoom"></el-input>&nbsp;%
        </div>
        <el-tooltip content="放大">
          <div class="el-icon-zoom-in" @click="zoomIn"></div>
        </el-tooltip>
        <el-tooltip content="缩小">
          <div class="el-icon-zoom-out" @click="zoomOut"></div>
        </el-tooltip>
        <el-tooltip content="适应画布">
          <div class="iconfont icon-shiyinghuabu" @click="fitView"></div>
        </el-tooltip>
      </div>
      <div class="task-name">{{}}</div>
      <div></div>
    </div>
    <div class="flow-tooltip" ref="tooltip" v-show="visibleTooltip">{{ tooltipContent }}</div>
    <Contextmenu
      ref="contextmenu"
      :menus="contextmenu"
      :data="nodeInfo"
      :node="activeNode"
      :width="contextmenuWidth"
      fixed-boundary
      @command="contextmenuHandle"
    ></Contextmenu>
  </section>
</template>

<script>
import {
  mainNodeData,
  initUpstream,
  initDownstream,
  upstream,
  downstream
} from './data'
import G6 from '@antv/g6'
import Minimap from '@antv/g6/build/minimap'
import {registerNodeConfig, Node} from './node'
import {registerEdgeConfig} from './edge'
import setPopperPos from '@/libs/popper-pos'
import {nodeMenu, parentCommand, childCommand} from './contextmenu'
import Contextmenu from '@c/contextmenu'

export default {
  name: 'G6Flow',
  props: {
    minimap: {
      type: Boolean,
      default: true
    },
    fitview: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Contextmenu
  },
  data() {
    return {
      contextmenuWidth: 142,
      contextmenu: nodeMenu,
      contextmenuPos: [0, 0],
      layers: 1,
      keyword: '',
      // suggestionList: [],
      zoom: 100,
      zoomGap: 10,
      visibleNodeInfo: false,
      nodeInfo: {},
      activeNode: null,
      tooltipContent: '',
      visibleTooltip: false,
      graphData: {nodes: [], edges: []}
    }
  },
  computed: {
    suggestionList() {
      return this.graphData.nodes.map(node => ({
        value: node.id,
        label: node.name
      }))
    }
  },
  created() {},
  mounted() {
    this.initGraph()
  },
  methods: {
    refresh() {},
    filterSuggestionList(val, cb) {
      let results = this.suggestionList
      if (val) {
        results = this.suggestionList.filter(
          item => item.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      }
      // this.keyword
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    initGraph() {
      const container = this.$refs.flow,
        width = container.clientWidth,
        height = container.clientHeight
      this.fitViewPadding = height * 0.2
      G6.registerNode('custom-node', registerNodeConfig, 'single-shape')
      G6.registerEdge('custom-edge', registerEdgeConfig)

      this.graphBBox = container.getBoundingClientRect()

      this.graph = new G6.Graph({
        container,
        width,
        height,
        fitView: this.fitview,
        fitViewPadding: this.fitViewPadding,
        groupByTypes: false,
        defaultNode: {
          shape: 'custom-node'
        },
        defaultEdge: {
          shape: 'custom-edge'
          // shape: 'polyline',
          // style: {
          //   radius: 20,
          //   offset: 45,
          //   endArrow: true,
          //   lineWidth: 2,
          //   stroke: '#C2C8D5',
          //   d: 8
          // }
        },
        layout: {
          type: 'dagre',
          // LR
          rankdir: 'TB',
          nodesep: 135,
          ranksep: 30,
          controlPoints: true,
          startPoint: {
            x: 100,
            y: 100
          }
        },
        // renderer: 'svg',
        // maxZoom: 3,
        // minZoom: 0.2,
        // autoPaint: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'click-select']
        }
      })

      if (this.minimap) {
        const minimap = new Minimap({
          container: this.$refs.minimap,
          size: [200, 200]
        })
        this.graph.addPlugin(minimap)
      }

      this.bindEvent()

      this.getGraphData()
    },
    async getGraphData() {
      this.loading++
      // const mainNodeRes = await this.$simpleAsyncTo(getData(), '获取数据失败'),
      //   upDataRes = await this.$simpleAsyncTo(getData(), '获取数据失败'),
      //   downDataRes = await this.$simpleAsyncTo(getData(), '获取数据失败'),
      const mainNodeRes = mainNodeData,
        upDataRes = initUpstream,
        downDataRes = initDownstream
      await this.$sleep(1000)
      const mainNode = new Node({...mainNodeRes.data, isMain: true}),
        upNodes = (upDataRes || {}).data || [],
        downNodes = (downDataRes || {}).data || []
      const upData = this.processData(mainNode, upNodes),
        downData = this.processData(mainNode, downNodes, true)
      // upData1 = this.processData(mainNode, upstream.data),
      // downData1 = this.processData(mainNode, downstream.data, true)
      this.graphData = {
        nodes: [
          mainNode,
          ...upData.nodes,
          ...downData.nodes
          // ...upData1.nodes,
          // ...downData1.nodes
        ],
        edges: [
          ...upData.edges,
          ...downData.edges
          // ...upData1.edges,
          // ...downData1.edges
        ]
      }

      this.graph.data(this.graphData)
      this.graph.render()

      this.selectNodeById(mainNode.id)

      this.zoom = this.getZoom()
      this.renderEdges()

      this.loading--
    },
    processData(node, data, isSource) {
      const nodes = [],
        edges = []
      data.forEach(d => {
        const n = new Node(d),
          edge = isSource
            ? {source: node.id, target: n.id}
            : {source: n.id, target: node.id}
        nodes.push(n)
        edges.push(edge)
      })
      return {nodes, edges}
    },
    renderEdges() {
      const edges = this.graph.getEdges()
      edges.forEach(edge => {
        // console.log(edge)
      })
    },
    bindEvent() {
      this.graph.on('wheelzoom', ev => {
        this.$refs.contextmenu.hide()
        this.zoom = this.getZoom()
      })

      // 设置选中节点
      this.graph.on('node:click', ev => {
        this.selectNode(ev.item)
        if (ev.target._cfg.className === 'more') {
          this.showContextmenu(ev)
        }
      })

      // 取消选中节点
      this.graph.on('canvas:click', ev => {
        this.unselectNode(ev)
      })

      this.graph.on('node:mousemove', ev => {
        this.triggerTooltip(ev)
      })

      this.graph.on('node:contextmenu', ev => {
        this.showContextmenu(ev)
        this.selectNode(ev.item)
      })
    },
    selectNodeById(id) {
      const node = this.graph.findById(id)
      this.selectNode(node)
    },
    selectNode(node) {
      this.clearStates()
      this.activeNode = node
      this.graph.setItemState(node, 'selected', true)
      this.nodeInfo = node.getModel()
      this.visibleNodeInfo = true
      const edges = node.getEdges()
      edges.forEach(edge => {
        this.graph.setItemState(edge, 'selected', true)
        edge.toFront()
        edge.getSource().toFront()
        edge.getTarget().toFront()
      })
      this.graph.paint()
    },
    unselectNode() {
      this.clearStates()
      this.visibleNodeInfo = false
      this.nodeInfo = {}
      this.activeNode = null
    },
    clearStates() {
      const nodes = this.graph.getNodes(),
        edges = this.graph.getEdges()
      nodes.forEach(node => {
        this.graph.clearItemStates(node)
      })
      edges.forEach(edge => {
        this.graph.clearItemStates(edge)
      })
    },
    showContextmenu(ev) {
      // 不能阻止事件冒泡dom的点击事件仍会触发
      ev.stopPropagation()
      const {width, height, x: left, y: top} = ev.item.getBBox(),
        group = this.graph.get('group'),
        matrix = group.getMatrix(),
        canvasTranslateX = matrix[6],
        canvasTranslateY = matrix[7],
        {x: graphLeft, y: graphTop} = this.graphBBox

      let scale = this.zoom / 100,
        x = left * scale + graphLeft + canvasTranslateX,
        y = top * scale + graphTop + canvasTranslateY
      this.$refs.contextmenu.show(ev.event, {
        x,
        y,
        width: Math.ceil(width * scale + 1),
        height: Math.ceil(height * scale),
        left: x,
        top: y
      })
    },
    contextmenuHandle({command, node, data}) {
      if (parentCommand.includes(command)) {
        this.expandParent(command.slice(1), node, data)
      } else if (childCommand.includes(command)) {
        this.expandChild(command.slice(1), node, data)
      } else {
        // console.log(command, node, data)
        // this[command](node, data)
      }
    },
    expandParent(level, node, data) {
      // console.log(level, node, this.graph.getNodes(), upstream)
      // const nodes = this.graph.getNodes()
      const ns = [],
        es = []
      const {nodes, edges} = this.processData(data, upstream.data)
      const {nodes: initialNodes, edges: initialEdges} = this.graphData
      // console.log(nodes, edges, initialNodes, initialEdges, this.graphData)
      nodes.forEach(node => {
        const n = initialNodes.find(n => n.id === node.id)
        !n && ns.push(node)
      })
      edges.forEach(edge => {
        const e = initialEdges.find(
          e => e.target === edge.target && e.source === edge.source
        )
        !e && es.push(edge)
      })

      // console.log(nodes, edges, initialNodes, initialEdges, ns, es, data)
      this.graphData = {
        nodes: [...initialNodes, ...ns],
        edges: [...initialEdges, ...es]
      }
      this.graph.changeData(this.graphData)
      this.graph.refresh()
      this.selectNode(node)
      this.fitView()
    },
    expandChild(level, node, data) {
      const ns = [],
        es = []
      const {nodes, edges} = this.processData(data, downstream.data, true)
      const {nodes: initialNodes, edges: initialEdges} = this.graphData
      nodes.forEach(node => {
        const n = initialNodes.find(n => n.id === node.id)
        !n && ns.push(node)
      })
      edges.forEach(edge => {
        const e = initialEdges.find(
          e => e.target === edge.target && e.source === edge.source
        )
        !e && es.push(edge)
      })
      this.graphData = {
        nodes: [...initialNodes, ...ns],
        edges: [...initialEdges, ...es]
      }
      this.graph.changeData(this.graphData)
      this.graph.refresh()
      this.selectNode(node)
      this.fitView()
    },
    triggerTooltip(ev) {
      const tooltip = this.$refs.tooltip,
        {clientX: offsetX, clientY: offsetY, item, target} = ev,
        model = item.getModel(),
        cfg = target._cfg

      if (cfg.className === 'label' && cfg.attrs.text !== model.name) {
        this.visibleTooltip = true
        this.tooltipContent = model.name
        setPopperPos({offsetX, offsetY}, tooltip, {placement: 'top'})
      } else {
        this.visibleTooltip = false
      }
    },
    getZoom() {
      return parseInt(this.graph.getZoom() * 100)
    },
    setZoom() {
      this.graph.zoomTo(this.zoom / 100)
    },
    zoomIn() {
      this.zoom += this.zoomGap
      this.setZoom()
    },
    zoomOut() {
      this.zoom -= this.zoomGap
      this.setZoom()
    },
    fitView() {
      this.graph.fitView(this.fitViewPadding)
      this.zoom = this.getZoom()
    }
  }
}
</script>

<style lang="scss">
$baseColor: #ebeaef;
$bottomHeight: 30px;
.g6-flow {
  height: 100%;
  background: $baseColor;
  position: relative;
  user-select: none;

  .bg-text {
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 60px;
    transform: translateX(-50%);
    color: $grey5;
  }

  .flow-top-tool {
    position: absolute;
    top: 25px;
    right: 10px;
    display: flex;

    &-item {
      margin-right: 10px;
      font-size: 12px;
      background-color: $grey10;

      .label {
        margin-right: 5px;
      }

      &.layer-select {
        padding: 0 10px;
        line-height: 28px;
        .el-select {
          width: 60px;

          .el-input__inner {
            background-color: $baseColor;
            height: 20px;
          }
        }
      }
      .el-input__inner {
        border: none;
        border-radius: 0;
      }
    }
  }

  .flow-container {
    height: calc(100% - #{$bottomHeight});
    position: relative;
    cursor: grab;

    &:active,
    &:focus {
      cursor: grabbing;
    }

    .flow-node-info {
      position: absolute;
      left: 20px;
      bottom: 20px;
      padding: 20px;
      z-index: 10;
      display: table;
      border: 1px solid rgba($grey1, 0.1);
      background: $grey10;
      font-size: 12px;
      cursor: default;

      &-item {
        display: table-row;
        line-height: 20px;
        word-break: break-all;
        .label {
          display: table-cell;
          text-align: right;
          padding-right: 10px;
        }
        .value {
          display: table-cell;
          width: 200px;

          .iconfont {
            color: lighten($--color-primary, 15%);
          }
        }
        .hr {
          display: block;
          border: 1px solid #f0f0f0;
          margin: 4px 0;
        }
        &.split-line {
          .label {
            padding: 0;
          }
        }

        .tag {
          margin-left: 5px;
          padding: 1px 2px;
          background-color: $grey1;
          color: $grey8;
          cursor: pointer;
          border-radius: 3px;
        }
      }
    }
  }

  .flow-bottom-tool {
    display: flex;
    height: $bottomHeight;
    padding: 0 20px;
    align-items: center;
    font-size: 12px;
    background: #e1e0e4;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;
    }

    .zoom-input {
      margin-right: 15px;
      .el-input {
        width: 50px;
      }
      .el-input__inner {
        height: 20px;
        border: none;
        border-radius: 0;
        background-color: #fff;
      }
    }

    [class*='el-icon'],
    .iconfont {
      font-size: 16px;
      color: $grey4;
      margin-left: 12px;
      cursor: pointer;
    }

    .task-name {
      margin-left: 20px;
      color: $grey4;
    }
  }

  .flow-tooltip {
    position: fixed;
    z-index: 1000;
    padding: 10px 15px;
    border-radius: 6px;
    background-color: $headerBg;
    color: $grey8;
    /* transition: $transition; */
  }

  .g6-tooltip {
    background-color: $headerBg;
    padding: 10px 15px;
    color: $grey8;
    border-radius: 6px;
  }
  .flow-minimap {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #fff;
    z-index: 11;
  }
}
</style>

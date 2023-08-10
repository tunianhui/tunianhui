<template>
  <section class="g6-flow">
    <div class="bg-text" v-if="visibleBgText">生产数据运维，请谨慎操作</div>
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
        <div class="flow-node-info-item" v-if="type === 'instance'">
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
          <span class="value">{{ nodeInfo.project_name }}</span>
        </div>
        <template v-if="type === 'task'">
          <div class="flow-node-info-item">
            <span class="label">负责人：</span>
            <span class="value">{{ nodeInfo.oper_user }}</span>
          </div>
          <div class="flow-node-info-item">
            <span class="label">更新时间：</span>
            <span class="value">{{ nodeInfo.updateTime || '--'}}</span>
          </div>
        </template>
        <template v-if="type === 'instance'">
          <div class="flow-node-info-item">
            <span class="label">运行时间：</span>
            <span class="value">{{ nodeInfo.excuteTime }}</span>
          </div>
          <div class="flow-node-info-item">
            <span class="label">运行时长：</span>
            <span class="value">{{ nodeInfo.duration }}</span>
          </div>
        </template>
        <div class="flow-node-info-item" v-if="nodeInfo.desc">
          <span class="label">节点描述：</span>
          <span class="value">{{ nodeInfo.desc }}</span>
        </div>
      </div>
      <div class="flow-minimap" ref="minimap" v-if="minimap"></div>
    </div>

    <!-- <div class="flow-switch">
      逻辑表：
    </div>-->

    <div class="flow-top-tool">
      <!-- <div class="flow-top-tool-item layer-select">
        <span class="label">展开层数：</span>
        <el-select v-model="layers">
          <el-option v-for="num in 6" :key="num" :label="num" :value="num"></el-option>
        </el-select>
      </div>-->
      <div class="flow-top-tool-item">
        <el-autocomplete
          v-model="keyword"
          prefix-icon="el-icon-search"
          :placeholder="config[type].keywordPlaceholder"
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
      <div class="task-name" v-if="type === ''">{{}}</div>
      <div></div>
    </div>
    <div class="flow-tooltip" ref="tooltip" v-show="visibleTooltip">{{ tooltipContent }}</div>
    <Contextmenu
      ref="contextmenu"
      :menus="contextmenu"
      :data="nodeInfo"
      :node="curNode"
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
  initDownstream
  // upstream,
  // downstream
} from './data'
import G6 from '@antv/g6'
import Minimap from '@antv/g6/build/minimap'
import {
  registerNodeConfig,
  Node,
  width as nodeWidth,
  height as nodeHeight
} from './node'
import {registerEdgeConfig} from './edge'
import setPopperPos from '@/libs/popper-pos'
import {on, off} from '@/libs/dom'
import {parentCommand, childCommand, recover, pause} from '@/config/ops-config'
import Contextmenu from '@c/contextmenu'
import config from './config'
import businessMixin from './business.mixin'

export default {
  name: 'G6Flow',
  props: {
    minimap: {
      type: Boolean,
      default: false
    },
    fitview: {
      type: Boolean,
      default: false
    }
  },
  mixins: [businessMixin],
  components: {
    Contextmenu
  },
  data() {
    return {
      config,
      type: 'task', // instance
      visibleBgText: true,
      contextmenuWidth: 142,
      contextmenu: [],
      contextmenuPos: [0, 0],
      layers: 1,
      keyword: '',
      // suggestionList: [],
      zoom: 100,
      zoomGap: 10,
      visibleNodeInfo: false,
      nodeInfo: {},
      curNode: null,
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
    on(window, 'resize', this.changeGraphSize)
  },
  beforeDestroy() {
    off(window, 'resize', this.changeGraphSize)
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
          controlPoints: false
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

      this.fetchGraphData()
      // this.getGraphData()
    },
    changeGraphSize() {
      const container = this.$refs.flow,
        width = container.clientWidth,
        height = container.clientHeight
      this.graph.changeSize(width, height)
      this.renderGraph()
    },
    renderGraph() {
      this.graph.changeData(this.graphData)
      this.graph.refresh()
      this.centerGraph()
    },
    centerGraph() {
      const x = {min: 0, max: 0},
        y = {min: 0, max: 0},
        container = this.$refs.flow,
        containerWidth = container.clientWidth,
        containerHeight = container.clientHeight,
        initialTranslate = 70
      this.graph.getNodes().forEach(item => {
        const model = item.getModel()
        x.min = Math.min(model.x, x.min)
        x.max = Math.max(model.x, x.max)
        y.min = Math.min(model.y, y.min)
        y.max = Math.max(model.y, y.max)
      })
      const width = nodeWidth * this.graph.getZoom() + x.max - x.min
      const height = nodeHeight * this.graph.getZoom() + y.max - y.min
      this.graph.moveTo(
        (containerWidth - width - initialTranslate) / 2,
        (containerHeight - height) / 2 - initialTranslate * 1.5
      )
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
      const mainNode = new Node({
          ...mainNodeRes.data,
          isMain: true
        }),
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

      this.renderGraph()
      this.selectNodeById(mainNode.id)
      this.loading--
    },
    // processData(node, data, isSource) {
    //   const nodes = [],
    //     edges = []
    //   data.forEach(d => {
    //     const n = new Node(d),
    //       edge = isSource
    //         ? {source: node.id, target: n.id}
    //         : {source: n.id, target: node.id}
    //     nodes.push(n)
    //     edges.push(edge)
    //   })
    //   return {nodes, edges}
    // },
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
        this.selectNode(ev.item)
        this.showContextmenu(ev)
      })
    },
    selectNodeById(id) {
      const node = this.graph.findById(id)
      this.selectNode(node)
    },
    selectNode(node) {
      this.clearStates()
      this.curNode = node
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
      this.curNode = null
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

      let scale = this.graph.getZoom(),
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
        if (!this[command]) {
          throw new Error(`不存在 ${command} 方法`)
        }
        this[command](node, data)
      }
    },
    pause(node, data) {
      this.$confirm(
        '此操作只暂停当前周期，下一周期仍会正常调度，是否继续暂停节点?',
        '暂停',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async _ => {
          const success = await this.handlePause(node, data)
          if (success) {
            data.recoverd
              ? this.contextmenu.splice(this.contextmenu.length - 1, 1, recover)
              : this.contextmenu.splice(this.contextmenu.length - 1, 1, pause)
            // this.$set(data.contextmenu, data.contextmenu.length - 1, recover)
          }
        })
        .catch(_ => {})
    },
    recover(node, data) {
      this.$confirm('是否要恢复此节点?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          const success = this.handleRecover(node, data)
          if (success) {
            data.recoverd
              ? this.contextmenu.splice(this.contextmenu.length - 1, 1, pause)
              : this.contextmenu.splice(this.contextmenu.length - 1, 1, recover)
          }
        })
        .catch(_ => {})
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
      const container = this.$refs.flow,
        width = container.clientWidth,
        height = container.clientHeight
      this.graph.zoomTo(this.zoom / 100, {x: width / 2, y: height / 2})
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

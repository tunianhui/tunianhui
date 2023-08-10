<template>
  <section :class="['table-flow er-graph', {'is-fullscreen': isFullScreen}]">
    <div class="table-flow-body"
         ref="container">
      <svg ref="svg">
        <def>
          <g :id="relImgId">
            <circle :cx="imageSize / 2"
                    :cy="imageSize / 2"
                    :r="imageSize / 2 + 2"
                    :stroke="readonly ? '#d8d8d8' : '#699bed'"
                    fill="#fff" />
            <!-- <image
              :id="relImgId"
              xlink:href="@/assets/images/bangding.png"
              :width="imageSize"
              :height="imageSize"
            />-->
            <image :id="relImgId"
                   v-if="readonly"
                   xlink:href="@/assets/images/relation_disabled.png"
                   :width="imageSize"
                   :height="imageSize" />
            <image :id="relImgId"
                   v-else
                   xlink:href="@/assets/images/relation.png"
                   :width="imageSize"
                   :height="imageSize" />
            <title>编辑关联维度</title>
          </g>
        </def>
        <g ref="edges" />
        <g ref="symbols"
           class="symbols" />
      </svg>
      <div class="table-flow-nodes"
           ref="nodes">
        <!-- :fullscreen="isFullScreen" -->
        <!-- :readonly="readonly" -->
        <Panel v-for="node in nodes"
               :key="node.id"
               :data="node"
               :readonly="readonly"
               @create="type => $emit('create', type)"
               @editField="data => $emit('editField', data)"
               @remove="data => $emit('remove', data)"
               @viewField="viewField"
               @collapse="collapseItem(node)"
               @showTableInfo="$emit('showTableInfo')"
               @expand="expand"
               @showCubeRelMode="$emit('showCubeRelMode')"
               :style="{top: `${node.top}px`, left: `${node.left}px`}"
               v-show="node.expand || node.isPrimarykey"
               :isShowCubeMode="isShowCubeMode"
               :flag="flag"></Panel>
      </div>
    </div>
    <el-row class="table-flow-foot"
            v-if="visibleFoot">
      <el-col :span="6"
              class="tool">
        <el-link :underline="false"
                 title="放大"
                 icon="el-icon-zoom-in"
                 @click="zoomIn"></el-link>
        <el-link :underline="false"
                 title="缩小"
                 icon="el-icon-zoom-out"
                 @click="zoomOut"></el-link>
        <el-link :underline="false"
                 :title="isFullScreen ? '退出全屏' : '全屏'"
                 :icon="
            `iconfont ${
              isFullScreen ? 'icon-exit-full-screen' : 'icon-full-screen'
            }`
          "
                 @click="fullscreenHandle"></el-link>
        <el-link :underline="false"
                 :title="collapse ? '全部收起' : '全部展开'"
                 :icon="
            collapse
              ? 'iconfont icon-shousuoshangjiantou'
              : 'iconfont icon-shousuoxiajiantou'
          "
                 @click="collapseHandle"></el-link>
        <el-link :underline="false"
                 title="恢复初始位置"
                 class="el-icon-location-outline"
                 @click="zoomIdentity"></el-link>
        <el-link :underline="false">{{ zoomText }}</el-link>
      </el-col>
      <el-col :span="6"
              class="text-center">
        <el-link :underline="false"
                 @click="showDimAttr">
          <i :class="headerData.icon"
             :style="{color: headerData.color}"></i>
          {{ headerData.code }}({{ headerData.name }})
        </el-link>
      </el-col>
      <el-col :span="6"
              style="color: #999;">
        测试成功：
        <strong class="num">0</strong>条 测试失败：
        <strong class="num">0</strong>条
      </el-col>
      <el-col :span="6">
        <el-link :underline="false"
                 disabled
                 @click="showOnline">
          查看线上版本
          <i class="el-icon-d-arrow-right"></i>
        </el-link>
      </el-col>
    </el-row>
    <el-dialog custom-class="see-field-dialog"
               title="查看字段"
               :visible.sync="visibleViewField"
               @close="visibleViewField = false"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               ref="editFieldDialog"
               v-draggable="{
        trigger: '.see-field-dialog .el-dialog__header',
        body: '.see-field-dialog.el-dialog',
        recover: false
      }">
      <el-row class="field-edit-row"
              :gutter="10">
        <el-col :span="6">
          <FilterList :data="viewFieldList"
                      :value.sync="activeFieldValue"
                      @change="changeActiveField"></FilterList>
        </el-col>
        <el-col :span="18">
          <FieldInfo :data="activeField"></FieldInfo>
          <!-- <FieldForm ref="fieldForm" v-if="!visibleFieldEditor" :data="activeEditField"></FieldForm> -->
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary"
                   plain
                   @click="visibleViewField = false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Panel from './panel'
import FieldInfo from './field-info'
import FilterList from '@c/filter-list'
import { bezierCurveTo } from '@/libs/visual/tool/path'
import cloneDeep from 'lodash/cloneDeep'
import { on, off, requestFullscreen, exitFullscreen } from '@/libs/dom'
import ZoomLayout from '../zoom-layout'

// panel的宽度
const pw = 376,
  // 单个属性的高度
  ih = 36,
  // 头部的高度
  hh = 60,
  // 底部的高度
  fh = 20,
  // 主表文字的高度
  ph = 24,
  // 每个面板的间距
  gapx = 50,
  gapy = 20

export default {
  name: 'TableFlow',
  props: {
    data: Array,
    headerData: Object,
    readonly: Boolean,
    visibleFoot: Boolean,
    flag: String,
    isShowCubeMode: Boolean
  },
  components: {
    Panel,
    FieldInfo,
    FilterList
  },
  data () {
    // const min = 0.3,
    //   max = 3
    return {
      relImgId: 'image' + Date.now(),
      imageSize: 12,
      // zoom: 1,
      // minZoom: min,
      // maxZoom: max,
      minTop: 20,
      nodes: [],
      visibleViewField: false,
      viewFieldList: [],
      isFullScreen: false,
      activeField: {},
      activeFieldValue: '',
      zoomText: '100%',
      zoomLayout: { zoom: '' }
    }
  },
  computed: {
    collapse () {
      return this.nodes.every(n => n.collapse)
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val && val.length) {
          this.$nextTick(_ => {
            // 不是初始化操作的页面只需考虑relationData的增删改即可,如果relationData没有改变，
            this.processData()
          })
        }
      }
    },
    zoomLayout: {
      deep: true,
      handler (val) {
        this.zoomText = `${(((val || {}).zoom || 1) * 100).toFixed(0)}%`
      }
    }
  },
  mounted () {
    const symbols = this.$refs.symbols
    this.edges = this.$d3.select(this.$refs.edges)
    this.symbols = this.$d3.select(symbols)

    this.zoomLayout = new ZoomLayout(this.$refs.container, [
      this.$refs.nodes,
      this.$refs.edges,
      this.$refs.symbols
    ])
    on(symbols, 'click', this.symbolClick)
  },
  beforeDestroy () {
    off(this.$refs.symbols, 'click', this.symbolClick)
  },
  methods: {
    processData () {
      const obj = {}
      let total = 0,
        uncollapseTotal = 0
      this.nodes = []

      this.data.forEach(item => {
        if (item.head) {
          const d = cloneDeep(item.children || []),
            len = d.length
          total += len
          if (['primarykey', 'relation'].includes(item.group_type)) {
            uncollapseTotal += len
          }
          if (item.group_type === 'relation') {
            obj.relationData = d.map((item, i) => {
              item.expand = true
              item.dir = i % 2 === 0 ? 'left' : 'right'
              return item
            })
          } else {
            obj[`${item.group_type}Data`] = d
          }
        }
      })
      const centerNode = {
        isPrimarykey: true,
        ...this.headerData,
        ...obj,
        total,
        uncollapseTotal,
        collapse: true
      }
      if (this.flag && this.flag === 'fact') {
        centerNode.code = centerNode.primarykeyData[0].table || ' '
        centerNode.name = ``
        centerNode.primarykeyData = []
      }
      this.nodes.push(centerNode)
      obj.relationData
        ? this.processRelationNode(obj.relationData)
        : this.clearSvg()
      this.adaptiveLayout()
    },
    processRelationNode (data) {
      data.forEach((item, index) => {
        const obj = item.relationDatas,
          total = Object.entries(obj).reduce(
            (prev, cur) => prev + cur[1].length,
            0
          ),
          uncollapseTotal = obj.primarykeyData.length + obj.relationData.length,
          panelData = {
            id: item.rel_dim_id,
            // 关联线的id
            source: item.element_id,
            dim_type: item.rel_dim_type,
            code: item.rel_dim_table,
            name: item.rel_dim_name,
            collapse: true,
            expand: item.expand,
            dir: item.dir,
            total,
            uncollapseTotal,
            ...obj
          }

        this.nodes.push(panelData)
      })
      // this.adaptiveLayout()
    },
    getTotal (node) {
      return node.collapse ? node.total : node.uncollapseTotal
    },
    adaptiveLayout () {
      let lastLeftPanel = null,
        lastRightPanel = null,
        leftCount = 0,
        rightCount = 0,
        leftHeight = 0,
        rightHeight = 0

      const container = this.$refs.container,
        w = container.clientWidth,
        h = container.clientHeight,
        nodes = [...this.nodes],
        centerNode = nodes[0],
        left = (w - pw) / 2,
        height = ph + hh + fh + this.getTotal(centerNode) * ih,
        top = Math.max((h - height) / 2, this.minTop)
      centerNode.left = left
      centerNode.top = top
      centerNode.height = height
      if (!centerNode.relationData) return
      centerNode.relationData.forEach((item, index) => {
        item.controlPoint = {
          x: item.dir === 'left' ? left : left + pw,
          y: top + ph + hh + ih * (index + 1.5)
        }
      })

      nodes.slice(1).forEach((node, i) => {
        const total = this.getTotal(node),
          height = hh + fh + total * ih

        let l, t, controlPoint
        if (node.dir === 'left') {
          l = left - pw - gapx
          t = lastLeftPanel
            ? lastLeftPanel.height + lastLeftPanel.top + gapy
            : top
          controlPoint = {
            x: left - gapx,
            y: t + hh / 2
          }
          if (node.expand) {
            lastLeftPanel = node
            leftHeight += height
            leftCount++
          }
        } else {
          l = left + pw + gapx
          t = lastRightPanel
            ? lastRightPanel.height + lastRightPanel.top + gapy
            : top
          controlPoint = {
            x: l,
            y: t + hh / 2
          }
          if (node.expand) {
            lastRightPanel = node
            rightHeight += height
            rightCount++
          }
        }
        Object.assign(node, {
          left: l,
          top: t,
          height,
          controlPoint
        })
      })
      leftHeight += (leftCount - 1) * gapy
      rightHeight += (rightCount - 1) * gapy

      const getGapTop = diffHeight => {
        const max = Math.max(height, diffHeight),
          t = max > height ? (max - height) / 2 : 0
        return t
      },
        leftGapTop = getGapTop(leftHeight),
        rightGapTop = getGapTop(rightHeight)
      nodes.slice(1).forEach(node => {
        const t = node.dir === 'left' ? leftGapTop : rightGapTop
        node.top -= t
        node.controlPoint.y -= t
      })
      this.nodes = [...nodes]
      this.renderEdge()
    },
    renderEdge () {
      this.clearSvg()
      const centerNode = this.nodes[0],
        relationNodes = this.nodes.slice(1),
        paths = []
      centerNode.relationData.forEach(item => {
        if (item.expand) {
          let node = relationNodes.find(n => n.source === item.element_id),
            { x: x1, y: y1 } = item.controlPoint,
            { x: x2, y: y2 } = node.controlPoint,
            dx = x2 - x1
          if (this.flag && this.flag === 'fact') {
            y1 = y1 - 60
          }
          paths.push({
            id: item.element_id,
            d: bezierCurveTo(x1, y1, x2, y2, dx),
            img: [
              x1 + dx / 2 - this.imageSize / 2,
              (y2 - y1) / 2 + y1 - this.imageSize / 2
            ]
          })
        }
      })
      paths.forEach(item => {
        this.edges
          .append('path')
          .attr('d', item.d)
          .attr('stroke', this.readonly ? '#d8d8d8' : '#699bed')
          .attr('fill', 'none')
        this.symbols
          .append('use')
          .attr('symbol-id', item.id)
          .attr('xlink:href', `#${this.relImgId}`)
          .attr('transform', `translate(${item.img[0]}, ${item.img[1]})`)

        // if (item.id === this.activePath) {
        //   const totalLength = path.node().getTotalLength()
        //   path
        //     .attr('stroke-dasharray', totalLength)
        //     .attr('stroke-dashoffset', totalLength)
        //     .transition()
        //     .duration(150)
        //     .ease(this.$d3.easeCubic)
        //     .delay(100)
        //     .attr('stroke-dashoffset', 0)
        // }
      })
    },
    clearSvg () {
      this.edges.selectAll('path').remove()
      this.symbols.selectAll('use').remove()
    },
    symbolClick (e) {
      if (this.readonly) return
      const el = e.target,
        id = el.getAttribute('symbol-id'),
        { relationData } = this.nodes[0],
        item = relationData.find(item => item.element_id + '' === id)
      this.$emit('editRelation', item)
    },
    zoomIn () {
      this.zoomLayout.zoomIn()
    },
    zoomOut () {
      this.zoomLayout.zoomOut()
    },
    zoomIdentity () {
      this.zoomLayout.zoomIdentity()
    },
    expand ({ data, dir }) {
      let changedItem = {}
      this.nodes[0].relationData = this.nodes[0].relationData.map(item => {
        if (item.element_id === data.element_id) {
          item.expand = !data.expand
          item.dir = dir
          changedItem = item
        }
        return item
      })

      this.nodes.slice(1).some(node => {
        if (changedItem.element_id === node.source) {
          node.expand = changedItem.expand
          node.dir = changedItem.dir
          return true
        }
      })
      this.adaptiveLayout()
    },
    changeActiveField (item) {
      this.activeFieldValue = item.id
      this.activeField = item
    },
    viewField ({ data, item }) {
      this.activeFieldValue = item.element_id
      this.activeField = item
      this.viewFieldList = [
        ...(data.primarykeyData || []),
        ...(data.systemData || []),
        ...(data.relationData || []),
        ...(data.attrData || []),
        ...(data.measureData || [])
      ]
      this.visibleViewField = true
    },
    async fullscreenHandle () {
      this.isFullScreen = !this.isFullScreen
      this.isFullScreen ? requestFullscreen() : exitFullscreen()
      await this.$sleep(20)
      this.adaptiveLayout()
    },
    async collapseItem (node) {
      node.collapse = !node.collapse
      if (!node.collapse) {
        await this.$sleep(200)
      }
      this.adaptiveLayout()
    },
    async collapseHandle () {
      const collapse = !this.collapse
      this.nodes.forEach(item => {
        item.collapse = collapse
      })
      if (!collapse) {
        await this.$sleep(210)
      }
      this.adaptiveLayout()
    },
    showOnline () { },
    showDimAttr () { }
  }
}
</script>

<style lang="scss">
.table-flow {
  height: 100%;
  overflow: hidden;
  position: relative;
  /*
  &.is-fullscreen {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: $grey10;
  } */

  @mixin grabbing {
    &:active,
    &:focus {
      cursor: grabbing;
    }
  }
  .table-flow-body {
    height: calc(100% - 30px);
    cursor: grab;
    position: relative;
    @include grabbing;

    .table-flow-nodes {
      position: absolute;
    }
    svg {
      width: 100%;
      height: 100%;
      position: absolute;

      .symbols {
        use {
          &:hover {
            cursor: pointer;
          }
          @include grabbing;
        }
      }
    }
  }
  .table-flow-foot {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: $grey8;
    border-top: 1px solid $grey7;
    font-size: 12px;
    .el-col {
      height: 31px;
      line-height: 26px;
    }
    .tool {
      .el-link {
        margin-left: 12px;
      }
    }
    .info {
      text-align: center;

      .num {
        color: $warning;
      }
    }
    .el-col:last-child {
      text-align: right;
      padding-right: 10px;
    }
    .el-link.el-link--default.is-disabled {
      color: $grey5;
    }
  }
}
</style>

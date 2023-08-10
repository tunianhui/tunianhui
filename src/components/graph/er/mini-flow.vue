<template>
  <section class="mini-flow er-graph-mini">
    <div class="mini-flow-head">
      <div class="title">来源表模型</div>
      <el-button
        title="放大"
        type="text"
        icon="icon el-icon-full-screen"
        @click="handleZoom"
      ></el-button>
    </div>
    <div
      :class="['mini-flow-body', {active: activeNode.type === 'whole'}]"
      @click="selectFlow"
      ref="flowBody"
    >
      <div ref="container" class="mini-flow-container">
        <svg ref="svg" />
        <div class="nodes" ref="nodes">
          <el-tooltip v-for="node in nodes" :key="node.id" placement="left">
            <div slot="content">
              <p>{{ node.code }}</p>
              <p>{{ node.name }}</p>
            </div>
            <div
              :class="[
                'node',
                {
                  'center-node': node.isCenter,
                  active: activeNode.id === node.id
                }
              ]"
              @click.stop="nodeClick(node)"
              :style="{top: `${node.top}px`, left: `${node.left}px`}"
            ></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="visible" title="来源表模型" width="75%">
      <Flow
        readonly
        :data="data.list"
        :headerData="headerData"
        :style="{height: `${dialogBodyHeight + 20}px`}"
      ></Flow>
      <div slot="footer">
        <el-button type="primary" plain @click="visible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Flow from './index'
import dialogHeight from '@/mixins/dialog-height'
import {bezierCurveTo} from '@/libs/visual/tool/path'
import ZoomLayout from '../zoom-layout'

// 节点的尺寸
const nw = 50
const nh = 20
// 中间节点的高度
const cnh = 40
// 间距
const gapx = 40
const gapy = 10

export default {
  name: 'MiniFlow',
  props: {
    data: Object,
    activeNode: Object
  },
  mixins: [dialogHeight],
  components: {Flow},
  data() {
    return {
      nodes: [],
      visible: false
    }
  },
  computed: {
    headerData() {
      return {code: this.data.code, name: this.data.name}
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        val.list &&
          this.$nextTick(_ => {
            this.processData(val)
          })
      }
    }
  },
  created() {
    this.$root.eventEmitter.on('closeRelDialod', () => {
      this.visible = false
    })
  },
  mounted() {
    this.zoomLayout = new ZoomLayout(
      this.$refs.container,
      [this.$refs.nodes, this.$refs.svg],
      {
        scaleExtent: [1, 1]
      }
    )
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('closeRelDialod')
    next()
  },
  methods: {
    recoverLayout() {
      this.zoomLayout.zoomIdentity()
      if (this.$refs.container) {
        this.$refs.container.style.height =
          this.$refs.flowBody.clientHeight + 'px'
      }
    },
    processData(data) {
      this.nodes = []
      this.recoverLayout()
      const $container = this.$refs.container,
        width = $container.offsetWidth,
        height = $container.offsetHeight,
        c_left = (width - nw) / 2,
        centerNode = {
          ...data,
          isCenter: true,
          left: c_left
        }
      if (width <= 10) {
        setTimeout(_ => {
          this.processData(data)
        }, 20)
        return
      }
      this.nodes.push(centerNode)

      let i = 0
      data.list.forEach(item => {
        if (item.group_type === 'relation' && !item.head) {
          this.nodes.push(item)
          i++
        }
      })

      const col_num = Math.ceil(i / 2),
        _height = col_num * nh + 20 + (col_num - 1) * gapy,
        c_top = (Math.max(height, _height) - cnh) / 2
      centerNode.top = c_top
      if (_height > height) {
        $container.style.height = `${_height}px`
      }

      let left, top, lastLeftTop, lastRightTop, x1, y1, x2, y2

      y1 = c_top + cnh / 2
      const paths = []
      this.nodes.slice(1).forEach((item, i) => {
        if (i % 2 === 0) {
          left = c_left - gapx - nw
          top = lastLeftTop ? lastLeftTop + gapy + nh : gapy
          lastLeftTop = top
          x1 = c_left
          x2 = left + nw
        } else {
          left = c_left + gapx + nw
          top = lastRightTop ? lastRightTop + gapy + nh : gapy
          lastRightTop = top
          x1 = c_left + nw
          x2 = left
        }
        item.left = left
        item.top = top
        y2 = top + nh / 2
        paths.push(bezierCurveTo(x1, y1, x2, y2, (x2 - x1) / 1.5))
      })

      this.drawPaths(paths)
    },
    drawPaths(paths) {
      this.$d3
        .select(this.$refs.svg)
        .selectAll('path')
        .remove()
      this.$d3
        .select(this.$refs.svg)
        .selectAll('path')
        .data(paths)
        .enter()
        .append('path')
        .attr('d', d => d)
        .attr('stroke', '#86cacc')
        .attr('fill', 'none')
    },
    adaptiveLayout() {},
    selectFlow() {
      this.$emit('click', {
        type: 'whole'
      })
    },
    nodeClick(node) {
      let activeNode = null
      if (node.isCenter) {
        activeNode = {
          ...node,
          type: 'fact'
        }
      } else {
        const {relationDatas} = node,
          list = []
        Object.keys(relationDatas).forEach(key => {
          list.push(...relationDatas[key])
        })
        activeNode = {
          ...node,
          list,
          type: 'dim'
        }
      }
      this.$emit('click', activeNode)
    },
    handleZoom() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.mini-flow {
  display: flex;
  height: 72px;
  /* width: 400px; */
  /* width: 90%; */
  margin: auto 30px;
  .mini-flow-head {
    border: 1px solid $grey7;
    border-right: none;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 120px;
    .title {
      color: $grey3;
      /* color: #86cacc; */
      font-size: 14px;
      line-height: 18px;
    }

    .icon {
      cursor: pointer;
      font-size: 18px;
      color: $--color-primary;
    }
  }
  @mixin grabbing {
    &:active,
    &:focus-within,
    &:focus {
      cursor: grabbing;
    }
  }
  .mini-flow-body {
    border: 1px solid $grey7;
    flex: 1;
    height: 100%;
    overflow: auto;
    @include grabbing;
    .mini-flow-container {
      height: 100%;
      position: relative;
      cursor: grab;
      /* overflow: auto; */
      @include grabbing;
    }
    svg {
      height: 100%;
      width: 100%;
      position: absolute;
      @include grabbing;
    }
    .nodes {
      position: absolute;

      .node {
        position: absolute;
        width: 50px;
        height: 20px;
        border: 1px solid $grey6;
        border-radius: 8px;
        background-color: #fff;
        cursor: pointer;

        &.center-node {
          height: 40px;
        }
      }
    }
    /* &:active, */
    &.active,
    .node.active {
      border-color: $grey1;
    }
  }
}
</style>

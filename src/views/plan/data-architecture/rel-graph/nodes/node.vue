<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-29 15:28:52
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-13 11:58:55
 * @FilePath: \dataphin\src\views\plan\data-architecture\rel-graph\nodes\node.vue
-->
<template>
  <div
    :class="['custom-rect', nodeBaseData.nodeType, borderVisible ? 'active' : '']"
    :style="borderVisible ? {borderColor: nodeBaseData.nodeColor} : {}"
  >
    <div class="node-icon">
      <i :class="[nodeBaseData.nodeIcon]" :style="{color: nodeBaseData.nodeColor}"></i>
    </div>
    <div class="baseinfo">
      <div class="baseinfo-title">
        <OverflowTooltip>{{nodeBaseData.nodeName}}</OverflowTooltip>
      </div>
      <div class="baseinfo-sub-title">
        <OverflowTooltip>{{nodeBaseData.nodeDesc}}</OverflowTooltip>
      </div>
    </div>
    <div class="baseinfo-more">
      <el-popover
        placement="bottom-start"
        width="200"
        trigger="hover"
        popper-class="custom-node-popover"
        :visible-arrow="false"
      >
          <ul>
            <li>删除</li>
            <li>编辑</li>
            <li>添加子域</li>
            <li>添加实体</li>
          </ul>
        <i class="iconfont icon-gengduo" slot="reference"></i>
      </el-popover>
      
    </div>
    <div class="expand-wrapper" @click="nodeCollapsedHand">
      <template v-if="nodeBaseData.nodeType !== nodeTypes.shujubankuai && nodeBaseData.nodeType !== nodeTypes.zhutiyu">
        <template v-if="isLefa">
          <el-tooltip class="item" effect="dark" content="查看实体关系" placement="top">
            <i class="iconfont icon-chakan3" :style="{color: nodeBaseData.nodeColor}"></i>
          </el-tooltip>
          
        </template>
        <template v-else>
          <i :class="['iconfont icon-jia', isLefa ? 'active' : '']" :style="{color: nodeBaseData.nodeColor}" v-if="nodeData.isCollapsed"></i>
          <i class="iconfont icon-a-jian1" :style="{color: nodeBaseData.nodeColor}" v-if="!nodeData.isCollapsed"></i>
        </template>
        
      </template>
      <template v-else>
        <i :class="['iconfont icon-jia', isLefa ? 'active' : '']" :style="{color: nodeBaseData.nodeColor}" v-if="nodeData.isCollapsed"></i>
        <i class="iconfont icon-a-jian1" :style="{color: nodeBaseData.nodeColor}" v-if="!nodeData.isCollapsed"></i>
      </template>
    </div>
  </div>
</template>

<script>
import { nodeTypes, nodeColors, nodeIcons, nodeTypeText } from '../config'
import OverflowTooltip from '@/components/overflow-tooltip'
export default {
  name: 'customrect',
  inject: ["getGraph", "getNode"],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      nodeTypes,
      nodeColors,
      nodeIcons,
      nodeTypeText,
      nodeData: {},
      nodeBaseData: {},
      borderVisible: false,
      isLefa: false
    }
  },
  watch: {
    'nodeData.selected': {
      handler(val) {
        if (val) {
          this.borderVisible = true
        } else {
          this.borderVisible = false
        }
      }
    },
    'nodeData.isLefa': {
      handler(val) {
        this.isLefa = val
      }
    }
  },
  created() {
    const node = this.getNode()
    this.nodeData = node.getData()
    this.nodeBaseData = this.nodeData.nodeBaseData
  },
  mounted() {
    this.$nextTick(_ => {
      const graph = this.getGraph()
      graph.on('node:change:data', ({cell}) => {
        const node = this.getNode()
        this.nodeData = node.getData()
        this.nodeBaseData = this.nodeData.nodeBaseData
      })
    })
  },
  methods: {
    triggerEvent(eventName, data) {
      // 通过 this.graph.trigger 触发事件
      const graph = this.getGraph()
      graph.trigger(eventName, data)
    },
    nodeCollapsedHand() {
      const graph = this.getGraph()
      const node = this.getNode()
      const nodeData = node.getData()
      const nodeBaseData = nodeData.nodeBaseData
      const isLefa = nodeData.isLefa
      const cells = node.getDescendants()
      if (nodeBaseData.nodeType !== nodeTypes.shujubankuai && nodeBaseData.nodeType !== nodeTypes.zhutiyu) {
        if (isLefa) {
          this.triggerEvent('custom-node:click', this.nodeData)
          return
        } else {
          nodeData.isCollapsed = !nodeData.isCollapsed
        }
      } else {
        if (isLefa) {
          return this.$message.warning('该节点无下游')
        } else {
          nodeData.isCollapsed = !nodeData.isCollapsed
        }
      }
      if (nodeData.isCollapsed) {
        graph.freeze()
        cells.forEach(cell => {
          if (cell.isNode()) {
            cell.hide()
            const curCellData = cell.getData()
            curCellData.isCollapsed = true
          } else {
            cell.set('collapsed', true)
          }
        })
        graph.unfreeze()
      } else {
        graph.freeze()
        const children = node.getChildren()
        children.forEach(cell => {
          if (cell.isNode()) {
            cell.show()
          } else {
            cell.set('collapsed', false)
          }
        })
        graph.unfreeze()
      }
      node.setZIndex(node.getZIndex() + 1 + cells.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-rect {
  width: 168px;
  height: 44px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  display: flex;
  position: absolute;
  padding: 6px;
  cursor: pointer;
  opacity: 1;
  transition: opacity .3s linear;
  &.active {
    border: 2px solid;
  }
  .node-icon {
    position: relative;
    font-size: 20px;
  }
  .baseinfo {
    width: calc(100% - 32px);
    margin-left: 6px;
    text-align: left;
    .baseinfo-title {
      width: 100%;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
      > span {
        width: calc(100% - 1px);
      }
    }
    .baseinfo-sub-title {
      width: 100%;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
      > span {
        width: calc(100% - 1px);
      }
    }
  }
  .baseinfo-more {
    position: absolute;
    top: -2px;
    right: 4px;
    transform: rotate(90deg);
    > i {
      font-size: 13px;
    }
  }
  .expand-wrapper {
    display: block;
    position: absolute;
    top: 8px;
    right: -10px;
    z-index: 9;
    i {
      background-color: #fff;
      font-size: 20px;
      border-radius: 20px;
      display: none;
      &.active {
        color: rgba(0, 0, 0, 0.25)!important;
        cursor: not-allowed;
      }
    }
  }
  &:hover {
    .expand-wrapper {
      > i {
        display: block;
      }
    }
  }
}
</style>

<style lang="scss">
.custom-node-popover {
  margin-top: 0!important;
  padding: 0;
  min-width: 0;
  width: auto!important;
  ul {
    li {
      padding: 0px 10px;
      font-weight: 400;
      font-size: 12px;
      line-height: 30px;
      height: 30px;
      padding: 0 10px;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
        color: #0c4cff;
      }
    }
  }
}
</style>
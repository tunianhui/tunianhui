<template>
  <div class="entity-rel-node" :style="{background, 'border-color': borderVisible ? iconColor : 'rgba(0, 0, 0, 0.1)'}">
    <div class="node-icon">
      <i :class="[nodeBaseData.nodeIcon]" :style="{color: iconColor}"></i>
    </div>
    <div class="baseinfo">
      <div class="baseinfo-title" :style="{color: textColors}">
        <OverflowTooltip>{{nodeBaseData.nodeName}}</OverflowTooltip>
      </div>
      <div class="baseinfo-sub-title" :style="{color: textColors}">
        <OverflowTooltip>{{nodeBaseData.nodeDesc}}</OverflowTooltip>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@/components/overflow-tooltip'
export default {
  name: 'EntityRelNode',
  inject: ["getGraph", "getNode"],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      nodeData: {},
      nodeBaseData: {},
      background: '',
      iconColor: '',
      textColors: '',
      borderVisible: false
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
    }
  },
  created() {
    const node = this.getNode()
    this.nodeData = node.getData()
    console.log(this.nodeData)
    this.nodeBaseData = this.nodeData.nodeBaseData
    if (this.nodeData.currentID === this.nodeData.entity_id) {
      this.background = this.nodeBaseData.nodeColor
      this.iconColor = '#fff'
      this.textColors = '#fff'
    } else {
      this.background = '#fff'
      this.iconColor = this.nodeBaseData.nodeColor
      this.textColors = 'rgba(0, 0, 0, 0.85)'
    }
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
}
</script>

<style lang="scss" scoped>
.entity-rel-node{
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
    border: 1px solid
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
}
</style>
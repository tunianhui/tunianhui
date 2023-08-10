<template>
  <div :class="['graph-legend-wrapper']">
    <div class="legend-group">
      <div :class="['legend-item', getActive(value) ? 'active' : '']" v-for="(value) in list" :key="value" @click="selectNode(value)">
        <i :class="[curIcons[value]]" :style="{color: curColors[value]}"></i>
        <span class="node-text">{{curTexts[value]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { nodeTypes, nodeColors, nodeIcons, nodeTypeText, entityRelTyps, entityRelTypsText, entityRelTypsIcon, entityRelTypsColor } from './config'
export default {
  name: 'GraphLegend',
  computed: {
    getActive() {
      return item => {
        if (!this.activeNode) return true
        if (this.activeNode) {
          if (this.activeNode === item) {
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    legendType: String
  },
  data() {
    return {
      // nodeTypes,
      // nodeColors,
      // nodeIcons,
      // entityRelTyps,
      // entityRelTypsText,
      // entityRelTypsIcon,
      // nodeTypeText,
      activeNode: '',
      curTypes: {},
      curTexts: {},
      curIcons: {},
      curColors: {}
    }
  },
  created() {
    if (this.legendType === '1') {
      this.curTypes = nodeTypes
      this.curTexts = nodeTypeText
      this.curColors = nodeColors
      this.curIcons = nodeIcons
    } else {
      this.curTypes = entityRelTyps
      this.curTexts = entityRelTypsText
      this.curColors = entityRelTypsColor
      this.curIcons = entityRelTypsIcon
    }
  },
  methods: {
    selectNode(val) {
      if (this.activeNode && this.activeNode === val) {
        this.activeNode = ''
      } else {
        this.activeNode = val
      }
      this.$emit('selectNode', this.activeNode)
    },
  }
}
</script>

<style lang="scss" scoped>
.graph-legend-wrapper {
  // position: absolute;
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  height: 40px;
  // z-index: 9;
  background: #ffff;
  // top: 0;
  .legend-group  {
    display: flex;
    align-items: center;
    .legend-item  {
      font-family: PingFangSC;
      font-weight: 400;
      font-size: 12px;
      text-align: center;
      line-height: 12px;
      margin-right: 16px;
      cursor: pointer;
      display: flex;
      opacity: 0.25;
      align-items: center;
      &.active {
        opacity: 1;
      }
      i {
        margin: 0 8px 0 0;
        vertical-align: middle;
        user-select: none;
        font-size: 13px;
      }
      >span {
        user-select: none;
        color: rgba(0,0,0,0.65);
      }
    }
  }
}
</style>
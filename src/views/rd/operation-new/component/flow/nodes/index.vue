<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-08 13:52:43
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-06 18:48:30
 * @FilePath: \dataphin\src\views\rd\operation-new\component\flow\nodes\index.vue
-->
<template>
  <div class="flow-node" :style="{width: `${nodeWidth}px`, height: `${nodeHeight}px`}">
    <div
      :class="['dag-node', borderVisible ? 'node-active' : '']"
      :style="{
        'border-color': nodeBaseData.nodeColor,
        background: borderVisible ? rgbToRgba(nodeBaseData.nodeColor, 0.08) : '#fff'
      }"
    >
      <div class="dag-node-positioning-container">
        <div class="dag-node-content-wrapper">
          <div class="dag-node-icon-container">
            <span class="dag-node-icon-container-background" :style="{background: rgbToRgba(nodeBaseData.nodeColor, 1)}"></span>
            <i :class="nodeBaseData.nodeIcon" :style="{color: nodeBaseData.nodeColor}"></i>
          </div>
          <div class="dag-node-content">
            <div>
              <div class="node-name-text">
                {{nodeBaseData.nodeName}}
                <!-- <OverflowTooltip style="width:calc(100% - 5px)">{{nodeBaseData.nodeName}}</OverflowTooltip> -->
              </div>
            </div>
          </div>
        </div>
        <span class="instance-node-status" v-if="nodeStatusIcon[nodeData.state + '']">
          <i :class="nodeStatusIcon[nodeData.state + '']" :style="{color: nodeBaseData.nodeColor}"></i>
        </span>
        <span
          v-if="isMain"
          :class="['dag-text-tag', 'dag-node-main-tag']"
          :style="{
            background: rgbToRgba(nodeBaseData.nodeColor, 1),
            'padding-left': nodeStatusIcon[nodeData.state + ''] ? 'calc(4px)' : 'calc(0 * 2 + 4px)',
            left: nodeStatusIcon[nodeData.state + ''] ? 'calc(12px * 1)' : 'calc(2px * 1)'
          }"
        >
          <span class="dag-text-tag-text">Main</span>
          <span class="dag-text-tag-shape" :style="{ background: rgbToRgba(nodeBaseData.nodeColor, 1)}"></span>
        </span>
      </div>
    </div>
    <div class="baseinfo-more">
      <el-popover
        placement="right-start"
        width="145"
        trigger="click"
        popper-class="custom-node-popover-opr"
        :visible-arrow="false"
      >
          <ul>
            <template v-for="menu in menusList">
              <template v-if="menu.children">
                <el-popover
                  placement="right-start"
                  width="145"
                  trigger="hover"
                  popper-class="custom-node-popover-opr custom-node-popover-opr-children"
                  :visible-arrow="false"
                  :key="menu.label"
                  
                >
                  <ul>
                    <li v-for="menuchild in menu.children" :key="menuchild.label" @click.stop="clickMenu(menuchild)">{{menuchild.label}}</li>
                  </ul>
                  <li slot="reference" class="have-child">
                    <span>
                      <i :class="['icon', menu.icon, 'mr-10']"></i>
                      <span>{{menu.label}}</span>
                    </span>
                    <i class="el-icon-arrow-right"></i>
                  </li>
                </el-popover>
              </template>
              <template v-else>
                <li :key="menu.label" v-if="menu.hr" class="hr"></li>
                <li :key="menu.label" v-if="!menu.hr" @click.stop="clickMenu(menu)">
                  <i :class="['icon', menu.icon, 'mr-10']"></i>
                  <span>{{menu.label}}</span>
                </li>
              </template>
            </template>
            
          </ul>
        <i class="iconfont icon-gengduo" slot="reference"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { nodeWidth, nodeHeight, nodeStatusIcon } from '../config'
import { rgbToRgba, getHexColor } from '@/libs/util.js'
// import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'FlowNode',
  inject: ["getGraph", "getNode"],
  components: {
    // OverflowTooltip
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
    'nodeData.isMain': {
      handler(val) {
        this.isMain = val
      }
    }
  },
  data() {
    return {
      nodeData: {},
      nodeBaseData: {},
      style: {},
      borderVisible: false,
      getHexColor,
      rgbToRgba,
      isMain: false,
      menusList: [],
      nodeWidth,
      nodeHeight,
      nodeStatusIcon
    }
  },
  created() {
    const node = this.getNode()
    this.nodeData = node.getData()
    this.nodeBaseData = this.nodeData.nodeBaseData
    this.menusList = this.nodeData.menusList
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
    clickMenu(menu) {
      this.triggerEvent('custom:command', {data: this.nodeData, currentMenu: menu})
    },
    triggerEvent(eventName, data) {
      // 通过 this.graph.trigger 触发事件
      const graph = this.getGraph()
      graph.trigger(eventName, data)
    },
  }
}
</script>

<style lang="scss" scoped>
.flow-node {
  cursor: pointer;
  background: #fff;
  width: 100%;
  position: absolute;
  .dag-node {
    transform: scaleX(1);
    border: 2px solid;
    height: 100%;
    position: relative;
    .dag-node-positioning-container {
      position: absolute;
      top: calc(2px * -1);
      left: calc(2px * -1);
      right: calc(2px * -1);
      bottom: calc(2px * -1);
      .dag-node-content-wrapper {
        display: flex;
        height: 100%;
        padding: 2px;
        .dag-node-icon-container {
          position: relative;
          flex-shrink: 0;
          width: 44px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 0;
          &-background {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            opacity: .1;
          }
        }
        .dag-node-content {
          display: flex;
          align-items: center;
          padding: 0 6px;
          flex: 1;
          min-width: 0;
          position: relative;
          > div {
            width: 100%;
            .node-name-text {
              font-size: 12px;
              color: rgba($color: #000000, $alpha: 0.7);
            }
          }
        }
      }
      .instance-node-status {
        position: absolute;
        top: 0;
        left: 2px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 12px;
        height: 12px;
        overflow: hidden;
      }
      .dag-node-main-tag {
        top: 0;
        left: 0;
      }
      .dag-text-tag {
        position: absolute;
        display: inline-flex;
        align-items: center;
        height: 24px;
        padding-top: 0;
        padding-right: 4px;
        padding-bottom: 0;
        transform: scale(.5);
        transform-origin: top left;
        color: #fff;
      }
      .dag-text-tag-text {
        font-size: 20px;
        line-height: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .dag-text-tag-shape {
        position: absolute;
        top: 0;
        right: 0;
        width: 8px;
        height: 100%;
        margin-right: -4px;
        transform: skewX(-.3218rad);
        z-index: -1;
      }
    }
    &.node-active {
      border-width: 3px;
      .dag-node-positioning-container {
        top: calc(3px * -1);
        left: calc(3px * -1);
        right: calc(3px * -1);
        bottom: calc(3px * -1);
      }
    }
  }
  // > .wrapper {
  //   position: absolute;
  //   display: flex;
  //   width: 100%;
  //   height: 100%;
  // }
  // .icon-left {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 100%;
  //   text-align: center;
  //   flex-shrink: 0;
  //   i {
  //     font-size: 16px;
  //   }
  // }
  // .right {
  //   display: flex;
  //   align-items: center;
  //   padding: 8px 10px;
  //   flex: 1;
  //   width: 0;
  //   >span:first-child {
  //     width: 100%;
  //     font-size: 12px;
  //     font-weight: 500;
  //     color: rgba($color: #000000, $alpha: 0.7);
  //     >span {
  //       width: calc(100% - 5px);
  //     }
  //   }
  //   .desc {
  //     font-size: 12px;
  //     color: rgba($color: #000000, $alpha: 0.5);
  //   }
  // }
  // .duigou {
  //   position: absolute;
  //   width: 16px;
  //   height: 16px;
  //   top: 0px;
  //   left: 0px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   >i {
  //     color: #fff;
  //     font-size: 12px;
  //     font-weight: 600;
  //   }
  // }
  // .round {
  //   width: 16px;
  //   height: 16px;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   border-radius: 50%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   > span {
  //     width: 6px;
  //     height: 6px;
  //     background: #fff;
  //     border-radius: 50%;
  //   }
  // }
  // .main {
  //   position: absolute;
  //   top: 0px;
  //   left: 13px;
  //   color: #fff;
  //   padding: 0 3px;
  //   font-size: 12px;
  //   > span {
  //     transform: scale(0.75);
  //     font-size: 12px;
  //     color: #fff;
  //   }
  // }
  .baseinfo-more {
    position: absolute;
    top: 5px;
    right: 7px;
    transform: rotate(90deg);
    width: 15px;
    height: 15px;
    z-index: 99999;
    > i {
      font-size: 13px;
    }
  }
}
</style>
<style lang="scss">
.custom-node-popover-opr {
  margin-top: 0!important;
  padding: 0;
  border-radius: 0;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  > ul {
    padding: 5px 0;
    li {
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.7);
      user-select: none;
      &:hover {
        background: #f7f7f7;
      }
      &.hr {
        padding: 0;
        height: 1px;
        background-color: #f7f7f7;
      }
      &.have-child {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.custom-node-popover-opr-children {
  margin-left: 5px!important;
}
</style>
<template>
  <div class="server-dev-page">
    <header>
      <h3 class="title">服务编排</h3>
      <div class="operate-btns">
        <span><i class="icon iconfont icon-baocun"></i></span>
        <span><i class="el-icon-refresh-right"></i></span>
        <span><i class="el-icon-position"></i></span>
      </div>
    </header>

    <main>
      <div class="x6-editor" id="container"></div>
      <div class="side">
        <el-menu default-active="-1" :default-openeds="['1', '2']">
          <el-submenu index="1">
            <template slot="title">
              <span>服务节点</span>
            </template>
            <el-menu-item index="api" @mousedown.native="startDrag" data-type="api">
              <img :src="require('@/assets/images/serverDev/api_menu_icon.png')" alt="" srcset="" class="menu-icon" />
              API
            </el-menu-item>
            <el-menu-item index="function" @mousedown.native="startDrag" data-type="function">
              <img :src="
                  require('@/assets/images/serverDev/function_menu_icon.png')
                " alt="" srcset="" class="menu-icon" />函数
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>控制节点</span>
            </template>
            <el-menu-item index="switch" @mousedown.native="startDrag" data-type="switch">
              <img :src="require('@/assets/images/serverDev/switch_menu_icon.png')" alt="" srcset="" class="menu-icon" />SWITCH
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="tools-container">
        <span>{{ scale * 10 }}%</span>
        <span title="放大" @click="zoomIn"><i class="el-icon-zoom-in"></i></span>
        <span title="缩小" @click="zoomOut"><i class="el-icon-zoom-out"></i></span>
        <span title="重置" @click="resetSize"><i class="el-icon-full-screen"></i></span>
      </div>
    </main>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <component :is="componentName" @setOptions="setOptions"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Graph, Addon, Shape } from '@antv/x6'
import BaseRect from './shapes/rect'
import SwitchPlane from './components/SwitchPlane'
import SwitchOptions from './components/SwitchOptions.vue'
import ApiPlane from './components/ApiPlane.vue'
import EndPlane from './components/endPlane.vue'
const { Dnd } = Addon

let graph = null
/* eslint-disable */
let dnd = null
function showPorts (ports, show) {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}
export default {
  components: {
    SwitchPlane,
    SwitchOptions,
    ApiPlane,
    EndPlane
  },
  data () {
    return {
      dialogVisible: false,
      componentName: 'SwitchPlane',
      dialogTitle: 'SWITCH',
      scale: 10,
      activeNode: null
    }
  },
  mounted () {
    this.initGraph()
  },
  methods: {
    initGraph () {
      Graph.registerNode('base-rect', BaseRect, true)
      graph = new Graph({
        container: document.getElementById('container'),
        background: {
          color: '#ddd'
        },
        grid: true,
        panning: true,
        snapline: true,
        selecting: {
          enabled: true,
          rubberband: false,
          showNodeSelectionBox: true
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 1
            }
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 10
          },
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#333D55',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'classic',
                    size: 7
                  }
                }
              }
            })
          }
        }
      })
      graph.addNode({
        shape: 'base-rect',
        label: '开始',
        x: 80,
        y: 80,
        attrs: {
          icon: {
            'xlink:href': require('@/assets/images/serverDev/start_icon.png')
          }
        },
        data: {
          type: 'start'
        }
      })
      graph.addNode({
        shape: 'base-rect',
        label: '结束',
        x: 800,
        y: 700,
        attrs: {
          icon: {
            'xlink:href': require('@/assets/images/serverDev/end_icon.png')
          }
        },
        data: {
          type: 'end'
        }
      })
      this.initDnd()
      graph.on('node:mouseenter', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, true)
        if (node.data.type !== 'start' && node.data.type !== 'end') {
          node.addTools({
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 190, y: 20 }
            }
          })
        }
      })
      graph.on('edge:mouseenter', ({ e, x, y, edge, view }) => {
        edge.addTools({
          name: 'button-remove',
          args: {
            x: 0,
            y: 0
          }
        })
      })
      graph.on('edge:mouseleave', ({ e, x, y, edge, view }) => {
        edge.removeTools()
      })
      graph.on('node:mouseleave', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, false)
        node.removeTools()
      })
      graph.on('node:click', ({ e, x, y, node, view }) => {
        console.log(node)
        const type = node.data.type
        this.activeNode = node
        if (type === 'switch') {
          setTimeout(() => {
            if (!this.dialogVisible) {
              this.dialogVisible = true
              this.componentName = 'SwitchPlane'
              this.dialogTitle = node.getLabel()
            }
          }, 250)
        }
        if (type === 'api') {
          this.dialogVisible = true
          this.componentName = 'ApiPlane'
          this.dialogTitle = node.getLabel()
        }
        if (type === 'end') {
          this.dialogVisible = true
          this.componentName = 'EndPlane'
          this.dialogTitle = '结束节点'
        }
      })
      graph.on('node:dblclick', ({ e, x, y, node, view }) => {
        console.log(node.data.type)
        const type = node.data.type
        if (type === 'switch') {
          this.dialogVisible = true
          this.setOptions()
        }
      })
      graph.on('edge:added', ({ e, x, y, edge, view }) => {
        const sourceNode = edge.getSourceNode()
        // console.log(sourceNode)
        if (sourceNode.data.type === 'switch') {
          const sourceNodeEdges = graph.getOutgoingEdges(sourceNode)
          const num = sourceNodeEdges.length
          edge.setLabels(['新分支' + num])
        }
      })
    },
    setOptions () {
      this.componentName = 'SwitchOptions'
      this.dialogTitle = '设置分支条件'
    },
    zoomIn () {
      this.scale += 1
      graph.scale(this.scale / 10)
    },
    zoomOut () {
      if (!this.scale) return
      this.scale -= 1
      graph.scale(this.scale / 10)
    },
    resetSize () {
      this.scale = 10
      graph.scale(1)
    },
    getNodeByType (type) {
      const nodes = graph.getNodes()
      let num = 0
      nodes.forEach(node => {
        if (node.data && node.data.type === type) {
          num++
        }
      })
      return num
    },
    initDnd () {
      dnd = new Dnd({
        target: graph,
        validateNode () {
          return true
        }
      })
    },
    startDrag (e) {
      const target = e.currentTarget
      const type = target.getAttribute('data-type')
      const types = {
        api: { label: 'API' },
        function: { label: '函数' },
        switch: { label: 'SWITCH' }
      }
      const num = this.getNodeByType(type)
      const node = graph.createNode({
        shape: 'base-rect',
        label: `${types[type].label}${num + 1}`,
        attrs: {
          icon: {
            'xlink:href': require(`@/assets/images/serverDev/${type}_icon.png`)
          },
          text: {
            refX: type === 'switch' ? 100 : 80
          }
        },
        data: {
          type: type
        }
      })
      dnd.start(node, e)
    }
  }
}
</script>

<style lang="scss" scoped>
.server-dev-page {
  margin: -10px -15px;
  height: calc(100% + 15px);
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #e8e8e8;
    .title {
      font-size: 14px;
      color: #666666;
      font-weight: normal;
      position: relative;
      padding-left: 20px;
      // &::before {
      //   content: '';
      //   width: 15px;
      //   height: 15px;
      //   background: url('../../../assets/images/serverDev/title_icon.png')
      //     no-repeat;
      //   background-size: 100% 100%;
      //   position: absolute;
      //   top: 12px;
      //   left: 0;
      // }
    }
    .operate-btns {
      span {
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
  main {
    height: calc(100% - 40px);
    display: flex;
    position: relative;
    .x6-editor {
      flex: 1;
      height: 100%;
    }
    .side {
      width: 250px;
      height: 100%;
      background-color: #fff;
      .menu-icon {
        margin-right: 4px;
        margin-top: -2px;
      }
    }
    .tools-container {
      position: absolute;
      width: 200px;
      height: 39px;
      background-color: #ffffff;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 25px;
      font-size: 20px;
      color: #333;
      cursor: pointer;
      & > span:first-child {
        font-size: 16px;
        cursor: text;
      }
    }
  }
}
</style>

<style lang="scss">
.server-dev-page {
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
  }
  .el-menu-item {
    background-color: #eee;
    color: #666;
    height: 40px;
    line-height: 40px;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

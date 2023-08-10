<template>
  <div class="workflow-wrapper">
    <main>
      <div class="x6-editor" id="container">
      </div>
      <div class="library nodePanel-btn" :class="{'nodePanel-btn-visible': showNodePanel}" @click="showNodePanel = !showNodePanel">
        <i v-if="showNodePanel" class="iconfont icon-xiangyou font-16 mr-5"></i>
        <i v-if="!showNodePanel" class="iconfont icon-xiangzuo font-16 mr-5"></i>
        <i class="iconfont icon-kaifazujian font-18 mr-10"></i>
        组件库
      </div>

      <div class="side" v-show="showNodePanel">
        <!-- <div class="library"><i class="iconfont icon-kaifazujian font-18 mr-10"></i>组件库</div> -->
        <el-menu default-active="-1" :default-openeds="['1']">
          <el-submenu index="1">
            <el-menu-item v-for="(item, index) in componentList" @mousedown.native="startDrag" :data-type="item.value" :key="index">
              <img :src="require(`@/assets/images/task-icons/${item.icon}.png`)" alt="" />
              {{item.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <!-- 判断画布是否为空 -->
      <!-- <div class="componentCard-new"><i class="iconfont icon-tianjia"></i></div> -->

      <!-- 缩放工具 -->
      <div class="tools-container">
        <span>{{ scale * 10 }}%</span>
        <span title="放大" @click="zoomIn"><i class="el-icon-zoom-in"></i></span>
        <span title="缩小" @click="zoomOut"><i class="el-icon-zoom-out"></i></span>
        <span title="重置" @click="resetSize"><i class="el-icon-full-screen"></i></span>
      </div>
    </main>

    <!-- 管理组件 弹窗 -->
    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px">
      <component :is="componentName" :id="activeNode.id" :nodeData="nodeData" ref="comp"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 节点配置 -->
    <side-modal :visible.sync="dialogVisible" :title="dialogTitle" @confirm="handleConfirm">
      <component :is="componentName" :id="activeNode.id" :nodeData="nodeData" ref="comp"></component>
    </side-modal>

    <!-- 新建节点 -->
    <el-dialog :title="nodeTitle" :visible.sync="nodeVisible" :close-on-click-modal="false" width="500px">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="130px" label-position="right" label-suffix="：">
        <el-form-item label="节点类型" prop="type">{{form.type}}</el-form-item>
        <el-form-item label="任务类型" prop="nodeType">
          <el-select v-model="form.nodeType" placeholder="请选择任务类型" disabled>
            <el-option v-for="item in nodeTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="32" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleNodeCancel">取 消</el-button>
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 右键菜单 -->
    <contextmenu v-show="contextmenuVisible" :position="contextmenuPosition" @menuClick="menuClick"></contextmenu>
  </div>
</template>

<script>
import { Graph, Addon, Shape } from '@antv/x6'
import BaseRect from './shapes/rect'
import SideModal from './sideModal.vue'

import Shell from './components/Shell.vue'
import SUB_PROCESS from './components/SUB_PROCESS.vue'
import PROCEDURE from './components/PROCEDURE.vue'
import SQL from './components/SQL.vue'
import SPARK from './components/SPARK.vue'
import FLINK from './components/FLINK.vue'
import PYTHON from './components/PYTHON.vue'
import DEPENDENT from './components/DEPENDENT.vue'
import HTTP from './components/HTTP.vue'
import CONDITIONS from './components/CONDITIONS.vue'
import SWITCH1 from './components/SWITCH.vue'
import CHUNJUN from './components/CHUNJUN.vue'
import HIVECLI from './components/HIVECLI.vue'

import Contextmenu from './components/Contextmenu.vue'
import { mapGetters } from 'vuex'
import { getFlow, getTaskCode, saveTask, getTreeData } from '@/api/rd/integrate'

const { Dnd } = Addon
// 连接桩
function showPorts (ports, show) {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

export default {
  name: 'flow-edit',
  mixins: [],
  props: {
    data: Object
  },
  components: {
    Shell,
    SUB_PROCESS,
    PROCEDURE,
    SQL,
    SPARK,
    FLINK,
    PYTHON,
    DEPENDENT,
    HTTP,
    CONDITIONS,
    SWITCH1,
    CHUNJUN,
    HIVECLI,
    Contextmenu,
    SideModal
  },
  data () {
    return {
      // Graph 实例
      graph: null,
      dnd: null,
      // menu: null,
      // 节点信息
      activeNode: {
        id: ''
      },
      addNode: {},
      activeCell: {},
      // 节点表单数据
      nodeData: {},
      // 工作流信息
      nodeInfo: {},
      scale: 10,
      nodes: [],
      edges: [],
      contextmenuVisible: false,
      contextmenuPosition: { top: 0, left: 0 },

      currentNodeKey: '',
      dialogVisible: false,
      componentName: '',
      dialogTitle: '',
      nodeVisible: false,
      nodeTitle: '新建节点',
      form: {
        name: '',
        type: '',
        catalogid: ''
      },
      nodeTypeList: [
        { name: '数据集成', value: 1 },
        { name: '机器学习', value: 2 },
        { name: '数据处理', value: 3 },
        { name: '数据库', value: 4 },
        { name: '通用', value: 5 }
      ],
      rules: {
        name: [
          { required: true, message: '名称为必填项', trigger: ['blur', 'change'] }
        ]
      },
      // 组件列表
      componentList: [
        { name: '数据集成', value: 'integration', icon: 'integration' },
        { name: 'Shell', value: 'Shell', icon: 'Shell' },
        { name: 'SUB_PROCESS', value: 'SUB_PROCESS', icon: 'SUB_PROCESS' },
        { name: 'PROCEDURE', value: 'PROCEDURE', icon: 'PROCEDURE' },
        { name: 'SQL', value: 'SQL', icon: 'SQL' },
        { name: 'SPARK', value: 'SPARK', icon: 'SPARK' },
        { name: 'FLINK', value: 'FLINK', icon: 'FLINK' },
        { name: 'PYTHON', value: 'PYTHON', icon: 'PYTHON' },
        { name: 'DEPENDENT', value: 'DEPENDENT', icon: 'DEPENDENT' },
        { name: 'HTTP', value: 'HTTP', icon: 'HTTP' },
        { name: 'CONDITIONS', value: 'CONDITIONS', icon: 'CONDITIONS' },
        { name: 'SWITCH', value: 'SWITCH', icon: 'SWITCH' }, // SWITCH 关键字
        { name: 'CHUNJUN', value: 'CHUNJUN', icon: 'CHUNJUN' },
        { name: 'HIVECLI', value: 'HIVECLI', icon: 'HIVECLI' },
        { name: 'MLFLOW', value: 'MLFLOW', icon: 'HIVECLI' },
        { name: 'K8S', value: 'K8S', icon: 'HIVECLI' },
        { name: 'Pytorch', value: 'Pytorch', icon: 'HIVECLI' }
      ],
      pathList: [],
      showNodePanel: true
    }
  },
  created () {
    this.getFolder()
    this.$root.eventEmitter.on('update-node', form => {
      console.log('form-save', form)
    })
  },
  mounted () {
    this.initGraph()
    this.initDnd()
    this.initEvent(this.graph)
    this.getGraphConfig()
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    async getFolder () {
      const params = {
        folder_type: '5',
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getTreeData(params), '获取树数据失败')
      if (res) {
        // 存在文件夹嵌套
        this.traverseTree(res.data, this.data.id)
      }
    },

    // 遍历函数
    traverseTree (node, targetId) {
      if (node.id === targetId) {
        this.pathList = node.child
        return
      }

      if (node.child && node.child.length > 0) {
        // 继续遍历子节点
        for (let i = 0; i < node.child.length; i++) {
          this.traverseTree(node.child[i], targetId)
        }
      }
    },

    // 画布数据回显
    async getGraphConfig () {
      const { id } = this.data
      if (!id) {
        return
      }
      const res = await getFlow({ id })
      const { flag, data } = res
      if (flag && data) {
        const { flowData } = data
        if (flowData) {
          this.graph.fromJSON(JSON.parse(flowData))
        }
        // 流程图信息
        this.nodeInfo = res.data
      }
    },

    // 初始化画布
    initGraph () {
      Graph.registerNode('base-rect', BaseRect, true)
      const graphContainer = document.getElementById('container')
      this.graph = new Graph({
        container: graphContainer, // 画布容器
        background: {
          color: '#ddd'
        },
        grid: true, // 网格大小 10px，并绘制网格
        keyboard: true, // 键盘事件可用于绑定快捷键，如 Ctrl+C 复制节点 Ctrl+V 粘贴节点
        panning: true, // 画布是否可以拖拽平移
        snapline: true, // 对齐线
        autoResize: true, // 是否监听容器大小改变，并自动更新画布大小
        history: {
          enabled: true, // 是否开启撤销/重做
          ignoreAdd: false, // 是否忽略添加
          ignoreRemove: false, // 是否忽略删除
          ignoreChange: true // 是否忽略属性变化
        },
        mousewheel: {
          enabled: true, // 是否开启滚轮缩放
          modifiers: ['ctrl'], // 缩放修饰键
          minScale: 0.5, // 最小缩放等级
          maxScale: 2, // 最大缩放等级
          zoomAtMousePosition: true // 是否将鼠标位置作为缩放中心
        },
        highlighting: {
          magnetAdsorbed: { // 当链接桩可以被链接时，在链接桩外围渲染一个矩形框
            name: 'stroke',
            args: {
              attrs: {
                fill: 'transparent',
                stroke: 'transparent'
              }
            }
          }
        },
        selecting: {
          enabled: false, // 是否点选/框选节点
          rubberband: false,
          showNodeSelectionBox: true
        },
        resizing: {
          enabled: false // 调整节点大小
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
            radius: 50
          },
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#6ca0f5',
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
    },

    // 快捷操作事件
    menuClick (action) {
      this.contextmenuVisible = false
      if (action === 'delete') {
        // 请求服务端 删除节点 更新树表 --->
        // 删除二次确认
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.graph.removeNode(this.activeNode)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (action === 'edit') {
        this.editNode(this.activeNode)
      }
      if (action === 'copy') {
        // 复制 粘贴
        const options = {
          offset: 50,
          useLocalStorage: true
        }

        const cells = [this.activeCell]
        this.graph.copy(cells, options)
        const pastedCells = this.graph.paste(options)
        this.graph.cleanSelection()
        this.graph.select(pastedCells)
      }
    },

    // 初始化画布事件
    initEvent (graph) {
      // 开启嵌入，在开始拖动节点时触发
      graph.on('node:embed', ({ e, x, y, node, view }) => {

      })

      // 画布点击事件
      graph.on('blank:click', ({ e, x, y }) => {
        this.contextmenuVisible = false
      })

      // 鼠标移入节点
      graph.on('node:mouseenter', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, true)
      })

      // 鼠标移入节点
      this.graph.on('edge:mouseenter', ({ e, x, y, edge, view }) => {
        edge.addTools({
          name: 'button-remove',
          args: {
            x: 0,
            y: 0
          }
        })
      })

      // 鼠标移出节点
      this.graph.on('edge:mouseleave', ({ e, x, y, edge, view }) => {
        edge.removeTools()
      })

      // 鼠标移出节点
      graph.on('node:mouseleave', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, false)
      })

      // 为节点添加右键菜单
      graph.on('node:contextmenu', ({ cell, e, node }) => {
        e.preventDefault()
        this.activeCell = cell
        this.activeNode = node
        this.contextmenuVisible = true
        this.contextmenuPosition = { top: e.clientY, left: e.clientX }
      })

      // 单击节点
      graph.on('node:click', ({ e, x, y, node, view }) => {
        // const type = node.data.type
      })

      // 双击节点
      graph.on('node:dblclick', ({ e, x, y, node, view }) => {
        this.activeNode = node
        this.editNode(node)
      })

      // 节点添加到画布
      graph.on('node:added', ({ node, index, options }) => {
        // const nodesAll = this.graph.getNodes()
        this.getCode(node)
      })

      // 将节点从画布删除
      graph.on('node:removed', ({ node, index, options }) => {
        // const nodesAll = this.graph.getNodes()
      })

      // 边开始添加到画布
      graph.on('edge:added', ({ e, x, y, edge, view }) => {
        // const sourceNode = edge.getSourceNode()
      })

      // 链接桩连线事件
      graph.on('edge:connected', ({ isNew, edge, view }) => {
        try {

        } catch (e) {
          this.$message.error(`${e}`)
          console.error(e)
        }
      })

      // 删除边事件
      graph.on('edge:removed', ({ edge, index, options }) => {
        try {
          // 该判断是删除的当前边都是有连接的节点
          if (edge.getSource().cell && edge.getTarget().cell) {
            // 如果不存在，切换隐藏显示对应的链接桩类型样式
          } else {
            // 添加边没有链接到链接桩，在画布空白处松开鼠标，还原链接桩样式
          }
        } catch (e) {
          this.$message.error(`${e}`)
          console.error(e)
        }
      })
    },

    // 拖拽时从服务端获取节点code ----> 节点唯一标识,
    async getCode (node) {
      this.addNode = node // 当前创建的节点
      const params = {
        genNum: 1,
        skd_prj_id: this.project.skd_prj_id || this.project.project_id
      }
      const res = await getTaskCode(params)
      if (res && res.flag) {
        if (this.$refs.formRef) {
          this.$refs.formRef.resetFields()
        }
        const code = res.data[0]
        const { type } = node.data
        const typeMap = {
          1: ['CHUNJUN', 'integration'],
          2: ['K8S', 'MLFLOW', 'Pytorch'],
          3: ['SPARK', 'FLINK', 'HIVECLI'],
          4: ['SQL'],
          5: ['Shell', 'SUB_PROCESS', 'PROCEDURE', 'PYTHON', 'DEPENDENT', 'HTTP', 'CONDITIONS', 'SWITCH']
        }

        let nodeType = ''
        for (const [key, value] of Object.entries(typeMap)) {
          if (value.includes(type)) {
            nodeType = parseInt(key)
            break
          }
        }

        let catalogid = ''
        switch (nodeType) {
          case 1:
            catalogid = this.findCatalogIdByName('数据集成')
            break
          case 2:
            catalogid = this.findCatalogIdByName('机器学习')
            break
          case 3:
            catalogid = this.findCatalogIdByName('数据处理')
            break
          case 4:
            catalogid = this.findCatalogIdByName('数据库')
            break
          case 5:
            catalogid = this.findCatalogIdByName('通用')
            break
        }

        this.form = {
          ...this.form,
          nodeType,
          type,
          id: node.id,
          catalogid,
          code
        }
        this.nodeVisible = true
      }
    },

    findCatalogIdByName (name) {
      // 存在文件夹
      return this.pathList.find(ele => ele.name === name).id
    },

    // 编辑节点
    editNode (node) {
      const type = node.data.type
      if (type === 'integration') {
        // 集成类型组件是一个画布
        this.nodeData = node.attrs.data
        this.$root.eventEmitter.emit('node-edit', this.nodeData)
      } else {
        // id 节点/边的唯一标识，推荐使用具备业务意义的 ID，默认使用自动生成的 UUID。
        // 激活节点数据回显
        this.nodeData = node.attrs.data
        // 获取画布节点及边信息
        this.getNodesAndEdges(node.id)
        this.$root.eventEmitter.emit('node-edit', this.nodeData)

        // this.componentName = type === 'SWITCH' ? 'SWITCH1' : type
        // this.dialogVisible = true
        // this.dialogTitle = `${type}节点设置`
      }
    },

    // 获取节点与边的信息
    getNodesAndEdges (id) {
      const nodes = this.graph.getNodes()
      const edges = this.graph.getEdges()

      const arr = nodes.map(ele => {
        return { label: ele.label, id: ele.id, code: ele.attrs.data.code }
      })

      // 前置任务 上游node/edge减少增加的场景
      // 1.节点删除增加 2.连接线删除前置任务 3.手动连接前置认知
      // 4.取消选中(主动)
      // 1、2、3 为上游节点变化 当前节点为 target 对应所有 source 节点 筛选 edges 获取id列表
      // form.task ---> 更新

      // 去掉已连线的下游节点
      const preTaskList = arr.filter(ele => ele.id !== id)
      this.nodeData.preTaskList = preTaskList

      // 前置节点
      let taskList = []
      let preList = []
      edges.forEach(edge => {
        const data = edge.store.data
        if (data.target.cell === id) {
          const sourceId = data.source.cell
          const item = arr.find(ele => ele.id === sourceId)
          taskList.push(item.id)
          preList.push(item)
        }
      })

      // 更新节点信息 --> 表单
      if (this.nodeData && this.nodeData.task) {
        this.nodeData.task = taskList
      }
      // 前置任务
      this.nodeData.preList = preList

      // 分支 下游节点 当前节点为 source 指向的所有 target 节点 筛选 edges 获取id列表
      let branchList = []
      edges.forEach(edge => {
        const data = edge.store.data
        if (data.source.cell === id) {
          const targetId = data.target.cell
          const item = arr.find(ele => ele.id === targetId)
          branchList.push(item)
        }
      })

      // 分支任务
      this.$set(this.nodeData, 'branchList', branchList)

      // 更新节点信息 下游节点变化 --> 表单
      if (this.nodeData && this.nodeData.successNode) {
        const data = branchList.filter(ele => ele.id === this.nodeData.successNode)
        if (!data.length) {
          this.nodeData.successNode = ''
        }
      }

      if (this.nodeData && this.nodeData.failedNode) {
        const data = branchList.filter(ele => ele.id === this.nodeData.failedNode)
        if (!data.length) {
          this.nodeData.failedNode = ''
        }
      }

      if (this.nodeData && this.nodeData.hiveCliTaskExecutionType) {
        const data = branchList.filter(ele => ele.id === this.nodeData.hiveCliTaskExecutionType)
        if (!data.length) {
          this.nodeData.hiveCliTaskExecutionType = ''
        }
      }

      if (this.nodeData && this.nodeData.dependTaskList && this.nodeData.dependTaskList.length) {
        this.nodeData.dependTaskList.forEach(item => {
          const data = branchList.filter(ele => ele.id === item.nextNode)
          if (!data.length) {
            item.nextNode = ''
          }
        })
      }

      // 注意: 直接使用props 会内存溢出 减小对象  ---> 统一在激活节点处理
      // this.nodes = nodes.map(ele => ele.id)
      // this.edges = edges.map(ele => ele.id)
    },

    // 自增长
    getNodeByType (type) {
      const nodes = this.graph.getNodes()
      let num = 0
      nodes.forEach(node => {
        if (node.data && node.data.type === type) {
          num++
        }
      })
      return num
    },

    initDnd () {
      // Dnd 是 Addon 命名空间中的一个插件，提供了基础的拖拽能力
      this.dnd = new Dnd({
        target: this.graph,
        validateNode () {
          return true
        }
      })
    },

    // 鼠标拖拽组件
    startDrag (e) {
      const target = e.currentTarget
      const type = target.getAttribute('data-type')
      this.createNode(e, type)
    },

    createNode (e, type) {
      const num = this.getNodeByType(type)
      // 创建节点 自动生成id
      let label = ''
      if (type === 'integration') {
        label = `集成_${num + 1}`
      } else {
        label = `${type}_${num + 1}`
      }
      const node = this.graph.createNode({
        shape: 'base-rect',
        label: label,
        attrs: {
          icon: {
            'xlink:href': require(`@/assets/images/task-icons/${type}.png`)
          },
          text: {
            fontWeight: 'bold',
            textAnchor: 'middle' // 将文本水平居中
            // dominantBaseline: 'middle' // 将文本垂直居中
          },
          // 节点信息
          data: {}
        },
        data: {
          type: type
        }
      })
      this.dnd.start(node, e)
    },

    // 取消节点创建
    handleNodeCancel () {
      this.graph.removeNode(this.addNode)
      this.nodeVisible = false
    },

    // 新建节点
    submitConfirm () {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          const { code, id, type, name, catalogid, nodeType } = this.form
          const params = {
            project_id: this.project.project_id,
            code,
            id,
            flowId: this.data.id, // 所属业务流程id
            name,
            type, // 类型
            nodeType, // 任务类型
            catalogid // 文件夹夹id
          }
          const res = await this.$simpleAsyncTo(saveTask(params), '新建节点失败')
          if (res) {
            this.$message({
              type: 'success',
              message: `${name} 节点新建成功`
            })
            this.nodeVisible = false
            // 更新节点名称
            this.addNode.attr('text', {
              text: this.form.name
            })
            this.form.flowId = this.data.id // 保存业务流程id
            // 更新节点信息
            this.addNode.attr('data', this.form)
          }
          // 刷新树表 ---> 新的节点
          this.$root.eventEmitter.emit('refresh')
        }
      })
    },

    // 节点确认
    handleConfirm () {
      this.$refs.comp.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.updateNode()
        }
      })
    },

    // 更新画布信息
    updateNode () {
      const form = this.$refs.comp.form
      // 更新节点 name
      this.activeNode.attr('text', {
        text: form.name
      })
      // 更新节点信息
      this.activeNode.attr('data', form)
      console.log('node-form', form)
      console.log('activeNode', this.activeNode)

      // 当前节点已经连接的前置任务 移除连接线
      const edges = this.graph.getEdges()
      const tmpEdges = edges.filter(edge => edge.target.cell === this.activeNode.id)
      tmpEdges.forEach(edge => {
        this.graph.removeEdge(edge)
      })

      // 前置节点id列表
      const preTask = form.task
      const nodes = this.graph.getNodes()
      // 当前激活节点
      const target = {
        cell: this.activeNode.id, // cell 基类 等同各node的id
        port: this.activeNode.port.ports[0].id // top right bottom left 链接顶部桩
      }
      // 前置任务连线
      preTask.forEach(id => {
        const data = nodes.find(ele => ele.id === id)
        const source = {
          cell: data.id,
          port: data.port.ports[2].id
        }
        this.graph.addEdge({
          source,
          target
        })
      })
    },

    // 缩放
    zoomIn () {
      this.scale += 1
      this.graph.scale(this.scale / 10)
    },
    zoomOut () {
      if (!this.scale) return
      this.scale -= 1
      this.graph.scale(this.scale / 10)
    },
    resetSize () {
      this.scale = 10
      this.graph.scale(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow-wrapper {
  .library {
    font-size: 14px;
    color: rgb(76, 76, 76);
    padding: 5px 10px 15px;
    cursor: pointer;
  }
  .nodePanel-btn {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 33px;
    line-height: 33px;
    padding: 0 8px;
    color: #4c4c4c;
    background: #fff;
    cursor: pointer;
    text-decoration: none;
  }
  .nodePanel-btn-visible {
    transform: translateX(-50px);
  }
  main {
    .side {
      padding-top: 45px;
      width: 160px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
  }
}
</style>

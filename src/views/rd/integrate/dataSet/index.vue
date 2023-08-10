
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
        <div class="mb-10">
          <span class="task-item">任务类型：</span>
          <el-select v-model="taskType" @change="selectTaskType">
            <el-option v-for="(item, index) in taskTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>

        <el-tabs tab-position="left">
          <el-tab-pane v-for="(item, index) in componentLibrary" :key="index" :label="item.componentTypeName">
            <div>
              <div class="task-type">{{item.componentTypeName}}（{{item.componentCount}}）</div>
              <div class="component-wrapper">
                <div v-for="(ele,i) in item.component" :key="i" @mousedown="startDrag" :data-type="formartNodeType(ele.componentCode)" class="item-library">
                  <img :src="require(`@/assets/images/rd/integrate/MySQL.png`)" alt="" class="menu-icon" />
                  <span>{{ele.componentName}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- <el-menu default-active="-1" :default-openeds="['1']">
          <template v-for="(list, index) in [componentList1, componentList2, componentList5, componentList3, componentList4]">
            <el-submenu :index='`${index}` + 1'>
              <template slot="title">
                <span>{{ categoryList[index] }}({{ list.length }})</span>
              </template>
              <el-menu-item v-for="(item, itemIndex) in list" :index="item.name" @mousedown.native="startDrag" :data-type="item.value" :key="itemIndex">
                <img :src="require(`@/assets/images/rd/integrate/${item.icon}.png`)" alt="" class="menu-icon" />
                {{ item.name }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu> -->
      </div>

      <!-- 缩放工具 -->
      <div class="tools-container">
        <span>{{ scale * 10 }}%</span>
        <span title="放大" @click="zoomIn"><i class="el-icon-zoom-in"></i></span>
        <span title="缩小" @click="zoomOut"><i class="el-icon-zoom-out"></i></span>
        <span title="重置" @click="resetSize"><i class="el-icon-full-screen"></i></span>
      </div>
    </main>

    <!-- 管理组件 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="dialogWidth">
      <component ref="comp" :is="componentName" :id="activeNode.id" :nodeData="nodeData" :nodes="nodes" :edges="edges" @setOptions="setOptions"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 右键菜单 -->
    <contextmenu v-show="contextmenuVisible" :position="contextmenuPosition" @menuClick="menuClick"></contextmenu>
  </div>
</template>

<script>
import { getcomponentlist, getTaskinfo } from '@/api/rd/data-collection'
import { Graph, Addon, Shape } from '@antv/x6'
import BaseRect from './shapes/rect'

// 输入组件 --->MySQL、TiDBL、SQL Server、Oracle、PostgreSQL、Sybase、达梦、GBase、ClickHouse
import mysqlreader from './components/import/MySQL.vue'
import tidbreader from './components/import/tidb.vue'
import sqlserverreader from './components/import/SQLServer.vue'
import oraclereader from './components/import/Oracle.vue'
import postgresqlreader from './components/import/PostgreSQL.vue'
import sybasereader from './components/import/sybase.vue'
import dmreader from './components/import/DM.vue'
import gbasereader from './components/import/gbase.vue'
import clickhousereader from './components/import/ClickHouse.vue'
import hivereader from './components/import/Hive.vue'
import kafkareader from './components/import/Kafka.vue'
import elasticsearchreader from './components/import/ElasticSearch.vue'
import hdfsreader from './components/import/Hdfs.vue'
import ftpreader from './components/import/Ftp.vue'
import filereader from './components/import/HostFile.vue' // 主机文件
import spooldirreader from './components/import/Flume.vue' // Flume 文件来源
import httpserverreader from './components/import/FlumeHttp.vue' // Flume Http来源
import localfilereader from './components/import/File.vue' // 本地文件
import hbasereader from './components/import/hbase.vue'
import icebergreader from './components/import/Iceberg.vue'

// 转换组件
import fieldselector from './components/convert/FieldSelected.vue' // 字段选择
import fieldcomputer from './components/convert/FieldCalculate.vue' // 字段计算
import fieldfilter from './components/convert/Filter.vue' // 过滤
import fieldencryption from './components/convert/Encryption.vue'
import fielddecryption from './components/convert/Decrypt.vue'
import fielddesensitization from './components/convert/Desensitization.vue' // 脱敏
import stringprocess from './components/convert/stringprocess.vue' // 字符串处理
import stringconcat from './components/convert/stringconcat.vue' // 字符串拼接
import dateprocess from './components/convert/dateprocess.vue' // 日期处理
import datetransform from './components/convert/datetransform.vue' // 日期转换
import iptransform from './components/convert/iptransform.vue' // ip转换
import domainextract from './components/convert/domainextract.vue' // 域名处理
import urlparse from './components/convert/urlparse.vue' // URL解析
import mathprocess from './components/convert/mathprocess.vue' // 数学函数
import hashprocess from './components/convert/hashprocess.vue' // 哈希函数
import sparkprocedure from './components/convert/SPARK.vue' // 哈希函数

// 文件组件
import filecompress from './components/file/compress.vue' // 文件压缩
import fileuncompress from './components/file/decompression.vue' // 文件解压

// 流程组件 ----> 必须是中间位置 不能是起始或结束
import dispatcher from './components/process/Distribute.vue' // 条件分发
import join from './components/process/Relevance.vue' // 关联
import mysqllookup from './components/process/mysqllookup.vue' // Mysql维表
import redislookup from './components/process/redislookup.vue' // Redis维表

// 输出组件 --->
import mysqlwriter from './components/export/MySQL.vue'
import tidbwriter from './components/export/tidb.vue'
import sqlserverwriter from './components/export/sqlserver.vue'
import postgresqlwriter from './components/export/postgresql.vue'
import gbasewriter from './components/export/gbase.vue'
import sybasewriter from './components/export/sybase.vue'
import dmwriter from './components/export/DM.vue'

import oraclewriter from './components/export/Oracle.vue'
import hivewriter from './components/export/Hive.vue'
import kafkawriter from './components/export/Kafka.vue'
import elasticsearchwriter from './components/export/ElasticSearch.vue'
import clickhousewriter from './components/export/ClickHouse.vue'
import ftpwriter from './components/export/Ftp.vue'
import hdfswriter from './components/export/Hdfs.vue' // 文件上传hdfs
import filehdfswriter from './components/export/filehdfswriter.vue'
import filewriter from './components/export/HostFile.vue' // 主机文件
import hbasewriter from './components/export/hbase.vue'
import icebergwriter from './components/export/Iceberg.vue'

// 右键菜单
import Contextmenu from './components/Contextmenu.vue'

const { Dnd } = Addon
function showPorts (ports, show) {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}
export default {
  name: 'flow-edit',
  props: {
    data: Object // 传入id
  },
  components: {
    mysqlreader,
    tidbreader,
    sybasereader,
    clickhousereader,
    kafkareader,
    elasticsearchreader,
    hdfsreader,
    postgresqlreader,
    hivereader,
    ftpreader,
    filereader,
    spooldirreader,
    httpserverreader,
    localfilereader,
    oraclereader,
    sqlserverreader,
    gbasereader,
    dmreader,
    hbasereader,
    icebergreader,
    fieldselector,
    fieldcomputer,
    fieldfilter,
    fieldencryption,
    fielddecryption,
    fielddesensitization,
    filecompress,
    fileuncompress,
    stringprocess,
    stringconcat,
    dateprocess,
    datetransform,
    iptransform,
    domainextract,
    urlparse,
    mathprocess,
    hashprocess,
    mysqllookup,
    redislookup,
    dispatcher,
    join,
    sparkprocedure,
    mysqlwriter,
    tidbwriter,
    sqlserverwriter,
    postgresqlwriter,
    gbasewriter,
    sybasewriter,
    dmwriter,
    oraclewriter,
    hivewriter,
    kafkawriter,
    elasticsearchwriter,
    clickhousewriter,
    ftpwriter,
    hdfswriter,
    filewriter,
    filehdfswriter,
    hbasewriter,
    icebergwriter,
    Contextmenu
  },
  data () {
    return {
      // Graph 实例
      graph: null,
      dnd: null,
      scale: 10,
      // 节点信息
      activeNode: {
        id: ''
      },
      activeCell: {},
      // 节点表单数据
      nodeData: {},
      contextmenuVisible: false,
      contextmenuPosition: { top: 0, left: 0 },
      // 节点编辑
      dialogVisible: false,
      dialogWidth: '1100px',
      dialogTitle: '',
      componentName: '',
      // 可能有更多的类型
      categoryList: ['输入', '转换', '流程', '文件', '输出'],
      // 输入组件
      componentList1: [
        { name: 'MySQL', value: 'mysqlreader', icon: 'MySQL' },
        { name: 'TiDB', value: 'tidbreader', icon: 'MySQL' },
        { name: 'SQL Server', value: 'sqlserverreader', icon: 'MySQL' },
        { name: 'Oracle', value: 'oraclereader', icon: 'ORACLE' },
        { name: 'PostgreSQL', value: 'postgresqlreader', icon: 'PostgreSQL' },
        { name: 'Sybase', value: 'sybasereader', icon: 'MySQL' },
        { name: '达梦', value: 'dmreader', icon: 'DM' },
        { name: 'GBase', value: 'gbasereader', icon: 'HBase' },
        { name: 'Hive', value: 'hivereader', icon: 'Hive' },
        { name: 'ClickHouse', value: 'clickhousereader', icon: 'Hive' },
        { name: 'Kafka', value: 'kafkareader', icon: 'Hive' },
        { name: 'ElasticSearch', value: 'elasticsearchreader', icon: 'Hive' },
        { name: 'Hdfs', value: 'hdfsreader', icon: 'Hive' },
        { name: 'Ftp', value: 'ftpreader', icon: 'Ftp' },
        { name: '主机文件', value: 'filereader', icon: 'Ftp' },
        { name: 'Flume文件', value: 'spooldirreader', icon: 'PolarDB' },
        { name: 'FlumeHttp服务', value: 'httpserverreader', icon: 'PolarDB' },
        { name: '本地文件', value: 'localfilereader', icon: 'CSV' },
        { name: 'Iceberg', value: 'icebergreader', icon: 'CSV' }
      ],
      // 转换组件
      componentList2: [
        { name: '字段选择', value: 'fieldselector', icon: 'FieldSelected' },
        { name: '字段计算', value: 'fieldcomputer', icon: 'Log' },
        { name: '过滤', value: 'fieldfilter', icon: 'LogicalTable' },
        { name: '字段加密', value: 'fieldencryption', icon: 'LogicalTable' },
        { name: '字段解密', value: 'fielddecryption', icon: 'LogicalTable' },
        { name: '字段脱敏', value: 'fielddesensitization', icon: 'LogicalTable' },
        { name: '字符串处理', value: 'stringprocess', icon: 'LogicalTable' },
        { name: '字符串拼接', value: 'stringconcat', icon: 'LogicalTable' },
        { name: '日期处理', value: 'dateprocess', icon: 'LogicalTable' },
        { name: '日期转换', value: 'datetransform', icon: 'LogicalTable' },
        { name: 'IP转换', value: 'iptransform', icon: 'LogicalTable' },
        { name: '域名提取', value: 'domainextract', icon: 'LogicalTable' },
        { name: 'URL解析', value: 'urlparse', icon: 'LogicalTable' },
        { name: '数学函数', value: 'mathprocess', icon: 'LogicalTable' },
        { name: '哈希函数', value: 'hashprocess', icon: 'LogicalTable' },
        { name: 'SPARK过程', value: 'sparkprocedure', icon: 'LogicalTable' }
      ],
      // 文件组件
      componentList5: [
        { name: '文件压缩', value: 'filecompress', icon: 'Compress' },
        { name: '文件解压', value: 'fileuncompress', icon: 'Decompression' }
      ],
      // 流程组件
      componentList3: [
        { name: '条件分发', value: 'dispatcher', icon: 'PolarDB' },
        { name: '关联', value: 'join', icon: 'PolarDB' },
        { name: 'Mysql维表', value: 'mysqllookup', icon: 'MySQL' },
        { name: 'Redis维表', value: 'redislookup', icon: 'MySQL' }
      ],
      // 输出组件
      componentList4: [
        { name: 'MySQL', value: 'mysqlwriter', icon: 'MySQL' },
        { name: 'TiDB', value: 'tidbwriter', icon: 'MySQL' },
        { name: 'SQL Server', value: 'sqlserverwriter', icon: 'MaxCompute' },
        { name: 'Oracle', value: 'oraclewriter', icon: 'MaxCompute' },
        { name: 'PostgreSQL', value: 'postgresqlwriter', icon: 'PostgreSQL' },
        { name: 'Sybase', value: 'sybasewriter', icon: 'MySQL' },
        { name: '达梦', value: 'dmwriter', icon: 'DM' },
        { name: 'GBase', value: 'gbasewriter', icon: 'HBase' },
        { name: 'Hive', value: 'hivewriter', icon: 'Hive' },
        { name: 'ClickHouse', value: 'clickhousewriter', icon: 'Hive' },
        { name: 'Kafka', value: 'kafkawriter', icon: 'Hive' },
        { name: 'ElasticSearch', value: 'elasticsearchwriter', icon: 'Hive' },
        { name: 'Hdfs', value: 'hdfswriter', icon: 'Hive' },
        { name: 'HBase', value: 'hbasewriter', icon: 'Hive' },
        { name: 'Ftp', value: 'ftpwriter', icon: 'Ftp' },
        { name: '文件上传Hdfs', value: 'filehdfswriter', icon: 'Hive' },
        { name: '主机文件', value: 'filewriter', icon: 'CSV' },
        { name: 'Iceberg', value: 'icebergwriter', icon: 'CSV' }
      ],
      // 输入组件
      readerList: [],
      // 转换组件
      transformList: [],
      // 流程组件
      flowLits: [],
      // 文件组件
      fileList: [],
      // 输出组件
      writerList: [],

      // 组件类型
      types: [],
      // 500px
      singleComs: ['ftpreader', 'filereader', 'fielddecryption', 'fieldencryption', 'fielddesensitization', 'filecompress', 'fileuncompress', 'filewriter', 'filehdfswriter'],
      // 800px
      convertComs: ['fieldselector', 'fieldcomputer', 'mysqlwriter', 'kafkareader', 'elasticsearchreader', 'hdfsreader', 'spooldirreader', 'httpserverreader', 'stringprocess', 'stringconcat'],
      nodes: [],
      edges: [],
      // ----->
      taskType: '3',
      oldTaskType: '',
      taskTypeList: [
        { name: '文件预处理', value: '1' },
        { name: '文件内容处理', value: '2' },
        { name: '离线同步', value: '3' },
        { name: '实时同步', value: '4' },
        { name: 'SPARK过程', value: '5' }
      ],
      componentList: [],
      componentLibrary: [],
      libraryList1: [],
      libraryList2: [],
      libraryList3: [],
      libraryList4: [],
      libraryList5: [],
      showNodePanel: true
    }
  },
  mounted () {
    this.configData()
    this.initGraph()
    this.initDnd()
    this.initEvent(this.graph)
    this.getGraphConfig()
    this.getcomponentData()
  },
  watch: {
    taskType (val, oldval) {
      this.oldTaskType = oldval
    }
  },
  methods: {
    configData () {
      this.types = {}
      const componentLists = [this.componentList1, this.componentList2, this.componentList3, this.componentList4, this.componentList5]
      componentLists.forEach(componentList => {
        componentList.forEach(ele => {
          this.types[ele.value] = { label: ele.name, icon: ele.icon }
        })
      })
      this.readerList = this.componentList1.map(ele => ele.value)
      this.transformList = this.componentList2.map(ele => ele.value)
      this.fileList = this.componentList5.map(ele => ele.value)
      this.flowLits = this.componentList3.map(ele => ele.value)
      this.writerList = this.componentList4.map(ele => ele.value)
    },

    // 关键词 filter
    formartNodeType (type) {
      return type === 'filter' ? 'fieldfilter' : type
    },

    async getcomponentData () {
      const res = await getcomponentlist()
      if (res) {
        this.componentList = res.data
        // 默认离线同步
        this.componentLibrary = this.componentList.find(ele => ele.taskType === this.taskType).componentLibrary
        // 任务类型是不固定，可以动态添加
        for (let i = 1; i <= 5; i++) {
          const componentLibrary = this.componentList.find(ele => ele.taskType === i.toString()).componentLibrary
          if (componentLibrary && componentLibrary.length) {
            componentLibrary.forEach(ele => {
              ele.component.forEach(item => {
                this['libraryList' + i].push(item.componentCode)
              })
            })
          }
        }
        // console.log('libraryList5', this.libraryList5)
      }
    },

    selectTaskType (val) {
      // 提示先删掉冲突的组件，即删除切换后任务类型没有的组件
      const flowData = this.graph.toJSON({ deep: true })
      console.log('flowData', flowData)
      const nodes = flowData.cells.filter(ele => ele.shape !== 'edge')
      const types = nodes.map(ele => {
        return { type: ele.data.type, name: ele.attrs.data.name }
      })
      console.log('types', types) // 当前画布存在的节点
      let names = types.map(ele => ele.name)
      const libraryLists = [this.libraryList1, this.libraryList2, this.libraryList3, this.libraryList4, this.libraryList5]
      if (['1', '2', '3', '4', '5'].includes(val)) {
        const index = Number(val) - 1
        types.forEach(ele => {
          const obj = libraryLists[index].find(item => item === ele.type)
          if (obj) {
            names = names.filter(item => item !== ele.name)
          }
        })
      }

      if (names.length) {
        this.$confirm(`任务类型变化, 组件 ${names} 存在冲突！请点击取消按钮返回画布手工删除冲突组件，或者点击清空按钮清空画布。`, '提示', {
          confirmButtonText: '清空',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 清空画布
          this.graph.fromJSON({})
          // 任务类型变化，二次确认
          this.componentLibrary = this.componentList.find(ele => ele.taskType === val).componentLibrary
        }).catch(() => {
          this.taskType = this.oldTaskType
          localStorage.setItem('taskType', this.taskType)
        })
      } else {
        localStorage.setItem('taskType', this.taskType)
        this.componentLibrary = this.componentList.find(ele => ele.taskType === val).componentLibrary
      }
    },

    // 画布数据回显
    async getGraphConfig () {
      const taskId = this.data ? this.data.id : ''
      if (!taskId) {
        return
      }
      localStorage.setItem('taskId', taskId)
      const res = await getTaskinfo({ taskId })
      await this.$sleep(300)
      if (res && res.data) {
        const { task, flowData } = res.data
        this.taskType = task.taskType
        this.componentLibrary = this.componentList.find(ele => ele.taskType === this.taskType).componentLibrary
        // ---->
        localStorage.setItem('taskType', this.taskType)
        if (flowData) {
          this.graph.fromJSON(flowData)
        }
      }
    },

    // 快捷操作事件
    menuClick (action) {
      this.contextmenuVisible = false
      if (action === 'delete') {
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.graph.removeNode(this.activeNode)
          // -----> 接口
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
        this.copyNode()
      }
    },

    copyNode () {
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
    },

    initGraph () {
      Graph.registerNode('base-rect-integrate', BaseRect, true)
      this.graph = new Graph({
        container: document.getElementById('container'),
        // 复制
        clipboard: {
          enabled: true,
          useLocalStorage: true
        },
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
            radius: 50
          },
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#84aff6', // 连接线颜色
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
      this.graph.on('node:mouseenter', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, true)
      })

      // 鼠标移出节点
      this.graph.on('node:mouseleave', ({ e, x, y, node, view }) => {
        const container = document.getElementById('container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, false)
        node.removeTools()
      })

      // 鼠标移入
      this.graph.on('edge:mouseenter', ({ e, x, y, edge, view }) => {
        edge.addTools({
          name: 'button-remove',
          args: {
            x: 0,
            y: 0
          }
        })
      })

      // 鼠标移出
      this.graph.on('edge:mouseleave', ({ e, x, y, edge, view }) => {
        edge.removeTools()
      })

      // 为节点添加右键菜单
      this.graph.on('node:contextmenu', ({ cell, e, node }) => {
        e.preventDefault()
        this.activeCell = cell
        this.activeNode = node
        this.contextmenuVisible = true
        this.contextmenuPosition = { top: e.clientY, left: e.clientX }
      })

      // 双击节点 编辑节点
      this.graph.on('node:dblclick', ({ e, x, y, node, view }) => {
        this.activeNode = node
        this.editNode(node)
      })

      // 单击节点 编辑节点
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        // console.log(node)
        // id 节点/边的唯一标识，推荐使用具备业务意义的 ID，默认使用自动生成的 UUID。
        // this.activeNode = node
      })

      // 节点添加到画布
      // graph.on('node:added', ({ node, index, options }) => {
      //   // const nodesAll = this.graph.getNodes()
      //   // this.editNode(node)
      //   // this.getCode(node)
      // })

      // 将节点从画布删除
      graph.on('node:removed', ({ node, index, options }) => {
        // const nodesAll = this.graph.getNodes()
      })

      // 边开始添加到画布
      graph.on('edge:added', ({ e, x, y, edge, view }) => {

      })

      // 链接桩连线事件  如开始 结束类 连线
      graph.on('edge:connected', ({ isNew, edge, view }) => {
        try {
          const sourceNode = edge.getSourceNode() // 获取边的源节点
          const targetNode = edge.getTargetNode() // 获取边的目标节点
          // 输入组件  转换组件  输出组件
          if (targetNode && this.readerList.includes(targetNode.data.type)) {
            this.$message.error('输入组件不支持上游节点')
            edge.remove()
          }
          if (sourceNode && this.writerList.includes(sourceNode.data.type)) {
            this.$message.error('输出组件不支持下游节点')
            edge.remove()
          }
        } catch (e) {
          this.$message.error(`${e}`)
          console.error(e)
        }
      })

      // 删除边事件
      graph.on('edge:removed', ({ edge, index, options }) => {

      })
    },

    editNode (node) {
      let type = node.data.type
      console.log('type', node.data.type)
      console.log('edit-node', node.attrs)
      // 激活节点数据回显
      this.nodeData = node.attrs.data
      // 获取画布节点及边信息
      this.getNodesAndEdges(node.id)
      this.componentName = JSON.parse(JSON.stringify(type))

      const selectedType = this.types[type].label
      if (this.readerList.includes(type)) {
        this.dialogTitle = `${selectedType}输入配置`
      } else if (this.writerList.includes(type)) {
        this.dialogTitle = `${selectedType}输出配置`
      } else {
        this.dialogTitle = `${selectedType}配置`
      }

      // 各类型组件弹窗宽度 ----->
      if (this.singleComs.includes(type)) {
        this.dialogWidth = '500px'
      } else if (this.convertComs.includes(type)) {
        this.dialogWidth = '900px'
      } else {
        this.dialogWidth = '1100px'
      }

      this.dialogVisible = true
    },

    // 获取节点与边的信息
    getNodesAndEdges (id) {
      const nodes = this.graph.getNodes()
      const edges = this.graph.getEdges()

      // 前置节点
      edges.forEach(edge => {
        const data = edge.store.data
        if (data.target.cell === id) {
          const sourceId = data.source.cell
          const preNode = nodes.find(ele => ele.id === sourceId)
          console.log('preNodeData', preNode.attrs.data)
          console.log('nodeData', this.nodeData)
          if (preNode.attrs.data && this.nodeData) {
            const { column, outputColumn } = preNode.attrs.data
            if (outputColumn && outputColumn.length) {
              // 转换组件 字段转换 新字段
              const newOutputColum = outputColumn.map(ele => {
                return {
                  name: ele.newname || ele.name,
                  type: ele.type
                }
              })
              this.nodeData.inputColumn = newOutputColum
            } else {
              this.nodeData.inputColumn = column
            }
          }
        }
      })
    },

    // 节点确认 属性编辑
    handleConfirm () {
      // filterWhere 和 filterCriterion 两个条件是互斥的，只能有一个
      this.$refs.comp.$refs.form.validate(valid => {
        if (valid) {
          const { form, filterType } = this.$refs.comp
          if (filterType) {
            form.filterCriterion = []
          } else {
            form.filterWhere = ''
          }

          // 更新节点 name
          this.activeNode.attr('text', {
            text: form.name
          })

          console.log('form', form)
          // 更新节点信息
          this.activeNode.attr('data', form)
          console.log('activeNode', this.activeNode)
          this.dialogVisible = false
        }
      })
    },

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
      this.dnd = new Dnd({
        target: this.graph,
        validateNode () {
          return true
        }
      })
    },

    startDrag (e) {
      const target = e.currentTarget
      let type = target.getAttribute('data-type')
      const label = this.types[type].label
      const icon = this.types[type].icon
      const num = this.getNodeByType(type)

      let nodeType = ''
      if (this.readerList.includes(type)) {
        nodeType = 'reader'
      } else if (this.transformList.includes(type)) {
        nodeType = 'transform'
      } else if (this.flowLits.includes(type)) {
        nodeType = 'flow'
      } else if (this.fileList.includes(type)) {
        nodeType = 'file'
      } else if (this.writerList.includes(type)) {
        nodeType = 'writer'
      }

      const node = this.graph.createNode({
        shape: 'base-rect-integrate',
        label: `${label}_${num + 1}`,
        attrs: {
          icon: {
            'xlink:href': require(`@/assets/images/rd/integrate/${icon}.png`)
          },
          text: {
            refX: 60,
            textAnchor: 'left'
          },
          // 节点信息
          data: {
            name: `${label}_${num + 1}`
          }
        },
        data: {
          type,
          nodeType
        }
      })
      this.dnd.start(node, e)
    },

    setOptions () {
      this.componentName = ''
      this.dialogTitle = ''
    },
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
    transform: translateX(-212px);
  }
  .side {
    padding-top: 45px;
    width: 320px;
    height: 100%;
    background-color: #fff;
    overflow: auto;
  }
}
.task-item {
  font-size: 14px;
  margin-left: 15px;
}
.task-type {
  font-size: 13px;
  margin-bottom: 10px;
}
.component-wrapper {
  display: flex;
  flex-wrap: wrap;
  .item-library {
    display: flex;
    width: 110px;
    margin-bottom: 10px;
    font-size: 12px;
    cursor: pointer;
    span {
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>

<template>
  <TableEditLayout class="sync-task-edit" :tabs="tabs" :buttons="btns" v-loading="!!loading" element-loading-text="运行中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 流程图 -->
    <DataSet v-if="!data.isNode" ref="dataSet" :data="data"></DataSet>

    <!-- 节点编辑 tab -->
    <template v-if="activeNode.isNode">
      <component :is="componentName" :id="activeNode.id" :nodeData="activeNode" ref="comp"></component>
    </template>

    <!-- 运行日志 -->
    <Log v-if="showOperation" :logData="logData" @hidden="showOperation = false" @refresh="getLog"></Log>

    <!-- 侧边栏 -->
    <SideModal :visible.sync="sideModelOption.visible" :title="sideModelOption.title" @confirm="sideModelOption.confirm">
      <component ref="sideComponent" :is="sideModelOption.component" :field-list="editFieldList" :data="sideModelOption.data"></component>
    </SideModal>

    <!-- 控制台 -->
    <div class="bottom-wrapper">
      <span class="mr-20 item-value" @click="handleLog">控制台</span>
      <span>
        <span class="mr-20">状态</span>
        <i class="iconfont font-14 mr-10" :class="getStausIcon(status)"></i>
        <span class="mr-10 item-value">{{ getStausName(status) }}</span>
        <span class="mr-20">最近保存</span>
        <span class="mr-20 item-value">{{ getOperTime(operTime) }}</span>
      </span>
    </div>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout-2'
import SideModal from '@c/side-modal'
import Log from './components/log.vue'

import DataSet from './dataSet/index.vue'
import integration from './dataSet/comps-new/integration.vue'
import Shell from './dataSet/comps-new/Shell.vue'
import SUB_PROCESS from './dataSet/comps-new/SUB_PROCESS.vue'
import PROCEDURE from './dataSet/comps-new/PROCEDURE.vue'
import SPARK from './dataSet/comps-new/SPARK.vue'
import FLINK from './dataSet/comps-new/FLINK.vue'
import PYTHON from './dataSet/comps-new/PYTHON.vue'
import DEPENDENT from './dataSet/comps-new/DEPENDENT.vue'
import HTTP from './dataSet/comps-new/HTTP.vue'
import CONDITIONS from './dataSet/comps-new/CONDITIONS.vue'
import SWITCH1 from './dataSet/comps-new/SWITCH.vue'
import CHUNJUN from './dataSet/comps-new/CHUNJUN.vue'
import HIVECLI from './dataSet/comps-new/HIVECLI.vue'
import SQL from './dataSet/comps-new/SQL.vue'
import K8S from './dataSet/comps-new/K8S.vue'
import MLFLOW from './dataSet/comps-new/MLFLOW.vue'
import Pytorch from './dataSet/comps-new/Pytorch.vue'

import { loop } from '@/libs/util'
import { mapGetters } from 'vuex'

import {
  startProcessInstance, // 节点运行
  publish, // 提交工作流
  save, // 保存工作流
  saveTask, // 保存节点
  getTask, // 获取节点信息
  publishTask, // 提交节点
  runTask,
  getLogs,
  getFlow
} from '@/api/rd/integrate'

// 画布顶部操作  ---- 集成任务 保存 运行 提交
import {
  saveTask as saveTask2,
  runTask as runTask2,
  submitTask
} from '@/api/rd/data-collection'

export default {
  name: 'ComputingTaskEdit',
  inject: ['tabStore'],
  props: {
    data: Object
  },
  components: {
    TableEditLayout,
    SideModal,
    Log,
    DataSet,
    integration,
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
    K8S,
    MLFLOW,
    Pytorch
  },
  data () {
    return {
      form: {},
      showOperation: false,
      loading: 0,
      tabs: [
        {
          preicon: 'iconfont icon-save color-btn',
          label: '保存',
          title: '保存',
          handler: this.handleSave,
          confirm: null,
          component: null,
          data: {}
        },
        {
          preicon: 'icon iconfont icon-fabu color-btn',
          label: '提交',
          title: '提交',
          handler: this.handlePublish,
          confirm: null,
          component: null,
          data: {}
        },
        {
          preicon: 'iconfont icon-zhihang color-btn',
          label: '运行',
          title: '运行',
          handler: this.handleOperation,
          confirm: null,
          component: null,
          data: {}
        }
      ],
      btns: [],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      editFieldList: [],
      logData: '',
      nodeId: '',
      componentName: '',
      activeNode: {},
      runId: '',
      operTime: '', // 操作时间
      status: 5 // 节点状态
    }
  },
  created () {

  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        if (val) {
          this.editNode(val)
        }
      }
    }
  },
  methods: {
    // 业务流程 & 节点
    editNode (val) {
      const type = val.object_type
      this.componentName = type === 'SWITCH' ? 'SWITCH1' : type
      this.activeNode = val
      if (val.node_type === '2') {
        this.getFlowData(val.id)
      } else {
        this.getTaskData(val.id)
      }
    },

    // 节点详情
    async getTaskData (id) {
      const res = await getTask({ id })
      if (res && res.flag) {
        const { status, operTime } = res.data
        this.status = status || 5
        this.operTime = operTime
      }
    },

    // 业务流程详情
    async getFlowData (id) {
      const res = await getFlow({ id })
      if (res && res.flag) {
        const { status, operTime } = res.data
        this.status = status || 5
        this.operTime = operTime
      }
    },

    getOperTime (val) {
      if (val) {
        const date = new Date(val)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const formattedDate = `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
        return formattedDate
      } else {
        return ''
      }
    },

    getStausName (val) {
      const data = {
        5: '草稿',
        6: '已发布',
        7: '开发中'
      }
      return data[val]
    },

    getStausIcon (val) {
      const data = {
        5: 'icon-caogao',
        6: 'icon-yifabu',
        7: 'icon-kaifazhe'
      }
      return data[val]
    },

    // 保存 ---> 画布信息 提交基本信息
    handleSave () {
      const { isNode, type } = this.data // node_type
      // 区分 画布 & 节点
      if (isNode && type !== 'integration') {
        // isNode ---> 保存到节点id
        this.$refs.comp.$refs.form.validate(valid => {
          if (valid) {
            const form = this.$refs.comp.form
            this.updateNode(form)
            // this.$root.eventEmitter.emit('update-node', form)
          }
        })
      } else {
        if (type === 'integration') {
          // 保存画布 ---- 集成任务
          this.updateIntergrationTask()
        } else {
          // 保存画布 ---- 业务流程
          this.updateFlow()
        }
      }
    },

    // 保存某一个节点
    async updateNode (form) {
      console.log('form', form)

      const { code, id, type, name, catalogid, flowId, ...config } = form
      const { sql, rawScript, json, hiveSqlScript } = config
      const sqlData = { sql, rawScript, json, hiveSqlScript }
      const configData = localStorage.getItem(code)
      let newConfig = {}
      if (configData) {
        const configJson = JSON.parse(configData)
        newConfig = {
          ...config,
          ...configJson,
          ...sqlData
        }
        // 移除时机是什么
        localStorage.removeItem(code)
      } else {
        newConfig = config
      }
      console.log('newConfig', newConfig)
      const params = {
        project_id: this.project.project_id,
        flowId, // 所属业务流程id
        code,
        id,
        name,
        type, // 类型 -----> 这个是有问题的
        catalogid, // 文件夹夹id
        config: JSON.stringify(newConfig)
      }

      const res = await saveTask(params)
      if (res && res.flag) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },

    // 配置提交参数
    getSubmitData () {
      const { graph, taskType } = this.$refs.comp.$refs.dataSet
      const flowData = graph.toJSON({ deep: true })
      console.log('node-data', flowData)
      // task 另一个接口获取
      const { code, id, name, flowId } = this.$refs.comp.form
      console.log('form', this.$refs.comp.form)

      let runParams = []
      const runParamsStr = localStorage.getItem(`runParams-${id}`)
      if (runParamsStr) {
        runParams = JSON.parse(runParamsStr)
      }

      let sysParams = {}
      const sysParamsStr = localStorage.getItem(`sysParams-${id}`)
      if (sysParamsStr) {
        sysParams = JSON.parse(sysParamsStr)
      }

      // 任务信息
      const task = {
        taskCode: code,
        id,
        name,
        flowId,
        taskType,
        projectId: this.project.project_id,
        cycleType: '1',
        taskDesc: '',
        flowNodeId: '',
        runParams, // 任务运行参数变量
        sysParams
      }
      return { task, flowData }
    },

    // 保存集成任务画布信息
    async updateIntergrationTask () {
      const params = this.getSubmitData()

      if (Object.keys(params.task.sysParams).length === 0) {
        this.$message({
          message: '请先配置运行参数再保存!',
          type: 'warning'
        })
        return
      }

      const res = await saveTask2(params)
      if (res && res.code === 0) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },

    // 保存业务流程画布信息
    async updateFlow () {
      const graph = this.$refs.dataSet.graph
      const flowData = graph.toJSON({ deep: true })
      console.log('node-data', flowData)
      const params = {
        id: this.data.id,
        projectId: this.project.project_id,
        flowData: JSON.stringify(flowData)
      }

      const res = await save(params)
      if (res && res.flag) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$root.eventEmitter.emit('refresh')
      } else {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    },

    // 发布 -- 节点 & 业务流程
    async handlePublish () {
      const { id, isNode, type } = this.data
      if (type === 'integration') {
        const params = this.getSubmitData()
        const res = await submitTask(params)
        const messageType = res && res.code === 0 ? 'success' : 'warning'
        const message = res && res.code === 0 ? '提交成功' : res.msg
        this.$message({ type: messageType, message: message })
      } else {
        const publishFunction = isNode ? publishTask : publish
        const res = await publishFunction({ id })
        const messageType = res && res.flag ? 'success' : 'warning'
        const message = res && res.flag ? '提交成功' : res.msg
        this.$message({ type: messageType, message: message })
      }
    },

    async handleOperation () {
      this.logData = ''
      const { isNode, type } = this.data
      if (type === 'integration') {
        this.operationIntergation()
      } else {
        isNode ? this.operationTask() : this.operationFlow()
      }
    },

    // 运行集成任务
    async operationIntergation () {
      const params = this.getSubmitData()
      const res = await runTask2(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '运行成功'
        })
      } else {
        this.$message({
          type: 'warning',
          message: res.msg
        })
      }
    },

    // 节点运行
    async operationTask () {
      const { id } = this.data
      this.loading++
      const res = await runTask({ id })
      this.loading--
      if (res && res.flag) {
        this.runId = res.data.runId
        setTimeout(() => {
          this.getLog()
        }, 5000)
      } else {
        this.$message({
          type: 'warning',
          message: res.msg
        })
      }
    },

    // 业务流程运行
    async operationFlow () {
      let skd_flow_id = this.data ? this.data.id : this.nodeId
      const { skd_prj_id } = this.$refs.dataSet.nodeInfo
      this.loading++
      await startProcessInstance({ skd_prj_id, skd_flow_id })
      this.loading--
      this.getLog()
    },

    // 获取日志
    handleLog () {
      this.showOperation = true
      this.getLog()
    },

    // 获取日志
    async getLog () {
      const { id } = this.data
      const res = await getLogs({ id, runId: this.runId })
      if (res && res.flag) {
        this.logData = res.data ? JSON.parse(res.data).message : ''
      } else {
        this.logData = ''
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
      this.showOperation = true
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-caogao {
  color: #ffad0a;
}
.icon-yifabu {
  color: #2bc048;
}
.icon-kaifazhe {
  color: #2e75ff;
}
.sync-task-edit {
  background-color: #eae9ee;
}

.bottom-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 20px;
  background: #434959;
  font-size: 12px;
  color: #999;
  .item-value {
    color: #fff;
  }
  span {
    cursor: pointer;
  }
}
</style>

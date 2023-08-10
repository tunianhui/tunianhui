
<template>
  <section class="side-panel-view" :style="active.style || {}">
    <div class="spv-main">
      <div class="title">
        <span class="name">{{active.attrType}}</span>
      </div>
      <template v-if="active.attrType == 'SWITCH'">
        <SWITCH1 :nodeData="form" ref="comp"></SWITCH1>
      </template>
      <template v-else>
        <component :is="active.attrType" :nodeData="form" ref="comp"></component>
      </template>
      <div class="side-modal-footer my-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" class="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getTask,
  saveTask
} from '@/api/rd/integrate'
import {
  getTaskinfo,
  saveTask as saveTask2
} from '@/api/rd/data-collection'
import mixin from '../mixin'
import './common.scss'

import Shell from './comps-new/Shell.vue'
import SUB_PROCESS from './comps-new/SUB_PROCESS.vue'
import PROCEDURE from './comps-new/PROCEDURE.vue'
import SPARK from './comps-new/SPARK.vue'
import FLINK from './comps-new/FLINK.vue'
import PYTHON from './comps-new/PYTHON.vue'
import DEPENDENT from './comps-new/DEPENDENT.vue'
import HTTP from './comps-new/HTTP.vue'
import CONDITIONS from './comps-new/CONDITIONS.vue'
import SWITCH1 from './comps-new/SWITCH.vue'
import CHUNJUN from './comps-new/CHUNJUN.vue'
import HIVECLI from './comps-new/HIVECLI.vue'
import SQL from './comps-new/SQL.vue'
import K8S from './comps-new/K8S.vue'
import MLFLOW from './comps-new/MLFLOW.vue'
import Pytorch from './comps-new/Pytorch.vue'
import integration from './comps-new/integration.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'ConfigView',
  mixins: [mixin],
  inject: ['attrStore', 'components'],
  components: {
    Shell,
    SUB_PROCESS,
    PROCEDURE,
    SPARK,
    FLINK,
    PYTHON,
    DEPENDENT,
    HTTP,
    CONDITIONS,
    SWITCH1,
    CHUNJUN,
    HIVECLI,
    SQL,
    K8S,
    MLFLOW,
    Pytorch,
    integration
  },
  data () {
    return {
      taskId: '',
      form: {},
      flowData: {}
    }
  },
  created () {

  },
  mounted () {
    this.form = {
      ...this.active.data // 这个值有问题 并不是当前激活 没有清除
    }

    if (this.form.type === 'integration') {
      console.log('integration-id-4', this.form.id)
      this.taskId = localStorage.getItem('taskId')
      console.log('integration-id-5', this.taskId)
      this.getFlowData(this.taskId)
    } else {
      this.getTaskData(this.form.id)
    }
    console.log('配置表单更新', this.form)
  },
  computed: {
    ...mapGetters(['project']),
    active () {
      // 刷新页面 不会触发更新
      return (this.attrStore && this.attrStore.states.list[0]) || {}
    },
    component () {
      return this.active.attrType
    }
  },
  watch: {
    active: {
      deep: true,
      handler (val) {
        console.log('form-data-5', val)
        if (val && val.data) {
          this.form = {
            ...val.data
          }
        }
      }
    }
  },
  methods: {
    // 关闭侧边栏
    cancel () {
      this.$root.eventEmitter.emit('hideSidebar')
    },

    async getTaskData (id) {
      const res = await getTask({ id })
      if (res) {
        const { config } = res.data
        let formData = config ? JSON.parse(config) : {}
        this.form = {
          ...this.form,
          ...formData
        }
      }
    },

    async getFlowData (taskId) {
      // 初始创建是空的
      const res = await getTaskinfo({ taskId })
      if (res && res.data) {
        const { task, flowData } = res.data
        this.flowData = flowData
        this.form = {
          ...task,
          ...task.sysParams,
          object_type: 'integration'
        }
      }
    },

    async updateNode (formData) {
      console.log('formData', formData)
      const { flowId, code, id, name, catalogid, object_type, ...config } = formData
      if (object_type === 'integration') {
        this.updateIntergrationTask(formData)
      } else {
        const params = {
          project_id: this.project.project_id,
          code,
          id,
          flowId, // 所属业务流程id
          name,
          catalogid, // 文件夹夹id
          type: object_type, // 类型
          config: JSON.stringify(config)
        }
        const res = await saveTask(params)
        if (res && res.flag) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          localStorage.setItem(code, JSON.stringify(config))
          // const updateNode = `updateNode-${object_type}`
          // this.$root.eventEmitter.emit(updateNode, formData)
          this.cancel()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      }
    },

    // 保存集成任务画布信息
    async updateIntergrationTask (formData) {
      const params = this.getSubmitData(formData)
      const res = await saveTask2(params)
      if (res && res.code === 0) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.cancel()
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },

    // 配置提交参数
    getSubmitData (formData) {
      // const { graph, taskType } = this.$refs.comp.$refs.dataSet
      const taskType = localStorage.getItem('taskType') || '3'
      // task 另一个接口获取
      console.log('form', this.$refs.comp.form)
      // code id 有问题
      const { code, id, name, flowId, type, runParams, yarnqueue, parallelism, yarnslots, yarntaskManagerNum, yarntaskManager, yarnjobManager, executorMemory, driverMemory, executorCores, numExecutors } = this.$refs.comp.form

      let sysParams = {}
      if (taskType === '5') {
        // SPARK过程任务
        sysParams = {
          executorCores,
          numExecutors,
          executorMemory,
          driverMemory,
          yarnqueue
        }
      } else {
        // 离线同步和实时同步
        sysParams = {
          yarntaskManagerNum,
          yarntaskManager,
          yarnjobManager,
          yarnslots,
          parallelism,
          yarnqueue
        }
      }

      // SPARK 过程 配置缓存
      localStorage.setItem(`runParams-${this.taskId}`, JSON.stringify(runParams))
      localStorage.setItem(`sysParams-${this.taskId}`, JSON.stringify(sysParams))

      // 任务信息
      const task = {
        taskCode: code,
        id: this.taskId,
        name,
        flowId,
        taskType,
        type,
        projectId: this.project.project_id,
        'cycleType': '1',
        'taskDesc': '',
        runParams, // 任务运行参数变量
        sysParams
      }
      return { task, flowData: this.flowData }
    },

    // 保存节点配置
    confirm () {
      this.$refs.comp.$refs.form.validate(valid => {
        if (valid) {
          const form = this.$refs.comp.form
          this.tempForm = JSON.parse(JSON.stringify(form))
          this.updateNode(form)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  font-size: 14px;
  font-weight: bold;
}
.side-modal-footer {
  margin: 15px 15px;
  float: right;
}
.form-content {
  margin-top: 10px;
  padding: 0 10px;
  background-color: #fff;
  .el-select,
  .el-textarea,
  .el-input-number,
  .el-input {
    width: 100%;
  }
}
</style>

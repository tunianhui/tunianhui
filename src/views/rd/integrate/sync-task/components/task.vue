<template>
  <el-dialog custom-class="rename-remove-edit-dialog" :title="title" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" v-draggable="{
      trigger: `.rename-remove-edit-dialog .el-dialog__header`,
      body: `.rename-remove-edit-dialog.el-dialog`,
      recover: false
    }">
    <el-form :model="form" label-suffix="：" label-width="100px" :rules="rules" ref="form">
      <el-form-item label="名称" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入任务名称" autocomplete="off" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" v-if="title !='重命名'">
        <el-input v-model="form.taskDesc" type="textarea" placeholder="请输入任务描述" :rows="4" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType" v-if="false">
        <el-select v-model="form.taskType">
          <el-option v-for="item in taskTypeList" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addTask } from '@/api/rd/data-collection'
import { getTaskCode } from '@/api/rd/integrate'

import { mapGetters } from 'vuex'
export default {
  name: 'Task',
  props: {
    title: {
      type: String,
      default: ''
    },
    editData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    editData: {
      deep: true,
      handler (val) {
        if (val) {
          this.form = this.editData
        }
      }
    }
  },
  data () {
    return {
      dialogFormVisible: true,
      taskTypeList: [
        { name: '文件预处理', value: 1 },
        { name: 'FLUME处理', value: 2 },
        { name: '离线同步', value: 3 },
        { name: '实时同步', value: 4 }
      ],
      form: {
        taskCode: '',
        projectId: '',
        taskDesc: '',
        taskName: '',
        taskType: 3
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: ['blur', 'change'] }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCode()
  },
  methods: {
    async getCode () {
      const params = {
        genNum: 1,
        skd_prj_id: this.project.skd_prj_id || this.project.project_id
      }
      const res = await getTaskCode(params)
      if (res && res.flag) {
        const code = res.data[0]
        this.form.taskCode = code
      }
    },
    // 提交
    submitConfirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          const { taskName, taskDesc, taskType, taskCode } = this.form
          const { project_id } = this.project
          let { parent_id, id } = this.editData
          const params = {
            task: { // 任务信息
              id: '', // 任务id
              taskName, // 任务名称
              taskDesc, // 任务描述
              projectId: project_id, // 归属项目
              taskType, // 任务类型:1-预处理2-FLUME处理 3离线同步 4-实时同步
              flowId: parent_id, // 调度流程id(数据中台流程的id)
              flowNodeId: '', // 调度流程节点id(数据中台流程节点的id)
              taskCode // 海豚调度生成对应任务节点的taskCode
            },
            flowData: {} // 任务流程图形信息
          }
          if (this.title.indexOf('编辑') > -1) {
            params.task.id = id
          }
          const res = await this.$simpleAsyncTo(addTask(params), '新建任务失败')
          if (res && res.flag) {
            this.$message({
              type: 'success',
              message: `${this.form.taskName} 任务新建成功`
            })
            this.close()
            this.$root.eventEmitter.emit('refresh')
          }
          this.globalLoading().close()
        }
      })
    },

    close () {
      this.$emit('close', false)
    }
  }
}
</script>

<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-31 11:11:47
 * @LastEditTime: 2023-06-30 15:04:02
 * @Description: 任务管理 各种弹窗操作
-->
<template>
  <el-dialog custom-class="rename-remove-edit-dialog" :title="title" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" v-draggable="{
      trigger: `.rename-remove-edit-dialog .el-dialog__header`,
      body: `.rename-remove-edit-dialog.el-dialog`,
      recover: false
    }">
    <el-form :model="form" label-suffix="：" label-width="100px" :rules="rules" ref="form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" :disabled="title.indexOf('移动') > -1" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <!-- <el-form-item label="描述"
                    v-if="title !='重命名'">
        <el-input v-model="form.taskDesc"
                  type="textarea"
                  placeholder="请输入任务描述"
                  :rows="4"
                  maxlength="200"
                  show-word-limit></el-input>
      </el-form-item> -->
      <el-form-item label="选择目录" v-if="title !='重命名'">
        <el-select v-model="form.catalogid" placeholder="请选择" ref="treeSelect" :disabled="title.indexOf('重命名') > -1" popper-class="select-tree">
          <el-option :label="form.file_catalog" :value="form.catalogid" style="max-height:auto;background-color:#fff">
            <el-tree :data="treeData" :props="defaultProps" :current-node-key="currentNodeKey" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick" ref="tree" style="font-weight:400">
            </el-tree>
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
import { saveFolder, moveFileOrFolder, renameFileOrFolder } from '@/api/rd/integrate'
import { addTask, renameTask, moveTask, cloneTask } from '@/api/rd/data-collection'

import task from './mixins'
import { mapGetters } from 'vuex'
export default {
  name: 'RenameRemove',
  mixins: [task],
  props: {
    title: {
      type: String
    },
    editData: {
      type: Object
    },
    taskType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        project_id: '',
        folder_desc: '',
        name: '',
        catalogid: '',
        file_catalog: ''
      },
      rules: {
        name: [
          { required: true, message: '名称为必填项', trigger: ['blur', 'change'] }
        ]
      },
      currentNodeKey: ''
    }
  },
  methods: {
    // 拆分各种情形
    submitConfirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()

          const { project_id } = this.project
          const { id } = this.editData
          const { name, catalogid } = this.form

          const isRename = this.title.indexOf('重命名') > -1
          const isMove = this.title.indexOf('移动') > -1
          const isClone = this.title.indexOf('克隆') > -1

          if (isMove) {
            const params = {
              taskId: id, // 任务id
              folderId: catalogid, // 新目标文件夹id
              flowId: '' // 新流程id
            }
            const res = await this.$simpleAsyncTo(moveTask(params), '移动失败')
            if (res) {
              this.$message.success('移动成功')
            }
          }

          if (isClone) {
            const params = {
              fromTaskId: id, // 原任务id
              taskName: name,
              flowNodeId: '', // 调度流程节点id(数据中台流程节点的id)
              taskCode: '',
              taskId: '', // 任务id
              folderId: catalogid, // 新目标文件夹id
              flowId: '' // 新流程id
            }
            const res = await this.$simpleAsyncTo(cloneTask(params), '克隆失败')
            if (res) {
              this.$message.success('克隆成功')
            }
          }

          if (isRename) {
            const params = {
              taskId: id,
              taskName: name
            }
            const res = await this.$simpleAsyncTo(renameTask(params), '重命名失败')
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 重命名成功`
              })
            }
          }

          this.$root.eventEmitter.emit('refresh')
          this.close()
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

<style lang="scss">
.select-tree {
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>

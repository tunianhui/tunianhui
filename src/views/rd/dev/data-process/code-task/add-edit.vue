<template>
  <SimpleEditDialog
    class="create-function"
    width="550px"
    :title="title"
    :visible="isVisible"
    confirmText="提交"
    @close="close"
    @confirm="confirm"
    parentClass="create-function"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="名称" prop="folder_name">
        <el-input
          v-model="form.folder_name"
          placeholder="请输入任务名称"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        label="调度类型"
        prop="job_mode"
        v-if="title.indexOf('文件夹') === -1"
      >
        <el-radio-group v-model="form.job_mode">
          <el-radio :label="'0'">周期性节点</el-radio>
          <el-radio :label="'1'">手动节点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="计算逻辑类型"
        prop="task_type_value"
        v-if="title.indexOf('文件夹') === -1"
      >
        <el-select
          v-model="form.task_type_value"
          placeholder="请选择"
          ref="treeSelect"
        >
          <el-option
            v-for="item in fileTypeOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
            style="padding-left:10px"
          ></el-option>
        </el-select>
        <!-- <el-radio-group v-model="form.fileType">
          <el-radio :label="'1'">SHELL</el-radio>
          <el-radio :label="'2'">SQL</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item label="描述" v-if="title.indexOf('文件夹') === -1">
        <el-input
          type="textarea"
          v-model="form.oper_desc"
          :rows="3"
          maxlength="120"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="选择目录">
        <el-select
          v-model="form.catalogid"
          placeholder="请选择"
          ref="treeSelect"
          popper-class="select-tree"
        >
          <el-option
            :label="form.file_catalog"
            :value="form.catalogid"
            style="max-height:auto;background-color:#fff"
          >
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :current-node-key="currentNodeKey"
              node-key="id"
              accordion
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="tree"
              style="font-weight: 400"
            >
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import task from './mixins'
import {getNewSaveFile} from '@/api/rd/code-task'

export default {
  name: 'CodeTaskEdit',
  mixins: [editDialog, task],
  inject: ['tabStore'],
  data() {
    return {
      form: {
        folder_name: '',
        job_mode: '0',
        task_type_value: '26',
        oper_desc: '',
        catalogid: ''
      },
      rules: {
        folder_name: [
          {required: true, message: '任务名称为必填项', trigger: 'blur'}
          // {
          //   pattern: /^[a-zA-Z]+$/u,
          //   trigger: ['blur', 'change'],
          //   message: '函数名称只能使用英文名'
          // }
        ],
        opsType: [{required: true, message: '请选择调度类型', trigger: 'blur'}],
        fileType: [{required: true, message: '请选择调度类型', trigger: 'blur'}]
      },
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      currentNodeKey: '',
      fileTypeOptions: [
        {id: '27', label: 'SHELL'},
        {id: '26', label: 'MAX_COMPUTE_SQL'}
      ]
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          let currentFileType = this.fileTypeOptions.filter(e => {
            return this.form.task_type_value === e.id
          })
          const params = {
            ...this.form,
            parent_id: this.form.catalogid,
            project_id: this.project.project_id,
            project_name: this.project.project_name,
            business_field_id: this.project.business_field_id,
            business_field_name: this.project.business_field_name,
            task_type: currentFileType[0].label
          }
          const res = await this.$simpleAsyncTo(
            getNewSaveFile(params),
            '新建文件失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.form.folder_name} 文件新建成功`
            })
          }
          this.close()
          this.$root.eventEmitter.emit('refresh')
          this.globalLoading().close()
        }
      })
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

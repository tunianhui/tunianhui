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
      <el-form-item label="选择目录">
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
import task from './taskMixins'
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
    submitConfirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          if (this.title.indexOf('移动') > -1) {
            const params = {
              id: this.editData.id,
              parent_id: this.form.catalogid
            }
            const res = await this.$simpleAsyncTo(moveFileOrFolder(params), '移动失败')
            if (res) {
              this.$message({
                type: 'success',
                message: '移动成功'
              })
            }
          } else if (this.title.indexOf('重命名') > -1) {
            const params = {
              id: this.editData.id,
              folder_name: this.form.name
            }
            const res = await this.$simpleAsyncTo(renameFileOrFolder(params), '重命名失败')
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 重命名成功`
              })
            }
          } else {
            const params = {
              project_id: this.project.project_id,
              folder_name: this.form.name,
              parent_id: this.form.catalogid
            }
            const res = await this.$simpleAsyncTo(saveFolder(params), '新建文件夹失败')
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 文件夹新建成功`
              })
            }
          }
          // 刷新树表
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

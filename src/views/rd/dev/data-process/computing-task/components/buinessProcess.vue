<template>
  <el-dialog custom-class="rename-remove-edit-dialog" :title="title" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" v-draggable="{
      trigger: `.rename-remove-edit-dialog .el-dialog__header`,
      body: `.rename-remove-edit-dialog.el-dialog`,
      recover: false
    }">
    <el-form :model="form" label-suffix="：" label-width="100px" :rules="rules" ref="form">
      <el-form-item label="业务名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入业务名称" autocomplete="off" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="catalogid">
        <el-select v-model="form.catalogid" placeholder="请选择路径" ref="treeSelect" popper-class="select-tree">
          <el-option :label="form.file_catalog" :value="form.catalogid" style="max-height:auto;background-color:#fff">
            <el-tree :data="treeData" :props="defaultProps" :current-node-key="currentNodeKey" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick" ref="tree" style="font-weight:400">
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入业务描述" :rows="4" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveFlow } from '@/api/rd/integrate'
import task from './taskMixins'
import { mapGetters } from 'vuex'
export default {
  name: 'BuinessProcess',
  mixins: [task],
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
      form: {
        projectId: '',
        remark: '',
        name: '',
        catalogid: ''
      },
      rules: {
        name: [
          { required: true, message: '名称为必填项', trigger: ['blur', 'change'] }
        ],
        catalogid: [
          { required: true, message: '路径为必填项', trigger: ['blur', 'change'] }
        ]
      },
      currentNodeKey: ''
    }
  },
  methods: {
    // 新建业务流程
    submitConfirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          if (this.title.indexOf('编辑') > -1) {
            const { name, remark, catalogid } = this.form
            const params = {
              id: this.editData.id,
              name, // 业务流程名称
              remark, // 备注
              catalogid, // 文件夹夹id
              projectId: this.project.project_id // 项目id
            }
            const res = await this.$simpleAsyncTo(saveFlow(params), '业务流程编辑失败')
            if (res && res.flag) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 编辑成功`
              })
              this.close()
              // 刷新树表
              this.$root.eventEmitter.emit('refresh')
            }
          } else {
            const { name, remark, catalogid } = this.form
            const params = {
              name, // 业务流程名称
              remark, // 备注
              catalogid, // 文件夹夹id
              projectId: this.project.project_id // 项目id
            }
            const res = await this.$simpleAsyncTo(saveFlow(params), '新建业务流程失败')
            if (res && res.flag) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 业务流程新建成功`
              })
              this.close()
              // 刷新树表
              this.$root.eventEmitter.emit('refresh')
            }
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

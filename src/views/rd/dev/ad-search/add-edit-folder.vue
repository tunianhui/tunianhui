<template>
  <el-dialog
    custom-class="add-edit-folder-dialog"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="35%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    v-draggable="{
      trigger: `.add-edit-folder-dialog .el-dialog__header`,
      body: `.add-edit-folder-dialog.el-dialog`,
      recover: false
    }"
  >
    <el-form :model="form" :rules="formRules" label-suffix="：" ref="form">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" :disabled="disabled" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" v-if="title.indexOf('重命名') === -1 && title.indexOf('移动') === -1">
        <el-input type="textarea" v-model="form.desc" maxlength="128" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="选择目录" :label-width="formLabelWidth" v-if="title.indexOf('重命名') === -1">
        <el-select v-model="form.catalogid" placeholder="请选择" ref="treeSelect">
          <el-option
            :label="form.file_catalog"
            :value="form.catalogid" style="max-height:auto;background-color:#fff">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :current-node-key="currentNodeKey"
              node-key="id"
              accordion
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="tree">
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitAddFolder">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getTreeData, getNewBuildFolder, getRename, moveFileOrFolder} from '@/api/rd/ad-search'
import {types, treeTypes} from '@/config/rd-config'
import {mapGetters} from 'vuex'
export default {
  name: 'AddEditFolder',
  props: {
    title: {
      type: String
    },
    editData: {
      type: Object
    }
  },
  inject: ['tabStore'],
  watch: {
    editData: {
      handler(val) {
        if (this.title.indexOf('移动') !== -1) {
          this.disabled = true
          this.form.name = this.editData.name
        }
        if (this.title.indexOf('重命名') !== -1) {
          this.list_disabled = true
          this.form.name = this.editData.name
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      form: {
        file_catalog: '',
        name: '',
        catalogid: '',
        desc: ''
      },
      formLabelWidth: '100px',
      dialogFormVisible: true,
      disabled: false,
      list_disabled: false,
      formRules: {
        name: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/,
            trigger: ['blur', 'change'],
            message: '只能输入汉字，英文或数字，不能数字开头'
          }
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      currentNodeKey: ''
    }
  },
  async created() {
    await this.getTreeData()
    if (this.title.indexOf('新建') < 0) {
      let result = this.getCurrentPart(this.editData.parent_id, this.treeData)
      this.form.file_catalog = result.name
      this.form.catalogid = result.id
      this.currentNodeKey = result.id
    }
    if (this.title === '新建文件夹') {
      if (this.treeData && this.treeData.length) {
        this.form.catalogid = this.treeData[0].id
        this.form.file_catalog = this.treeData[0].name
      }
    }
  },
  methods: {
    async getTreeData() {
      this.loading++
      const params = {
        folder_type: treeTypes[types.ADSEARCH],
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getTreeData(params), '获取树列表失败')
      if (res) {
        let data = res.data.child
        this.doDelete(data)
        this.treeData = [
          {
            id: res.data.id,
            node_type: res.data.node_type,
            name: res.data.name,
            child: data
          }
        ]
      }
      this.loading--
    },
    doDelete(treeData) {
      for (let i = treeData.length; i > 0; i--) {
        if (treeData[i - 1].node_type === '1' || treeData[i - 1].node_type === 1) {
          treeData.splice(i - 1, 1)
        } else {
          if (treeData[i - 1].child) {
            this.doDelete(treeData[i - 1].child)
          }
        }
      }
    },
    submitAddFolder() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.globalLoading()
          if (this.title.indexOf('新建') !== -1) {
            const params = {
              project_id: this.project.project_id,
              folder_name: this.form.name,
              parent_id: this.form.catalogid,
              folder_desc: this.form.desc
            }
            const res = await this.$simpleAsyncTo(getNewBuildFolder(params), '新建文件夹失败')
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 新建文件夹成功`
              })
            }
          } else if (this.title.indexOf('移动') !== -1) {
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
          } else {
            const params = {
              id: this.editData.id,
              folder_name: this.form.name
            }
            const res = await this.$simpleAsyncTo(getRename(params), '重命名失败')
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.form.name} 重命名成功`
              })
            }
          }
          this.close()
          this.$root.eventEmitter.emit('refresh')
          this.globalLoading().close()
        }
      })
    },
    handleNodeClick(data, node, e) {
      this.form.file_catalog = data.name
      this.form.catalogid = data.id
      this.$refs.treeSelect.blur()
    },
    close() {
      this.dialogFormVisible = false
      this.$emit('close', this.dialogFormVisible)
    },
    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          break
        } else if (item.child) {
          result = this.getCurrentPart(id, item.child)
        }
      }
      return result
    }
  }
}
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
</style>

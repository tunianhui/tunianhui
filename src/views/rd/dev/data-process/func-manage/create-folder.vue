<template>
  <SimpleEditDialog
    width="550px"
    :title="title"
    :visible="isVisible"
    confirmText="提交"
    @close="close"
    @confirm="confirm"
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" :disabled="title.indexOf('移动')>-1"></el-input>
      </el-form-item>
      <el-form-item
        label="选择目录"
        :label-width="formLabelWidth"
        prop="directory"
        v-if="title.indexOf('重命名')===-1"
      >
        <SelectTree
          :data="treeData"
          :field="{
            id: 'id',
            label: 'name',
            type: 'node_type',
            parent_id: 'parent_id',
            children: 'child'
          }"
          :defaultProps="{
            children: 'child',
            label: 'label'
          }"
          :curNode="parent_id"
          :isDirClick="true"
          @nodeClick="selectTreeNodeClick1"
        ></SelectTree>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import SelectTree from './select-tree.vue'
import {
  addFolder,
  moveFileAndDir,
  renameFileAndDir,
  getTreeData,
  renameFileOrFolder as newRenameFileOrFolder
} from '@/api/rd/func-manage.js'
import {
  addFolderSource,
  // moveFileAndDir,
  // renameFileAndDir,
  getTreeData as getTreeDataSource
} from '@/api/rd/source-manage.js'

import {
  saveFolder,
  getTreeData as syncTaskTreeData,
  saveTask,
  moveFuncOrFolder,
  renameFileOrFolder
} from '@/api/rd/sync-task.js'
export default {
  name: 'CreateFuncFolder',
  mixins: [editDialog],
  components: {
    SelectTree
  },
  inject: ['attrStore', 'tabStore'],
  props: {
    // callback: Function,
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: '',
        directory: '',
        file_catalog: ''
      },
      treeData: [],
      formLabelWidth: '120px',
      rules: {
        name: [
          {required: true, message: '请输入文件夹名称', trigger: 'blur'}
        ]
      },
      parent_id: '',
      parent_name: ''
    }
  },
  watch: {
    data: {
      handler(val) {
        if (this.title.indexOf('移动') !== -1) {
          // this.disabled = true
          this.form.name = val.data.label
        }
        if (this.title.indexOf('重命名') !== -1) {
          // this.list_disabled = true
          this.form.name = val.data.label
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this._getTreeData()
    this.parent_id = this.data.data ? this.data.data.parent_id : ''
    if (this.data.folder_type === '4') {
      this.rules.name.push({
        pattern: /^[\u4e00-\u9fa50-9a-zA-Z_]+$/,
        trigger: ['blur', 'change'],
        message: '名称由中文、下划线，数字，字母组成'
      })
    }
  },
  methods: {
    recursionTreeData(source, target) {
      source.forEach(item => {
        const {node_type, child, name} = item
        const treeItem = {
          ...item,
          label: name
        }
        if (child && child.length) {
          treeItem.child = []
          this.recursionTreeData(child, treeItem.child)
        }
        if (node_type === '0') {
          target.push(treeItem)
        }
      })
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.parent_id === '' && this.title.indexOf('移动') > -1) return this.$message({type: 'error', message: '请选择目录'})
          if (this.parent_id === '' && this.title.indexOf('新建') > -1) return this.$message({type: 'error', message: '请选择目录'})
          let res
          if (this.data.flag !== 'addTask') {
            if (this.title.indexOf('新建') > -1) {
              const params = {
                folder_name: this.form.name,
                project_id: this.data.project_id,
                parent_id: this.parent_id
              }
              let fn = null
              if (this.data.folder_type === '3') {
                fn = addFolder
              } else if (this.data.folder_type === '5') {
                fn = saveFolder
              } else {
                fn = addFolderSource
              }
              res = await this.$simpleAsyncTo(
                fn(params),
                '新建文件夹失败'
              )
            } else if (this.title.indexOf('移动') > -1) {
              let fn = null
              if (this.data.folder_type === '5') {
                fn = moveFuncOrFolder
              } else {
                fn = moveFileAndDir
              }
              const params = {
                id: this.data.data.id,
                parent_id: this.parent_id
              }
              res = await this.$simpleAsyncTo(
                fn(params),
                '移动文件夹失败'
              )
            } else {
              console.log(this.data)
              let fn = null
              if (this.data.sourceManage === 'sourceManage') {
                fn = newRenameFileOrFolder
              } else {
                if (this.data.folder_type === '5') {
                  fn = renameFileOrFolder
                } else {
                  fn = renameFileAndDir
                }
              }
              
              const params = {
                node_type: this.data.data.node_type,
                folder_name: this.form.name,
                id: this.data.data.id
              }
              res = await this.$simpleAsyncTo(fn(params), '重命名失败')
            }
          } else {
            const params = {
              ...this.data.data,
              folder_name: this.form.name,
              parent_id: this.parent_id,
              project_id: this.data.project_id,
              project_code: this.data.project_code,
              project_name: this.data.project_name
            }
            res = await this.$simpleAsyncTo(saveTask(params), '新建失败')
          }
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.title}成功！！!`
            })
            this.close()
            this.$root.eventEmitter.emit('refresh')
            if (this.data.flag === 'addTask') {
              this.tabStore.commit('remove', this.tabStore.states.active.name)
            }
          }
        }
      })
    },
    handleNodeClick(data, node, e) {
      this.form.file_catalog = data.name
      this.form.directory = data.id
      this.$refs.treeSelect.blur()
    },
    selectTreeNodeClick1(data) {
      this.parent_id = data.id
      this.parent_name = data.name
    },
    // 获取目录列表
    async _getTreeData() {
      const {
        project_id
      } = this.project
      let fn = null
      if (this.data.folder_type === '3') {
        fn = getTreeData
      } else if (this.data.folder_type === '4') {
        fn = getTreeDataSource
      } else if (this.data.folder_type === '5') {
        fn = syncTaskTreeData
      } else {
        fn = getTreeData
      }
      const res = await this.$simpleAsyncTo(
        fn({
          project_id,
          folder_type: this.data.folder_type
        }),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData([res.data], this.treeData)
      }
    }
  }
}
</script>

<style lang="scss">
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
</style>

<template>
  <el-dialog custom-class="rename-remove-edit-dialog" :title="title" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" v-draggable="{
      trigger: `.rename-remove-edit-dialog .el-dialog__header`,
      body: `.rename-remove-edit-dialog.el-dialog`,
      recover: false
    }">
    <el-form :model="form" label-suffix="：" label-width="100px" :rules="rules" ref="form">
      <el-form-item label="名称" prop="catalog_name">
        <el-input v-model="form.catalog_name" autocomplete="off" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="catalog_desc">
        <el-input v-model="form.catalog_desc" autocomplete="off" maxlength="32" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="选择目录" prop="parent_id">
        <el-select v-model="form.parent_id" placeholder="请选择" ref="treeSelect" popper-class="select-tree">
          <el-option :label="form.parent_name" :value="form.parent_id" style="max-height:auto;background-color:#fff">
            <el-tree :data="treeData" :current-node-key="currentNodeKey" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick" ref="tree" style="font-weight:400">
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
import {
  getTreeData
} from '@/api/asset/standard/dict.js'
import { addCatalog, editCatalog } from '@/api/asset/standard/category.js'
export default {
  name: 'RenameRemove111',
  props: {
    title: {
      type: String
    },
    editData: {
      type: Object
    }
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        catalog_name: '',
        catalog_desc: '',
        parent_id: '',
        folder_type: '0'
      },
      rules: {
        catalog_name: [
          { required: true, message: '名称为必填项' }
        ],
        parent_id: [
          { required: true, message: '请选择上级目录' }
        ]
      },
      currentNodeKey: '',
      treeData: []
    }
  },
  async created () {
    await this.getTreeData()
    if (this.title.indexOf('编辑') > -1) {
      this.form.catalog_name = this.editData.catalog_name
      this.form.catalog_desc = this.editData.catalog_desc
      const result = this.getCurrentPart(this.editData.parentId, this.treeData)
      this.form.parent_id = result.id
      this.form.parent_name = result.label
      this.currentNodeKey = result.id
    }
  },
  methods: {
    getCurrentPart (id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          console.log(result)
          break
        }
        if (item.children && item.children.length) {
          const text = this.getCurrentPart(id, item.children)
          if (text) {
            return text
          }
        }
      }
      return result
    },
    submitConfirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let fn = null, msg = ''
          const params = {
            ...this.form
          }
          if (this.title.indexOf('编辑') > -1) {
            fn = editCatalog
            params.catalog_id = this.editData.catalog_id
            msg = '编辑'
          } else {
            fn = addCatalog
            msg = '新增'
          }
          const res = await this.$simpleAsyncTo(fn(params), `${msg}失败`)
          if (res) {
            this.$message({
              type: 'success',
              message: `${msg}文件夹成功`
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
        }
      })
    },
    close () {
      this.$emit('close', false)
    },
    async getTreeData () {
      const res = await this.$simpleAsyncTo(
        getTreeData(),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData, 0)
      }
    },
    recursionTreeData (data, target) {
      data.forEach(item => {
        const { catalog_id, catalog_name, children, catalog_code, type } = item
        const treeItem = {
          label: catalog_name,
          ...item,
          id: catalog_id,
          code: catalog_code
        }
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        if (type === 'folder') {
          target.push(treeItem)
        }
      })
    },
    handleNodeClick (data, node) {
      this.form.parent_id = data.id
      this.form.parent_name = data.label
      this.$refs.treeSelect.blur()
    }
  }
}
</script>

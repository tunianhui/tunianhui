<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-07-31 11:33:58
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    width="680px"
  >
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <el-form-item label="类目名称" prop="name">
        <el-input
          v-model="filter.name"
          maxlength="32"
          show-word-limit
          placeholder="请输入类目名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类目英文名" prop="code">
        <el-input
          v-model="filter.code"
          maxlength="32"
          show-word-limit
          placeholder="请输入类目英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="category_desc">
        <el-input
          type="textarea"
          :rows="3"
          v-model="filter.category_desc"
          maxlength="128"
          show-word-limit
          placeholder="请输入描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择目录">
        <el-select
          v-model="filter.catalogid"
          placeholder="请选择"
          ref="treeSelect"
          popper-class="select-tree"
        >
          <el-option
            :label="filter.file_catalog"
            :value="filter.catalogid"
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
import {addCategory, editCategory, getTabCategoryList} from '@/api/rd/exreact/tag-center'
export default {
  name: 'CategoryEdit',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        code: '',
        name: '',
        desc: '',
        catalogid: ''
      },
      rules: {
        code: [
          {required: true, message: '请输入类目英文名'}
          // {
          //   pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
          //   message: '类目英文名只能用英文、数字、下划线组成，且开头必须是字母'
          // }
        ],
        name: {required: true, message: '请输入类目名称'}
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
    if (this.title.indexOf('编辑') > -1) {
      const result = this.getCurrentPart(this.data.parent_id, this.treeData)
      this.filter.catalogid = result.id
      this.filter.file_catalog = result.name
      this.currentNodeKey = result.id
    }
  },
  methods: {
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
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let params = {
            category_name: this.filter.name,
            category_code: this.filter.code,
            category_desc: this.filter.category_desc,
            project_code: this.project.project_code,
            project_name: this.project.project_name,
            parent_id: this.filter.catalogid
          }
          let fn = null
          if (this.title.indexOf('新建') > -1) {
            fn = addCategory
            params.id = ''
          } else {
            fn = editCategory
            params.id = this.filter.id
          }
          const res = await this.$simpleAsyncTo(fn(params), '操作失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
        }
      })
    },
    async getTreeData() {
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData([res.data], this.treeData)
        console.log(this.treeData)
      }
    },
    recursionTreeData(nodes, arr = []) {
      for (let item of nodes) {
        if (item.name === '工厂标签' || item.name === '手工标签') continue
        let obj = {...item, child: []}
        arr.push(obj)
        if (item.child && item.child.length) this.recursionTreeData(item.child, obj.child)
      }
      return arr
    },
    handleNodeClick(data, node) {
      this.filter.catalogid = data.id
      this.filter.file_catalog = data.name
      this.$refs.treeSelect.blur()
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

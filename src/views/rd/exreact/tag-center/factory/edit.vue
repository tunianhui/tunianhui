<!--
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-02-09 18:20:06
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    :confirmText="confirmText"
    :disabled="disabled"
  >
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标签英文名" prop="label_code">
            <el-input
              v-model="filter.label_code"
              maxlength="32"
              show-word-limit
              placeholder="请输入标签英文名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签名称" prop="label_name">
            <el-input
              v-model="filter.label_name"
              maxlength="32"
              show-word-limit
              placeholder="请输入标签名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="label_desc">
        <el-input
          type="textarea"
          v-model="filter.label_desc"
          maxlength="128"
          show-word-limit
          placeholder="请输入描述"
          :rows="3"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属类目" prop="cate">
        <el-select v-model="filter.cate" placeholder="请选择所属类目">
          <el-option
            v-for="item in cates"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择目录">
        <el-select
          v-model="filter.catalogid"
          placeholder="请选择"
          ref="treeSelect"
          popper-class="select-tree"
        >
          <el-option
            :label="filter.category_name"
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
      <el-form-item label="公开状态" prop="auth_status">
        <el-radio-group v-model="filter.auth_status">
          <el-radio
            v-for="item in statusList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结果表名">
        <div class="flex-layout">
          <span>
            {{ prefixTable }}
          </span>
          <el-input
            class="flex-1"
            v-model="filter.label_table"
            maxlength="32"
            show-word-limit
            placeholder="请输入结果表名"
            :disabled="title.indexOf('编辑') > -1 ? this.data.status + '' !== '5' : false"
          />
        </div>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {
  getTabCategoryList,
  update,
  insert
} from '@/api/rd/exreact/tag-center'

export default {
  name: 'TagFactoryEditDialog',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        label_code: '',
        label_name: '',
        label_desc: '',
        cate: '',
        auth_status: '',
        label_table: '',
        catalogid: ''
      },
      rules: {
        label_code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_0-9]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        label_name: [
          {required: true, message: '请输入名称'}
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z_\-0-9]*$/,
          //   message:
          //     '名称由英文、数字、下划线(_)或短划线(-)组成，且开头必须是字母'
          // }
        ],
        tablename: {required: true}
      },
      prefixTable: 'Data_distill_',
      cates: [],
      statusList: [
        {value: '0', label: '公开'},
        {value: '1', label: '私有'}
      ],
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      currentNodeKey: '',
      confirmText: '确定',
      disabled: false
    }
  },
  async created() {
    this.prefixTable = this.project.project_code + '_'
    await this.getTreeData()
    if (this.title.indexOf('编辑') > -1) {
      console.log(this.data)
      this.filter.catalogid = this.data.category_id
      this.filter.category_name = this.data.category_name
      this.currentNodeKey = this.data.category_id
      this.prefixTable = this.data.project_code + '_'
      this.filter.label_table = this.filter.label_table.substring(this.prefixTable.length)
    }
  },
  mounted() {
  },
  methods: {
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let params = {
            label_code: this.filter.label_code,
            label_name: this.filter.label_name,
            label_desc: this.filter.label_desc,
            label_category: this.filter.category_name,
            category_id: this.filter.catalogid,
            auth_status: this.filter.auth_status,
            label_table: this.prefixTable + this.filter.label_table,
            project_code: this.filter.project_code,
            project_id: this.filter.project_id,
            business_field_id: this.filter.business_field_id
          }
          let fn = null
          if (this.title.indexOf('编辑') > -1) {
            fn = update
            params.id = this.filter.id
          }
          if (this.title.indexOf('新建') > -1) {
            fn = insert
            params.project_name = this.filter.project_name
            params.business_field_name = this.filter.business_field_name
          }
          this.confirmText = '提交中...'
          this.disabled = true
          const res = await this.$simpleAsyncTo(fn(params), '编辑失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          } else {
            this.confirmText = '确定'
            this.disabled = false
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
        this.recursionTreeData(res.data.child, this.treeData)
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
      this.filter.category_name = data.name
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

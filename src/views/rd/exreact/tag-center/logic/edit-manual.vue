<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-08-11 09:42:14
 * @LastEditTime: 2020-08-11 11:38:05
 * @Description:
-->
<template>
  <SimpleEditDialog
    title="编辑手工标签"
    :visible.sync="isVisible"
    confrim-text="提交"
    @close="close"
    @confirm="confirm"
    top="10vh"
  >
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-suffix="："
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="标签英文名" prop="label_code">
            <el-input
              v-model="filter.label_code"
              placeholder="请输入标签英文名"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签名称" prop="label_name">
            <el-input
              v-model="filter.label_name"
              placeholder="请输入标签名称"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="label_desc">
        <el-input
          type="textarea"
          :rows="3"
          :maxlength="128"
          show-word-limit
          v-model="filter.label_desc"
          placeholder="请填写描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属类目" prop="label_category">
        <el-select v-model="filter.label_category" placeholder="请选择所属类目">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :value="item.category_name"
            :label="item.category_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公开状态" prop="auth_status">
        <el-select v-model="filter.auth_status" placeholder="请选择公开状态">
          <el-option
            v-for="item in authStatusList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {
  queryCategory,
  editManual
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'EditManual',
  inheritAttrs: false,
  mixins: [editDialog],
  data() {
    return {
      filter: {
        label_name: '',
        label_code: '',
        label_desc: '',
        label_category: '',
        auth_status: ''
      },
      rules: {
        label_name: {required: true, message: '请输入标签名称'},
        label_code: {required: true, message: '请输入标签英文名'}
      },
      categoryList: [],
      authStatusList: [
        {
          label: '公开',
          value: '0'
        },
        {
          label: '隐藏',
          value: '1'
        }
      ]
    }
  },
  mounted() {
    this._queryCategory()
  },
  methods: {
    async _queryCategory() {
      const res = await this.$simpleAsyncTo(queryCategory({project_code: this.project.project_code}))
      if (res) {
        this.categoryList = res.data
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = {
            label_id: this.data.label_id,
            auth_status: this.filter.auth_status,
            label_desc: this.filter.label_desc,
            label_category: this.filter.label_category
          }
          const res = await this.$simpleAsyncTo(editManual(params), '编辑失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.$emit('confirm')
            this.close()
          }
        }
      })
    },
    close() {
      const form = this.$refs[this.formRef]
      form && form.resetFields()
      // this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

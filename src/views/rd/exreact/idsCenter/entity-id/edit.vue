<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 10:04:55
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-03-03 13:50:30
 * @FilePath: \智能BId:\项目\数据智能构建\src\views\rd\exreact\idsCenter\entity-id\edit.vue
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
      <el-form-item label="ID名称" prop="idName">
        <el-input
          v-model="filter.idName"
          maxlength="32"
          show-word-limit
          placeholder="请输入ID名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="ID英文名" prop="idType">
        <el-input
          v-model="filter.idType"
          maxlength="32"
          show-word-limit
          placeholder="请输入ID英文名"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属ID类目" prop="cate">
        <el-select v-model="filter.cate" placeholder="请选择所属类目" disabled>
          <el-option
            v-for="item in cates"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          type="textarea"
          v-model="filter.remark"
          maxlength="128"
          show-word-limit
          placeholder="请输入描述"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>
<script>
import editDialog from '@/mixins/edit-dialog'
import { addIdEntity, saveIdEntity } from '@/api/rd/exreact/entity-id'
export default {
  name: 'IdEditCreate',
  mixins: [editDialog],
  data() {
    return {
      confirmText: '确定',
      disabled: false,
      isEdit: false,
      filter: {
        idName: '',
        idType: '',
        cate: '默认',
        remark: ''
      },
      cates: [],
       rules: {
        idType: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_0-9]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        idName: [
          {required: true, message: '请输入名称'}
        ],
        cate: {required: false}
      },
    }
  },
  created() {
    if (JSON.stringify(this.data) === '{}') {
      this.isEdit = false
    } else {
      this.filter.idName = this.data.idName
      this.filter.idType = this.data.idType
      this.filter.remark = this.data.remark
      this.filter.id = this.data.id
      this.isEdit = true
    }
  },
  methods: {
    confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = {
            idType: this.filter.idType,
            idName: this.filter.idName,
            remark: this.filter.remark
          }
          let fn = null
          if (JSON.stringify(this.data) === '{}') {
            fn = addIdEntity
          } else {
            fn = saveIdEntity
            params.id = this.filter.id
          }
          const res = await this.$simpleAsyncTo(
            fn(params),
            '保存失败'
          )
          if (res) {
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
        }
      })
     
    }
  }
}
</script>
<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-07-31 11:37:43
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    width="580px"
  >
    <div class="label mb-20" v-if="title.includes('编辑')">
      <i class="el-icon-info"></i>
      不建议您对元素本意进行大幅变动，大幅变动将对已生成行为数据含义产生影响。如：您可以把“看”改为“观赏”，但不建议把“看”改为听，如需“听”建议您另新建一个元素。
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <el-form-item label="行为域英文名" prop="bfCode">
        <el-input
          v-model="filter.bfCode"
          maxlength="32"
          show-word-limit
          placeholder="请输入行为域英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="行为域名称" prop="bfName">
        <el-input
          v-model="filter.bfName"
          maxlength="32"
          show-word-limit
          placeholder="请输入行为域名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="filter.remark"
          type="textarea"
          :rows="3"
          maxlength="128"
          show-word-limit
          placeholder="请输入描述"
        ></el-input>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import { insertDomain, updateDomain } from '@/api/rd/exreact/domain-bus'
export default {
  name: 'DomainEdit',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        bfCode: '',
        bfName: '',
        remark: ''
      },
      rules: {
        bfCode: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_0-9]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        bfName: [
          {required: true, message: '请输入名称'}
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z_\-0-9]*$/,
          //   message:
          //     '名称由英文、数字、下划线(_)或短划线(-)组成，且开头必须是字母'
          // }
        ]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filter.bfCode = this.data.displayName
          this.filter.bfName = this.data.name
          this.filter.remark = this.data.des
        }
      }
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let fn
          const {bfCode, bfName, remark} = this.filter
          const params = {bfCode, bfName, remark}
          if (this.title.includes('新建')) {
            fn = insertDomain
          } else {
            fn = updateDomain
            params.id = this.filter.id
          }
          const res = await this.$simpleAsyncTo(fn(params), `${this.title}失败`)
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.title}成功`
            })
            this.close()
            this.$root.eventEmitter.emit('refresh')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>

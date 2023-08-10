<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-19 14:20:21
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    v-loading="!!loading"
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
      <el-form-item label="动作英文名" prop="actCode">
        <el-input
          v-model="filter.actCode"
          maxlength="32"
          show-word-limit
          placeholder="请输入动作英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="动作名称" prop="actName">
        <el-input
          v-model="filter.actName"
          maxlength="32"
          show-word-limit
          placeholder="请输入动作名称"
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
import {insert, update} from '@/api/rd/exreact/action'

export default {
  name: 'ActionEdit',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        actCode: '',
        actName: '',
        remark: ''
      },
      rules: {
        actCode: [
          {required: true, message: '请输入动作英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        actName: {required: true, message: '请输入名称'}
      }
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading++
          const flag = this.title.includes('编辑'),
            fetchFn = flag ? update : insert,
            label = flag ? '编辑' : '新建',
            {actCode, actName, remark, id} = this.filter

          const res = await this.$simpleAsyncTo(
            fetchFn({
              actCode,
              actName,
              remark,
              id
            }),
            `${label}行为动作失败`
          )
          if (res) {
            this.$message({
              message: `${label}行为动作成功`,
              type: 'success'
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
          this.loading--
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>

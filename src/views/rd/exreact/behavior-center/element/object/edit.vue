<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-21 10:20:45
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
      <el-form-item label="对象英文名" prop="objectCode">
        <el-input
          v-model="filter.objectCode"
          maxlength="32"
          show-word-limit
          placeholder="请输入对象英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="对象名称" prop="objectName">
        <el-input
          v-model="filter.objectName"
          maxlength="32"
          show-word-limit
          placeholder="请输入对象名称"
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
import {insert, update} from '@/api/rd/exreact/object'

export default {
  name: 'ObjectEdit',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        objectCode: '',
        objectName: '',
        remark: ''
      },
      rules: {
        objectCode: [
          {required: true, message: '请输入对象英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '对象英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        objectName: {required: true, message: '请输入对象名称'}
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
            {objectCode, objectName, remark, id} = this.filter

          const res = await this.$simpleAsyncTo(
            fetchFn({
              objectCode,
              objectName,
              remark,
              id
            }),
            `${label}对象失败`
          )
          if (res) {
            this.$message({
              message: `${label}对象成功`,
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

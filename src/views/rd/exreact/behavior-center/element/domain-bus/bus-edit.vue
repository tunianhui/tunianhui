<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-07-31 11:36:20
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
      <el-form-item label="行为域" prop="bfId">
        <el-select v-model="filter.bfId" placeholder="请选择行为域">
          <el-option
            v-for="domain in domains"
            :key="domain.id"
            :value="domain.id"
            :label="domain.bfName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务线英文名" prop="busiCode">
        <el-input
          v-model="filter.busiCode"
          maxlength="32"
          show-word-limit
          placeholder="请输入业务线英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务线名称" prop="busiName">
        <el-input
          v-model="filter.busiName"
          maxlength="32"
          show-word-limit
          placeholder="请输入业务线名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          type="textarea"
          :rows="3"
          v-model="filter.remark"
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
import { getDomainListAll, insertBus, updateBus } from '@/api/rd/exreact/domain-bus'
export default {
  name: 'BusEdit',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        bfId: '',
        busiCode: '',
        busiName: '',
        remark: ''
      },
      rules: {
        bfId: {required: true, message: '请选择行为域'},
        busiCode: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        busiName: [
          {required: true, message: '请输入名称'}
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z_\-0-9]*$/,
          //   message:
          //     '名称由英文、数字、下划线(_)或短划线(-)组成，且开头必须是字母'
          // }
        ]
      },
      domains: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filter.bfId = this.data.domainId
          this.filter.busiCode = this.data.displayName
          this.filter.busiName = this.data.name
          this.filter.remark = this.data.des
        }
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await this.$simpleAsyncTo(getDomainListAll(), '获取数据失败')
      if (res) {
        this.domains = res.data
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let fn
          const {bfId, busiCode, busiName, remark} = this.filter
          const params = {bfId, busiCode, busiName, remark}
          if (this.title.includes('新建')) {
            fn = insertBus
          } else {
            fn = updateBus
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

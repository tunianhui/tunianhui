<template>
  <el-dialog
    custom-class="derive-edit-dialog"
    title="编辑派生指标"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="beforeClose"
    top="10vh"
    width="750px"
    v-draggable="{
      trigger: '.derive-edit-dialog .el-dialog__header',
      body: '.derive-edit-dialog.el-dialog',
      recover: false
    }"
  >
    <el-form
      ref="form"
      :model="form"
      label-suffix="："
      label-position="right"
      label-width="135px"
      :style="`max-height: ${dialogBodyHeight}px; overflow: auto;`"
    >
      <el-form-item label="派生指标英文名" prop="derivative_code">
        <el-input v-model="form.derivative_code" disabled>
          <!-- prefix -->
          <!-- <template slot="prepend">Http://</template> -->
        </el-input>
      </el-form-item>
      <el-form-item
        label="派生指标名称"
        prop="derivative_name"
        :rules="{required: true, message: '请输入派生指标名称'}"
      >
        <el-input
          v-model="form.derivative_name"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="derivative_desc">
        <el-input
          type="textarea"
          v-model="form.derivative_desc"
          maxlength="128"
          show-word-limit
        ></el-input>
      </el-form-item>
      <template v-if="showUnionAttrFlag">
        <h5 class="sub-title mb-10">联合属性({{ form.unionData.length }})</h5>
        <el-table :data="form.unionData" stripe>
          <el-table-column
            label="统计粒度"
            prop="dim_info"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="联合属性内容" prop="union_attr">
            <template #default="scope">
              <el-row
                v-for="(attr, index) in scope.row.union_attr"
                :key="attr.id"
              >
                <el-form-item
                  label-width="0"
                  :prop="
                    `unionData.${scope.$index}.union_attr.${index}.element_code`
                  "
                  :rules="[
                    {
                      validator: (rule, value, callback) =>
                        validateUnionAttrRepeate(
                          scope.row,
                          attr,
                          value,
                          callback
                        ),
                      trigger: 'change'
                    }
                  ]"
                >
                  <!-- enRules, -->
                  <el-input
                    v-model="attr.element_code"
                    maxlength="32"
                    show-word-limit
                  >
                    <template slot="prepend">
                      <OverflowTooltip :max-width="120"
                        >{{ attr.dim_code }}.</OverflowTooltip
                      >
                    </template>
                  </el-input>
                </el-form-item>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="mb-20"></div>
    </el-form>
    <div slot="footer">
      <el-button type="default" @click.stop="beforeClose">取消</el-button>
      <el-button type="primary" @click.stop="saveHandle">保存</el-button>
      <el-button type="primary" @click.stop="publishHandle">发布</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {edit, deriveIndexPublish, queryUnionAttrInfo} from '@/api/rd/derive'
import editDialog from '@/mixins/edit-dialog'
import OverflowTooltip from '@c/overflow-tooltip'
// import {types} from '@/config/rd-config'

export default {
  name: 'DeriveEditDialog',
  mixins: [editDialog],
  components: {OverflowTooltip},
  data() {
    return {
      form: {
        derivative_code: '',
        derivative_name: '',
        derivative_desc: '',
        unionData: []
      },
      showUnionAttrFlag: false
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        const {code, name, derivative_desc, id} = val || {}
        this.form.derivative_code = code
        this.form.derivative_name = name
        this.form.derivative_desc = derivative_desc
        this.form.id = id
        this.getUnionData()
      }
    }
  },
  methods: {
    validate() {
      let flag
      this.$refs.form.validate(valid => {
        flag = valid
      })
      return flag
    },
    validateUnionAttrRepeate(row, attr, value, callback) {
      const rows = row.union_attr.filter(
        item => item.dim_code + item.element_code === attr.dim_code + value
      )
      if (rows.length >= 2) {
        callback(new Error('联合属性重复'))
      }
      callback()
    },
    getUnionAttr() {
      const {unionData} = this.form
      if (unionData && unionData[0] && unionData[0].union_attr) {
        return unionData[0].union_attr
          .map(
            d => `${d.dim_code}.${d.element_code}@${d.id}@${d.rel_element_id}`
          )
          .join('&')
      }
      return null
      // return unionData[0].union_attr.map(d => `${d.dim_code}.${d.element_code}@${d.id}@${d.rel_element_id}`).join('&')
    },
    async getUnionData() {
      const res = await this.$simpleAsyncTo(
        queryUnionAttrInfo({id: this.form.id}),
        '获取单个派生指标联合属性失败'
      )
      if (res) {
        const {whetherShowUnionAttrFlag, unionAttrData} = res.data
        this.showUnionAttrFlag = whetherShowUnionAttrFlag
        this.form.unionData = unionAttrData
      }
    },
    async saveHandle() {
      const flag = this.validate()
      if (flag) {
        this.globalLoading()
        const {derivative_name, id, derivative_desc} = this.form
        const res = await this.$simpleAsyncTo(
          edit({
            id,
            derivative_name,
            derivative_desc,
            union_attr: this.getUnionAttr()
          }),
          '保存失败'
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          this.beforeClose()
          this.$root.eventEmitter.emit('refresh')
        }
        this.globalLoading().close()
      }
    },
    async publishHandle() {
      const flag = this.validate()
      if (flag) {
        this.globalLoading()
        const res = await this.$simpleAsyncTo(
          deriveIndexPublish({
            id: this.form.id,
            union_attr: this.getUnionAttr()
          }),
          '发布失败'
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '发布成功',
            type: 'success'
          })
          this.beforeClose()
          this.$root.eventEmitter.emit('refresh')
        }
        this.globalLoading().close()
      }
    },
    beforeClose() {
      this.$refs.form.resetFields()
      this.close()
    }
  }
}
</script>

<style lang="scss"></style>

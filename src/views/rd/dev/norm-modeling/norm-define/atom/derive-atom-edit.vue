<template>
  <el-dialog
    custom-class="derive-atom-edit-dialog"
    title="新建衍生原子指标"
    width="1100px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="10vh"
    append-to-body
    @close="beforeClose"
    v-draggable="{
      trigger: '.derive-atom-edit-dialog .el-dialog__header',
      body: '.derive-atom-edit-dialog.el-dialog',
      recover: false
    }"
  >
    <!-- class="dialog-center" -->
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-position="right"
      label-width="120px"
      label-suffix="："
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="业务板块">{{
            filter.business_field_name
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属项目">{{
            filter.project_name
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目空间类型">{{
            filter.space_type_name
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="英文名" prop="name_en">
            <el-input
              v-model="filter.name_en"
              maxlength="32"
              show-word-limit
              placeholder="请输入英文名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="filter.name"
              maxlength="32"
              show-word-limit
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" maxlength="128" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="data_type">
        <el-select v-model="filter.data_type" style="width: 40%;">
          <el-option
            v-for="item in dics.data_type"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否累加" prop="is_accumulate">
        <el-radio-group v-model="filter.is_accumulate">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计算逻辑" prop="sql_content">
        <p>
          <i class="el-icon-question"></i
          >&nbsp;请基于已发布的原子指标进行引用，设定组装逻辑，用于衍生原子指标
        </p>
        <MonacoEditor
          has-top-tools
          has-bottom-tools
          :code.sync="filter.sql_content"
          tip-content="仅可基于已发布原子指标，组合设定所需指标的统计计算方式"
          @verification="sqlVerification"
        ></MonacoEditor>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click.stop="beforeClose">取消</el-button>
      <el-button type="primary" @click.stop="save">保存</el-button>
      <el-button type="primary" @click.stop="publish">发布</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
export default {
  name: 'AtomEditDialog',
  mixins: [editDialog],
  data() {
    return {
      isVisible: false,
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        name_en: '',
        name: '',
        desc: '',
        data_type: '',
        is_accumulate: true,
        sql_content: ''
      },
      rules: {
        name_en: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        name: [{required: true, message: '必填项'}],
        data_type: [{required: true, message: '必填项'}],
        sql_content: [{required: true, message: '必填项'}]
      }
    }
  },
  methods: {
    sqlVerification() {},
    beforeClose() {
      this.close()
    },
    validate() {
      let flag = false
      this.$refs.form.validate(valid => {
        flag = valid
      })
      return flag
    },
    save() {},
    publish() {}
  }
}
</script>

<style lang="scss"></style>

<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-12 09:57:45
 * @LastEditTime: 2021-08-20 16:09:29
 * @Description:
-->
<template>
  <div class='standard-approve'>
    <header class="font-14 mb-10">基本信息</header>
    <el-card class="mb-20 notice-center-card">
      <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标准名称">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.std_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编号">
              <OverflowTooltip class="font-12 width">
                {{baseinfo.std_id}}
              </OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="英文名称">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.std_code
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准别名">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.std_alias
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务板块">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.busin_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="一级分类">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.one_catalog_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级分类">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.two_catalog_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三级分类">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.three_catalog_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="mb-20 mt-20 font-14">业务属性</div>
    <el-card class="notice-center-card mb-20">
      <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务规则">
              {{ baseinfo.busin_rule }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="值域">
              {{ baseinfo.range_name }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标准依据">
              {{ baseinfo.busin_quote }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务定义">
              {{ baseinfo.busin_desc }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="mb-20 mt-20 font-14">技术属性</div>
    <el-card class="mb-20 notice-center-card">
      <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item label="数据类别">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.std_type
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据格式">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.std_format
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代码编码规则">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.code_rule
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="引用代码">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.code_quote
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="mb-20 mt-20 font-14">管理属性</div>
    <el-card class="mb-20 notice-center-card">
      <el-form class="demo-form-inline" label-width="120px" label-suffix="：">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标准归属部门">
              <OverflowTooltip class="font-12 width">{{
                baseinfo.department_name
              }}</OverflowTooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="mb-20 mt-20 font-14">审批信息</div>
    <el-card class="notice-center-card mb-20">
      <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：" :rules="approvalInfoRules">
        <el-row class="mb-10">
          <el-col>
            <el-form-item label="审批结果" prop="reject">
              <el-radio-group v-model="approvalInfo.reject">
                <el-radio :label="false">通过</el-radio>
                <el-radio :label="true">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mb-10">
          <el-col>
            <el-form-item label="审批说明" prop="message">
              <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="approvalInfo.message">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="flex-center">
      <el-button type="primary" class="mr-20" @click="confirm">提 交</el-button>
      <el-button type="primary" @click="cancel">返 回</el-button>
    </div>
  </div>
</template>

<script>
import {
  getPassTask,
  getRejectTask
} from '@/api/notice/task-center/index.js'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'StandardApprove',
  props: {
    baseinfo: Object,
    proc_inst_id: String
  },
  components: {
    OverflowTooltip
  },
  data () {
    return {
      approvalInfo: {
        message: '',
        reject: ''
      },
      approvalInfoRules: {
        reject: [{ required: true, message: '请选择审批结果', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    async confirm () {
      if (this.approvalInfo.reject === '') {
        return this.$message({ type: 'error', message: '请选择审批结果' })
      }
      const params = {
        proc_inst_id: this.proc_inst_id,
        opinion: this.approvalInfo.message
      }
      let fn = null
      if (this.approvalInfo.reject) {
        fn = getRejectTask
      } else {
        fn = getPassTask
      }
      const res = await this.$simpleAsyncTo(fn(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.$emit('cancel')
      }
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
</style>

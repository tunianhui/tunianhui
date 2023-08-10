<template>
  <section class="apply-data-table">
    <el-card>
      <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
      </v-form-render>

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
    </el-card>
  </section>
</template>

<script>
import {
  getFormAll
} from '@/api/rd/publish/form.js'
import {
  getPassTask,
  getRejectTask
} from '@/api/notice/task-center/index.js'

export default {
  name: 'ApplyDataTable',
  inject: ['tabStore'],
  props: {
    proc_inst_id: String,
    flow_type: String,
    baseinfo: Object
  },
  data () {
    return {
      formJson: {},
      formData: {},
      optionData: {},

      approvalInfo: {
        message: '',
        reject: ''
      },
      approvalInfoRules: {
        reject: [{ required: true, message: '请选择审批结果', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.setFormJson()
    setTimeout(() => {
      this.$refs.vFormRef.disableForm()
      this.setFormData()
    }, 1000)
  },
  methods: {
    async setFormJson () {
      // this.formJson = require('./datasource.json')
      // this.$refs.vFormRef.setFormJson(this.formJson)
      const res = await this.$simpleAsyncTo(getFormAll({ modelKey: this.flow_type }))
      if (res.flag) {
        // const formJson = JSON.parse(res.data.formJson)
        const formJson = res.data.formJson
        this.$refs.vFormRef.setFormJson(formJson)
      }
    },

    setFormData () {
      const formData = this.baseinfo
      this.$refs.vFormRef.setFormData(formData)
    },

    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },

    async submitForm () {
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
.apply-data-table {
  padding: 20px 20px;
  background: $grey7;
  height: 100%;
  .el-card__header {
    padding: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .btn-wrapper {
    text-align: center;
  }
}

body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
</style>

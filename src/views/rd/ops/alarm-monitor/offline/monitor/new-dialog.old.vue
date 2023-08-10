<template>
  <section class="new-build">
    <el-dialog
      :title="`${title}任务监控(批量监控项配置)`"
      :visible.sync="dialogFormVisible"
      @close="close"
      width="40%"
    >
      <el-form
        :model="form"
        :rules="rules"
        :hide-required-asterisk="false"
        label-suffix="："
        ref="form"
      >
        <el-form-item :label-width="formLabelWidth" prop="nodeId">
          <template v-if="title === '新建'">
            <span slot="label">选择任务：</span>
            <el-select v-model="form.nodeId" multiple placeholder="请选择">
              <el-option
                v-for="item in taskList"
                :key="item.id"
                :label="item.nodeName"
                :value="item.nodeId"
              >
                <span style="float: left">{{ item.nodeName }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px;"
                  class="mr-20"
                  >{{ item.nodeId }}</span
                >
              </el-option>
            </el-select>
          </template>
          <template v-if="title === '编辑'">
            <span slot="label">任务：</span>
            <span>{{ data.nodeName }}</span>
          </template>
        </el-form-item>
        <el-form-item
          label="报警原因"
          :label-width="formLabelWidth"
          prop="reason"
        >
          <el-radio-group v-model="form.reason">
            <el-radio label="MONITOR_ERROR">出错</el-radio>
            <el-radio label="MONITOR_FINISH">完成</el-radio>
            <el-radio label="MONITOR_UN_FINISH"
              >未完成
              <el-time-picker
                v-model="time"
                format="HH:mm"
                value-format="HH:mm"
                :disabled="form.reason !== 'MONITOR_UN_FINISH'"
              >
              </el-time-picker>
            </el-radio>
            <el-radio label="MONITOR_SET_TIMEOUT" class="mt-15"
              >运行超过
              <el-input-number
                v-model="overtime"
                controls-position="right"
                @change="handleChange"
                :min="0"
                :disabled="form.reason !== 'MONITOR_SET_TIMEOUT'"
              ></el-input-number
              >分钟
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接收人" :label-width="formLabelWidth" prop="user">
          <el-radio-group v-model="form.user">
            <el-radio label="person">责任人</el-radio>
            <el-radio label="custom"
              >自定义
              <el-select
                v-model="customUser"
                multiple
                placeholder="请选择"
                :disabled="form.user !== 'custom'"
              >
                <el-option
                  v-for="item in customUserList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="接收方式"
          :label-width="formLabelWidth"
          prop="mode"
        >
          <el-checkbox-group v-model="form.mode">
            <el-checkbox label="BY_EMAIL" name="BY_EMAIL">邮件</el-checkbox>
            <el-checkbox label="BY_SMS" name="BY_SMS">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {getTaskList} from '@/api/rd/ops'
export default {
  name: 'NewBuild',
  props: {
    title: {
      type: String
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogFormVisible: true,
      time: '',
      overtime: '',
      customUser: [],
      form: {
        nodeId: '',
        reason: '',
        user: '',
        mode: []
      },
      formLabelWidth: '120px',
      taskList: [],
      customUserList: [],
      rules: {
        nodeId: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        reason: [{required: true}],
        user: [{required: true}],
        mode: [{required: true}]
      }
    }
  },
  watch: {
    title: {
      handler(val) {
        if (val === '编辑') {
          this.form.nodeId = this.data.nodeId
          this.form.reason = this.data.customAlertReason
          this.time = this.data.setTime
          this.overtime = this.data.setTime
          this.form.mode = this.data.alertType
        }
      },
      immediate: true
    }
  },
  created() {
    this.getTaskList()
  },
  methods: {
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.form.reason !== 'notSuccess') {
            this.time = ''
          }
          if (this.form.reason !== 'overtime') {
            this.overtime = ''
          }
          if (this.form.user !== 'custom') {
            this.customUser = ''
          }
          // const params = {
          //   ...this.form,
          //   time: this.time,
          //   overtime: this.overtime,
          //   customUser: this.customUser
          // }
          let res
          if (this.title === '编辑') {
            // res = await this.$simpleAsyncTo(getAddTsdk(params), '编辑失败')
          } else {
            // res = await this.$simpleAsyncTo(getAddTsdk(params), '新增失败')
          }
          if (res) {
            this.$message({
              type: 'success',
              message: `${this.title}成功`
            })
          }
          this.close('add')
        }
      })
    },
    handleChange() {},
    // 获取任务
    async getTaskList() {
      const params = {
        pageSize: 1,
        pageRow: 100
      }
      const res = await this.$simpleAsyncTo(getTaskList(params), '获取任务失败')
      if (res) {
        this.taskList = res.data
      }
    },
    // 获取接收人
    close(type = '') {
      this.$emit('close', type)
    }
  }
}
</script>

<style lang="scss">
.new-build {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 120px;
  }
}
</style>

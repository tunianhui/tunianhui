<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-23 10:53:18
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-27 13:55:55
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\batchMonitoringItemConfig.vue
-->
<template>
  <el-dialog
    :title="title"
    custom-class="batch-monitoring-item-config"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="62%"
  >
    <div class="steps-title">
      <span>
        <i :class="['iconfont icon-1', completed ? 'active' : '']" v-if="!completed"></i>
        <i :class="['iconfont icon-yuanxingxuanzhong-fill-copy', completed ? 'active' : '']" v-else></i>
        <span>配置报警原因</span>
      </span>
      <span></span>
      <span>
        <i class="iconfont icon-2"></i>
        <span>选择监控项</span>
      </span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <template v-if="!completed">
        <el-form-item label="报警原因" prop="reasonForAlarm">
          <el-select v-model="ruleForm.reasonForAlarm" placeholder="请输入报警原因" style="width: 220px">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in reasonForAlarmOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider></el-divider>
        <template v-if="ruleForm.reasonForAlarm">
          <el-form-item label="报警原因">
            {{ruleForm.reasonForAlarm | filterReasonForAlarm}}
          </el-form-item>
          <el-form-item label="报警频率" prop="alarmFrequency">
            <el-input-number
              v-model="ruleForm.alarmFrequency"
              controls-position="right"
              :min="1"
              :max="10">
            </el-input-number>
            <span class="ml-5">分钟/次</span>
          </el-form-item>
          <el-form-item label="监控区间" prop="monitoringInterval">
            <el-radio-group v-model="ruleForm.monitoringInterval">
              <el-row>
                <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
                  <el-radio label="1">全天</el-radio>
                </el-col>
                <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
                  <el-radio label="2">指定时段</el-radio>
                  <el-date-picker
                    v-model="monitoringInterval"
                    :disabled="ruleForm.monitoringInterval !== '2'"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="接收对象" prop="receivingObject">
            <el-radio-group v-model="ruleForm.receivingObject">
              <el-row>
                <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
                  <el-radio label="1">责任人</el-radio>
                </el-col>
                <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
                  <el-radio label="2">自定义</el-radio>
                  <el-select v-model="receivingObject" placeholder="请选择" style="width: 220px" v-if="ruleForm.receivingObject === '2'">
                    <el-option
                      v-for="item in receivingObjectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
                  <el-radio label="3">值班表</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="接收方式" prop="receiveMode">
            <el-checkbox-group v-model="ruleForm.receiveMode">
              <el-checkbox label="电话" name="type"></el-checkbox>
              <el-checkbox label="短信" name="type"></el-checkbox>
              <el-checkbox label="钉钉" name="type"></el-checkbox>
              <el-checkbox label="邮件" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="发送次数" prop="sendTimes">
            <el-input-number
              v-model="ruleForm.sendTimes"
              controls-position="right"
              :min="1"
              :max="10">
            </el-input-number>
          </el-form-item>
        </template>
      </template>
      <template v-else>
        <Step2></Step2>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="upStep" v-if="completed">返回上一步</el-button>
      <el-button type="primary" @click="nextStep" v-if="!completed">下一步</el-button>
      <el-button type="primary" @click="save" v-if="completed">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Step2 from './step2.vue'
export default {
  name: 'BatchMonitoringItemConfig',
  props: {
    title: String,
  },
  components: {
    Step2
  },
  filters: {
    filterReasonForAlarm(value) {
      const reasonForAlarmOptions = [
        { value: '1', label: '完成' },
        { value: '2', label: '出错' },
        { value: '3', label: '运行超时' },
        { value: '4', label: '未完成' }
      ]
      const result = reasonForAlarmOptions.find(item => item.value === value)
      return result ? result.label : ''
    }
  },
  data() {
    return {
      completed: false,
      dialogVisible: true,
      monitoringInterval: [],
      receivingObject: '',
      ruleForm: {
        reasonForAlarm: '',
        alarmFrequency: 1,
        monitoringInterval: '1',
        receivingObject: '1',
        receiveMode: [],
        sendTimes: 1
      },
      rules: {
        reasonForAlarm: [
          { required: true, message: '请输入报警原因', trigger: 'blur' }
        ],
        alarmFrequency: [
          { required: true, message: '请输入报警频率', trigger: 'blur' }
        ],
        monitoringInterval: [
          { required: true, message: '请输入监控区间', trigger: 'blur' }
        ],
        receivingObject: [
          { required: true, message: '请输入接收对象', trigger: 'blur' }
        ],
        receiveMode: [
          { required: true, message: '请输入接收方式', trigger: 'blur' }
        ],
        sendTimes: [
          { required: true, message: '请输入发送次数', trigger: 'blur' }
        ]
      },
      reasonForAlarmOptions: [
        { value: '1', label: '完成' },
        { value: '2', label: '出错' },
        { value: '3', label: '运行超时' },
        { value: '4', label: '未完成' }
      ],
      receivingObjectOptions: []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('close')
    },
    nextStep() {
      this.completed = true
    },
    upStep() {
      this.completed = false
    }
  }
}
</script>

<style lang="scss" scoped>
.steps-title {
  height: 40px;
  background: $grey9;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  > span:first-child,
  > span:last-child {
    i:first-child {
      font-size: 22px;
      color: $user2;
      vertical-align: sub;
      &.active {
        color: $success;
      }
    }
    i:last-child {
      color: $grey5;
    }
    span {
      padding: 0 5px;
    }
  }
  > span:nth-child(2) {
    display: inline-block;
    width: 20%;
    border-bottom: 1px dashed $grey4;
    margin: 0 5px 3px 5px;
  }
}
::v-deep .batch-monitoring-item-config {
  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
}
</style>
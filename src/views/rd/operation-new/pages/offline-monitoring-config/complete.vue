<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-28 11:18:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-28 15:50:38
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\complete.vue
-->
<template>
  <el-form :model="rulesForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <template>
      <el-form-item label="报警原因">
        {{rulesForm.reasonForAlarm | filterReasonForAlarm}}
      </el-form-item>
      <el-form-item label="报警频率" prop="alarmFrequency">
        <el-input-number
          @change="changeAlarmFrequency"
          v-model="rulesForm.alarmFrequency"
          controls-position="right"
          :min="1"
          :max="10">
        </el-input-number>
        <span class="ml-5">分钟/次</span>
      </el-form-item>
      <el-form-item label="监控区间" prop="monitoringInterval">
        <el-radio-group v-model="rulesForm.monitoringInterval">
          <el-row>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="1">全天</el-radio>
            </el-col>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="2">指定时段</el-radio>
              <el-date-picker
                v-model="monitoringInterval"
                :disabled="rulesForm.monitoringInterval !== '2'"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="接收对象" prop="receivingObject">
        <el-radio-group v-model="rulesForm.receivingObject">
          <el-row>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="1">责任人</el-radio>
            </el-col>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="2">自定义</el-radio>
              <el-select v-model="receivingObjectUser" placeholder="请选择" style="width: 220px" v-if="rulesForm.receivingObject === '2'">
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
        <el-checkbox-group v-model="rulesForm.receiveMode">
          <el-checkbox label="电话" name="type"></el-checkbox>
          <el-checkbox label="短信" name="type"></el-checkbox>
          <el-checkbox label="钉钉" name="type"></el-checkbox>
          <el-checkbox label="邮件" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发送次数" prop="sendTimes">
        <el-input-number
          v-model="rulesForm.sendTimes"
          controls-position="right"
          :min="1"
          :max="10">
        </el-input-number>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: 'Complete',
  props: {
    curData: Object
  },
  model: {
    prop: 'curData',
    event: 'change'
  },
  filters: {
    filterReasonForAlarm(value) {
      const reasonForAlarmOptions = [
        { label: '完成', value: '1'},
        { label: '出错', value: '2'},
        { label: '运行超时', value: '3'},
        { label: '未完成', value: '4'},
      ]
      const item = reasonForAlarmOptions.find(item => item.value === value)
      return item ? item.label : ''
    }
  },
  watch: {
    curData: {
      handler(val) {
        console.log(val)
        this.rulesForm = {
          reasonForAlarm: val.reasonForAlarm,
          alarmFrequency: val.alarmFrequency,
          monitoringInterval: val.monitoringInterval,
          receivingObject: val.receivingObject,
          receiveMode: val.receiveMode,
          sendTimes: val.sendTimes
        }
        this.receivingObjectUser = val.receivingObjectUser
      },
      deep: true,
      immediate: true
    },
    // rulesForm: {
    //   handler(val) {
    //     this.$emit('change', {
    //       ...this.curData,
    //       ...val,
    //       receivingObjectUser: this.receivingObjectUser
    //     })
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      rules: {
        alarmFrequency: [
          { required: true, message: '请输入报警频率', trigger: 'change' }
        ],
        monitoringInterval: [
          { required: true, message: '请选择监控区间', trigger: 'change' }
        ],
        receivingObject: [
          { required: true, message: '请选择接收对象', trigger: 'change' }
        ],
        receiveMode: [
          { required: true, message: '请选择接收方式', trigger: 'change' }
        ],
        sendTimes: [
          { required: true, message: '请输入发送次数', trigger: 'change' }
        ]
      },
      rulesForm: {
        reasonForAlarm: '',
        alarmFrequency: 1,
        monitoringInterval: '1',
        receivingObject: '1',
        receiveMode: [],
        sendTimes: 1
      },
      receivingObjectUser: '',
      monitoringInterval: [],
      receivingObjectOptions: [
        { label: '张三', value: '1'},
        { label: '李四', value: '2'},
        { label: '王五', value: '3'},
      ]
    }
  },
  methods: {
    changeAlarmFrequency(val) {
      this.change()
    },
    change() {
      this.$emit('change', {
        ...this.curData,
        ...this.rulesForm,
        receivingObjectUser: this.receivingObjectUser
      })
    }
  }
}
</script>
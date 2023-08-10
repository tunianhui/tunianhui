<template>
  <el-form :model="rulesForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <template>
      <el-form-item label="报警原因" prop="alarmFrequency" class="not-margin">
        <span class="mr-5">{{rulesForm.reasonForAlarm | filterReasonForAlarm}}</span>
        <el-input-number
          @change="changeSeconds"
          v-model="rulesForm.seconds"
          placeholder="请输入秒数"
          controls-position="right"
          :min="1"
          :max="10">
        </el-input-number>
        <span class="ml-5">秒</span>
      </el-form-item>
      <p style="color: rgba(0,0,0,0.6); font-size: 12px;margin-bottom:18px">
        <i class="iconfont icon-tip" style="width: 50px; display: inline-block; text-align: end;"></i>
        <span>提示：一天内指定周期的任务在指定时点未完成，则告警；仅对小时任务生效</span>
      </p>
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
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between;" class="mb-10">
          <span style="width:100px;text-align:right;padding-right:12px">接收配置</span>
          <span>
            <el-button type="primary" @click="addRecipient">新增接收人</el-button>
          </span>
        </div>
        <div style="padding-left:30px">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column prop="recipient" label="接收人">
              <template slot-scope="scoped">
                <el-select v-model="scoped.recipient" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="recipientInfo" label="接收人详情">
              <template slot-scope="scoped">
                <el-select v-model="scoped.recipientInfo" placeholder="请选择" @change="changeTable">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="receiveMode" label="接收方式">
              <template slot-scope="scoped">
                <el-select v-model="scoped.receiveMode" placeholder="请选择" multiple>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="receiveMode" label="操作" width="80">
              <template slot-scope="scoped">
                <el-button type="text" @click="delhand(scoped.$index)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
  </el-form>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'RealTimeTaskConfigComplete',
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
        { label: '业务延时过高', value: '1'},
        { label: 'TPS超过范围', value: '2'},
        { label: '失败频率超过配置', value: '3'},
        { label: '数据滞留超过配置', value: '4'},
        { label: 'checkpoint失败配置', value: '5'},
      ]
      const item = reasonForAlarmOptions.find(item => item.value === value)

      return item ? item.label : ''
    }
  },
  watch: {
    curData: {
      handler(val) {
        this.rulesForm = {
          reasonForAlarm: val.reasonForAlarm,
          seconds: val.seconds,
          alarmFrequency: val.alarmFrequency,
          monitoringInterval: val.monitoringInterval,
        }
        this.monitoringInterval = val.monitoringInterval
        this.tableData = cloneDeep(val.tableData) || []
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      rulesForm: {
        reasonForAlarm: '',
        seconds: '',
        alarmFrequency: '',
        monitoringInterval: ''
      },
      rules: {},
      monitoringInterval: [],
      options: [],
      tableData: []
    }
  },
  methods: {
    changeAlarmFrequency(val) {
      this.change()
    },
    changeSeconds(val) {
      this.change()
    },
    change() {
      this.$emit('change', {
        ...this.curData,
        ...this.rulesForm,
        monitoringInterval: this.monitoringInterval,
        tableData: this.tableData
      })
    },
    addRecipient() {
      this.tableData.push({
        recipient: '',
        recipientInfo: '',
        receiveMode: ''
      })
      this.change()
    },
    delhand(index) {
      this.tableData.splice(index, 1)
      this.change()
    },
    changeTable() {
      this.change()
    }
  }
}
</script>

<style lang="scss" scoped>
.not-margin {
  margin-bottom: 5px !important;
}
</style>
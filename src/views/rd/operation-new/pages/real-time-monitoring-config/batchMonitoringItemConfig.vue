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
          <div class="custom-item-wrapper mb-15">
            <div class="label" style="width: 100px">
              <span></span>
              <span>规则配置</span>
            </div>
            <div class="value">
              <span class="mr-5">{{ruleForm.reasonForAlarm | filterReasonForAlarm}}</span>
              <el-form-item label="" label-width="0px" class="node-bottom-margin">
                <el-input-number v-model="ruleForm.startNum" controls-position="right" :min="0" :max="999" class="not-botton"></el-input-number>
              </el-form-item>
              <span class="ml-10 mr-10">~</span>
              <el-form-item label="" label-width="0px" class="node-bottom-margin">
                <el-input-number v-model="ruleForm.endNum" controls-position="right" :min="0" :max="999" class="not-botton"></el-input-number>
              </el-form-item>
            </div>
          </div>
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
                    v-model="monitoringIntervalTime"
                    :disabled="ruleForm.monitoringInterval !== '2'"
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
            <div style="padding-left:100px">
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
                    <el-select v-model="scoped.recipientInfo" placeholder="请选择">
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
      </template>
      <template v-else>
        <!-- <Step2></Step2> -->
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
export default {
  name: 'BatchMonitoringItemConfig',
  props: {
    title: String,
  },
  filters: {
    filterReasonForAlarm(value) {
      const reasonForAlarmOptions = [
        { label: '业务延时过高', value: '1' },
        { label: 'TPS超过范围', value: '2' },
        { label: '失败频率超过配置', value: '3' },
        { label: '数据滞留超过配置', value: '4' },
        { label: 'checkpoint失败配置', value: '5' },
      ]
      const reasonForAlarm = reasonForAlarmOptions.find(item => item.value === value)
      return reasonForAlarm ? reasonForAlarm.label : ''
    }
  },
  data() {
    return {
      dialogVisible: true,
      completed: false,
      ruleForm: {
        reasonForAlarm: '',
        startNum: '',
        endNum: '',
        alarmFrequency: '',
        monitoringInterval: '',
      },
      monitoringIntervalTime: [],
      rules: {},
      reasonForAlarmOptions: [
        { label: '业务延时过高', value: '1' },
        { label: 'TPS超过范围', value: '2' },
        { label: '失败频率超过配置', value: '3' },
        { label: '数据滞留超过配置', value: '4' },
        { label: 'checkpoint失败配置', value: '5' },
      ],
      tableData: [
        {
          recipient: '',
          recipientInfo: '',
          receiveMode: '',
        }
      ],
      options: []
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
    },
    delhand(index) {
      this.tableData.splice(index, 1)
    },
    addRecipient() {
      this.tableData.push({
        recipient: '',
        recipientInfo: '',
        receiveMode: '',
      })
    },
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
.custom-item-wrapper {
  display: flex;
  align-items: center;
  .label {
    width: 100px;
    text-align: right;
    // margin-right: 12px;
    padding-right: 12px;
  }
  .value {
    display: flex;
    align-items: center;
  }
}
.node-bottom-margin {
  margin-bottom: 0!important;
}
.not-botton {
  ::v-deep .el-input-number__increase {
    display: none!important;
  }
  ::v-deep .el-input-number__decrease {
    display: none!important;
  }
  ::v-deep .el-input__inner {
    padding-right: 15px!important;
  }
}

</style>

<style lang="scss">
.batch-monitoring-item-config {
  .el-dialog__body {
    max-height: 350px;
    overflow: overlay;
  }
}
</style>
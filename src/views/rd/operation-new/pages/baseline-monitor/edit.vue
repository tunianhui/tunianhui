<template>
  <div class="baseline-monitor-edit">
    <div style="height: 28px; display: flex; align-items: center;">
      <span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <span style="color: rgba(46,116,255,1);cursor: pointer;font-size:12px" @click="backHand">基线监控</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span style="font-size:12px">{{currentTitle || '新建基线'}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="wrapper-box">
      <div class="main">
        <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="right"  label-width="130px" :disabled="pageDisabled">
          <div class="baseline-detail-item-title">基本信息</div>
          <el-card class="box-card">
            <el-row>
              <el-col :span="6">
                <el-form-item label="基线名称" prop="baselineName" label-width="80px">
                  <el-input v-model="form.baselineName" placeholder="请输入基线名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="负责人" prop="head">
                  <el-select v-model="form.head" placeholder="请选择责任人">
                    <el-option label="负责人1" value="1"></el-option>
                    <el-option label="负责人2" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" class="mr-15">
                <el-form-item label="优先级" prop="priority">
                  <el-select v-model="form.priority" placeholder="请选择优先级">
                    <el-option label="高" value="1"></el-option>
                    <el-option label="最高" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="基线类型" prop="basellineType">
                  <el-radio-group v-model="form.basellineType">
                    <el-radio label="1">天基线</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="描述" prop="desc" label-width="80px" class="not-bottom-margin">
                  <el-input type="textarea" v-model="form.desc" :rows="3" placeholder="请输入描述"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <div class="baseline-detail-item-title">
            <div class="title-block">
              保障对象
              <el-tooltip class="item" effect="dark" content="系统将基于调度依赖关系自动推算需要纳入基线范围的保障对象的上游节点，并计算整条链路的历史平均运行时间(如有历史运行记录)作为承诺时间参考" placement="top">
                <i class="iconfont icon-info font-12" style="cursor: pointer; color: rgba(0,0,0,.5); margin-left: 4px;margin-top:3px"></i>
              </el-tooltip>
            </div>
            <div class="actions-block">
              <span>
                <el-input
                placeholder="请输入节点名称或ID"
                v-model="nodeName" class="mr-10" style="width:180px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              </span>
              <el-dropdown @command="commandSecurityObjectHandle">
                <el-button type="primary"> <i class="el-icon-plus"></i> 添加保障对象</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="addPhyTask">
                    <span style="padding:8px 5px">添加物理任务</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="addLogicTableField">
                    <span style="padding:5px 5px">添加逻辑表字段</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div>
            <SecurityObjectTable></SecurityObjectTable>
          </div>
          <div class="baseline-detail-item-title">告警配置</div>
          <el-card class="box-card">
            <div class="baseline-set-alarm">
              <div class="alarm-item-title">基线告警</div>
              <div class="alarm-item-content">
                <div class="content-row">
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-form-item>
                        <span slot="label">
                          历史预计产出时间
                          <el-tooltip class="item" effect="dark" content="根据已选保障对象最近7天运行成功的记录进行推算，小时任务暂不计算，如数据不足可能有误差，仅作为参考" placement="top">
                            <i class="iconfont icon-info cursor" style="margin-left:3px;color: rgba(0,0,0,0.4);position: relative;z-index: 9;"></i>
                          </el-tooltip>
                        </span>
                        <span style="color:rgba(0,0,0,0.25)" class="font-12">历史数据不足，暂时无法推算</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-col :span="13">
                        <el-form-item label="保障产出时间" prop="guaranteedOutputTimeType">
                          <el-radio-group v-model="form.guaranteedOutputTimeType">
                            <el-radio label="当日"></el-radio>
                            <el-radio label="次日"></el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label="" prop="guaranteedOutputTime" label-width="0">
                          <el-time-picker
                            style="width: 100px"
                            v-model="form.guaranteedOutputTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            :picker-options="{
                              format: 'HH:mm',
                            }">
                          </el-time-picker>
                        </el-form-item>
                      </el-col>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="预警余量" prop="warningMargin">
                        <el-input-number v-model="form.warningMargin" controls-position="right" :min="0" :max="180"></el-input-number>
                        <span style="color:rgba(0,0,0,0.75)" class="font-12 ml-10">分钟</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-form-item label="告警频率" prop="alarmRating">
                        <el-input-number v-model="form.alarmRating" controls-position="right" :min="0" :max="59"></el-input-number>
                        <span style="color:rgba(0,0,0,0.75)" class="font-12 ml-10">分钟/次</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-col :span="13">
                        <el-form-item label="告警区间" prop="alarmIntervalType">
                          <el-radio-group v-model="form.alarmIntervalType">
                            <el-radio label="1">全天</el-radio>
                            <el-radio label="2">指定时段</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label=" " prop="alarmIntervalTime" label-width="0">
                          <el-time-picker
                            style="width:180px"
                            is-range
                            v-model="form.alarmIntervalTime"
                            range-separator="-"
                            placeholder="选择告警区间"
                            value-format="HH:mm"
                            format="HH:mm"
                            :picker-options="{
                              format: 'HH:mm',
                            }"
                          >
                          </el-time-picker>
                        </el-form-item>
                      </el-col>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="最大告警次数" prop="maxAlarms">
                        <el-input-number v-model="form.maxAlarms" controls-position="right" :min="1" :max="10"></el-input-number>
                        <span style="color:rgba(0,0,0,0.75)" class="font-12 ml-10">次</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="baseline-alarm-receive-setting">
                <div class="receive-setting-title">接收配置</div>
                <RecipientTableConfig type="base" :pageDisabled="pageDisabled"></RecipientTableConfig>
              </div>
            </div>
            <div class="alarm-item-title">
              事件告警
              <el-form-item label="" prop="eventAlarmSwitch" label-width="0px" class="not-bottom-margin ml-10">
                <el-switch
                  v-model="form.eventAlarmSwitch">
                </el-switch>
              </el-form-item>
              <i class="iconfont icon-info font-12 mr-5" style="color: rgba(0,0,0,.5); margin-left: 10px;margin-top:3px"></i>
              <span style="font-size:12px;color:rgba(0,0,0,0.45)">
                保障任务的上游任务出错或变慢会触发事件告警，可能导致保障任务无法在承诺时间前完成；不影响已配置的任务告警
              </span>
            </div>
            <div>
              <el-form-item label="事件告警类型" prop="eventAlarmType" class="not-bottom-margin ml-10">
                <div style="display: flex;align-items: center;">
                  <el-checkbox-group v-model="form.eventAlarmType">
                    <el-checkbox label="1">出错</el-checkbox>
                    <el-checkbox label="2">变慢</el-checkbox>
                  </el-checkbox-group>
                  <el-tooltip class="item" effect="dark" content="根据最近7次正常调度且运行成功的记录推算历史平均运行时长。若本次运行(仅统计运行超过3min的节点)超过历史平均运行时长的30%，则触发变慢告警" placement="top">
                    <i class="iconfont icon-info font-12" style="cursor: pointer; color: rgba(0,0,0,.5); margin-bottom: 6px;margin-left:3px"></i>
                  </el-tooltip>
                </div>
              </el-form-item>
            </div>
            <div class="mb-15">
              <el-form-item label="告警及接收配置" prop="alarmAndReceptionConfig" class="not-bottom-margin ml-10">
                <el-radio-group v-model="form.alarmAndReceptionConfig">
                  <el-radio label="1">同基线告警配置</el-radio>
                  <el-radio label="2">自定义配置</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="baseline-set-alarm" v-if="form.alarmAndReceptionConfig === '2'">
              <div class="content-row">
                <el-row :gutter="10">
                  <el-col :span="7">
                    <el-form-item label="告警频率" prop="eventAlarmRating">
                      <el-input-number v-model="form.eventAlarmRating" controls-position="right" :min="0" :max="59"></el-input-number>
                      <span style="color:rgba(0,0,0,0.75)" class="font-12 ml-10">分钟/次</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-col :span="13">
                        <el-form-item label="告警区间" prop="eventAlarmIntervalType">
                          <el-radio-group v-model="form.eventAlarmIntervalType">
                            <el-radio label="1">全天</el-radio>
                            <el-radio label="2">指定时段</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label=" " prop="eventAlarmIntervalTime" label-width="0">
                          <el-time-picker
                            style="width:180px"
                            is-range
                            v-model="form.eventAlarmIntervalTime"
                            range-separator="-"
                            placeholder="选择告警区间"
                            value-format="HH:mm"
                            format="HH:mm"
                            :picker-options="{
                              format: 'HH:mm',
                            }"
                          >
                          </el-time-picker>
                        </el-form-item>
                      </el-col>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="最大告警次数" prop="eventMaxAlarms">
                        <el-input-number v-model="form.eventMaxAlarms" controls-position="right" :min="1" :max="10"></el-input-number>
                        <span style="color:rgba(0,0,0,0.75)" class="font-12 ml-10">次</span>
                      </el-form-item>
                    </el-col>
                </el-row>
              </div>
              <div class="baseline-alarm-receive-setting">
                <div class="receive-setting-title">接收配置</div>
                <RecipientTableConfig type="event" :pageDisabled="pageDisabled"></RecipientTableConfig>
              </div>
            </div>
          </el-card>
        </el-form>
      </div>
      <div class="baseline-detail-footer">
        <el-button @click="cancelHandle">取 消</el-button>
        <el-button type="primary" @click="svaeHandle">确 定</el-button>
      </div>
    </div>
    <AddPhyTask v-if="addPhyTaskVisible" @close="addPhyTaskVisible = false"></AddPhyTask>
    <AddLogicField v-if="addLogicTableFieldVisible" @close="addLogicTableFieldVisible = false"></AddLogicField>
  </div>
</template>

<script>
import SecurityObjectTable from './security-object-table.vue'
import AddPhyTask from './add-phy-task.vue'
import AddLogicField from './add-logic-table-field.vue'
import RecipientTableConfig from './recipient-table-config.vue'
export default {
  name: 'BaselineMonitorEdit',
  components: {
    SecurityObjectTable,
    AddPhyTask,
    AddLogicField,
    RecipientTableConfig
  },
  props: {
    currentTitle: {
      type: String,
      default: '新建基线'
    }
  },
  watch: {
    currentTitle: {
      handler(val) {
        if (val.indexOf('查看') > -1) {
          this.pageDisabled = true
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      pageDisabled: false,
      nodeName: '',
      form: {
        baselineName: '',
        head: '',
        priority: '',
        basellineType: '1',
        desc: '',
        guaranteedOutputTimeType: '',
        guaranteedOutputTime: '00:00',
        warningMargin: 0,
        alarmRating: '',
        alarmIntervalType: '1',
        alarmIntervalTime: ['00:00', '00:00'],
        maxAlarms: 1,
        eventAlarmSwitch: false,
        eventAlarmType: [],
        alarmAndReceptionConfig: '1',
        eventAlarmRating: '',
        eventAlarmIntervalType: '1',
        eventAlarmIntervalTime: ['00:00', '00:00'],
        eventMaxAlarms: 1
      },
      rules: {
        baselineName: [
          { required: true, message: '请输入基线名称', trigger: 'blur' }
        ],
        head: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        basellineType: [
          { required: true, message: '请选择基线类型', trigger: 'change' }
        ],
        guaranteedOutputTimeType: [
          { required: true, message: '请选择保障产出时间', trigger: 'change' }
        ],
        warningMargin: [
          { required: true, message: '请输入预警余量', trigger: 'blur' }
        ],
        alarmRating: [
          { required: true, message: '请选择告警评率', trigger: 'change' }
        ],
        alarmIntervalType: [
          { required: true, message: '请选择告警区间', trigger: 'change' }
        ],
        maxAlarms: [
          { required: true, message: '请输入最大告警次数', trigger: 'blur' }
        ],
        eventAlarmType: [
          { required: true, message: '请选择事件告警类型', trigger: 'change' }
        ],
        alarmAndReceptionConfig: [
          { required: true, message: '请选择告警及接收配置', trigger: 'change' }
        ],
        eventAlarmRating: [
          { required: true, message: '请输入告警频率', trigger: 'blur' }
        ],
        eventAlarmIntervalType: [
          { required: true, message: '请选择告警区间', trigger: 'change' }
        ],
        eventMaxAlarms: [
          { required: true, message: '请输入最大告警次数', trigger: 'blur' }
        ]
      },
      addPhyTaskVisible: false,
      addLogicTableFieldVisible: false
    }
  },
  methods: {
    backHand() {
      this.$emit('back')
    },
    commandSecurityObjectHandle(val) {
      console.log(val)
      this[`${val}Visible`] = true
    },
    cancelHandle() {
      this.backHand()
    },
    svaeHandle() {
      console.log(this.form)
      this.backHand()
    }
  }
}
</script>

<style lang="scss" scoped>
.baseline-monitor-edit {
  height: 100%;
  .wrapper-box {
    height: calc(100% - 28px);
    position: relative;
    padding-bottom: 52px;
    .main {
      height: 100%;
      overflow: auto;
      .baseline-detail-item-title {
        font-size: 14px;
        color: rgba(0,0,0,.85);
        margin: 16px 0;
        display: flex;
        justify-content: space-between;
        .title-block {
          display: flex;
          align-items: center;
        }
        .actions-block {
          display: flex;
          align-items: center;
        }
      }
      .box-card {
        border-radius: 0;
        box-shadow: none;
      }
    }
    .baseline-detail-footer {
      width: 100%;
      height: 52px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      box-shadow: 0 -5px 10px 0 rgba(0,0,0,.15);
    }
  }
  .not-bottom-margin {
    margin-bottom: 0!important;
  }
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .baseline-set-alarm {
    .alarm-item-title {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
    }
    .alarm-item-content {
      margin-bottom: 10px;
      .content-row {
        width: 100%;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
  }
  ::v-deep {
    .el-form-item__label {
      font-size: 12px;
      color: rgba(0,0,0,.65);
    }
    .el-table th.el-table__cell>.cell {
      font-weight: 400;
    }
    .el-radio__label {
      font-size: 12px;
    }
    .el-radio {
      margin-right: 15px;
    }
    .el-checkbox__label {
      font-size: 12px;
    }
  }
  .cursor {
    cursor: pointer;
  }
  .baseline-alarm-receive-setting {
    .receive-setting-title {
      margin-bottom: 10px;
      font-size: 12px;
      &::before {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 12px;
        line-height: 1;
        content: "*";
        font-family: SimSun,sans-serif;
      }
    }
  }
  .alarm-item-title {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>
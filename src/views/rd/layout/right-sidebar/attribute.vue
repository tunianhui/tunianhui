<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-17 10:28:39
 * @LastEditTime: 2023-06-21 14:37:18
 * @Description:
-->
<template>
  <section class="side-panel-view" :style="active.style || {}" v-loading="loading">
    <div class="spv-main">
      <div class="title">
        <span class="name">属性</span>
      </div>
      <div class="node-data-edit-base">
        <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="120px" class="form-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
              <el-form-item label="任务名" prop="name">
                <el-input v-model="form.name" placeholder="请输入任务名"></el-input>
              </el-form-item>
              <el-form-item label="ID" prop="id">
                <span>{{form.id}}</span>
              </el-form-item>
              <el-form-item label="节点类型" prop="type">
                <span>{{form.type}}</span>
              </el-form-item>
              <el-form-item label="运维负责人" prop="opsUser">
                <el-select v-model="form.opsUser" placeholder="请选择运维负责人">
                  <el-option v-for="item in ownerList" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" placeholder="请输入描述内容"></el-input>
              </el-form-item>
              <el-form-item label="优先级" prop="priority">
                <el-select v-model="form.priority" placeholder="请选择">
                  <el-option v-for="item in priorityList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="调度属性" name="3">
              <el-form-item label="调度类型" prop="jobType">
                <el-radio-group v-model="form.jobType">
                  <el-radio label="0">正常调度</el-radio>
                  <el-radio label="1">暂停调度</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="生效日期" prop="effectiveDate">
                <el-date-picker v-model="form.effectiveDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
              <el-row>
                <el-col :span="7" class="mr-10">
                  <el-form-item label="调度周期" prop="cronType">
                    <el-select v-model="form.cronType" class="mr-10" @change="changeCronType">
                      <el-option v-for="item in cycleTypeList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" v-if="form.cronType === 'WEEK'" class="mr-10">
                  <el-form-item label="" prop="time" label-width="0">
                    <el-select v-model="form.weekType" multiple collapse-tags class="mr-10" @change="changeCron">
                      <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" v-if="form.cronType === 'MONTH'" class="mr-10">
                  <el-form-item label="" prop="time" label-width="0">
                    <el-select v-model="form.monthType" multiple collapse-tags class="mr-10" @change="changeCron">
                      <el-option v-for="item in monthList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16" v-if="form.cronType === 'HOUR'" class="mr-10">
                  <el-row>
                    <el-col :span="5" class="mr-10">
                      <el-form-item label="" prop="hourType" label-width="0">
                        <el-select v-model="form.hourType" collapse-tags @change="changeHourType">
                          <el-option label="时间点" value="1">
                          </el-option>
                          <el-option label="时间段" value="2">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18" style="display:flex;align-items: center;">
                      <span v-if="form.cronType === 'HOUR' && form.hourType === '1'">
                        <el-form-item label="" prop="selectHour1" label-width="0">
                          <el-select v-model="form.selectHour1" multiple class="mr-10" @change="changeHourPoint">
                            <el-option v-for="item in hourList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </span>
                      <template v-if="form.cronType === 'HOUR' && form.hourType === '2'">
                        <span class="mr-10">
                          <el-form-item label="" prop="selectHourSlot" label-width="0" style="width:148px">
                            <el-time-picker @change="changeCronSelectHourSlot" style="width:148px" is-range v-model="form.selectHourSlot" range-separator="~" start-placeholder="start" end-placeholder="end" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm" :clearable="false">
                            </el-time-picker>
                          </el-form-item>
                        </span>
                        <span class="mr-10" style="margin-bottom:15px">间隔</span>
                        <span>
                          <el-form-item label="" prop="interval" label-width="0" style="width:78px">
                            <el-select v-model="form.interval" @change="changeHourInterval">
                              <el-option v-for="item in hourIntervalList" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </span>
                        <span class="ml-10" style="margin-bottom:15px">小时</span>
                      </template>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="16" v-if="form.cronType === 'MINUTE'" class="mr-10" style="display:flex;align-items: center;">
                  <template>
                    <span class="mr-10">
                      <el-form-item label="" prop="selectHourSlot" label-width="0" style="width:148px">
                        <el-time-picker @change="changeCronSelectMinuteSlot" style="width:148px" is-range v-model="form.selectMinuteSlot" range-separator="~" start-placeholder="start" end-placeholder="end" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm" :clearable="false">
                        </el-time-picker>
                      </el-form-item>
                    </span>
                    <span class="mr-10" style="margin-bottom:15px">间隔</span>
                    <span>
                      <el-form-item label="" prop="interval" label-width="0" style="width:78px">
                        <el-select v-model="form.intervalMinute" @change="changeMinuteInterval">
                          <el-option v-for="item in minuteIntervalList" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </span>
                    <span class="ml-10" style="margin-bottom:15px">分钟</span>
                  </template>
                </el-col>
                <el-col :span="4" v-if="form.cronType !== 'HOUR' && form.cronType !== 'MINUTE'">
                  <el-form-item label="" prop="time" label-width="0">
                    <el-time-picker popper-class="time-picker" v-model="form.time" value-format="HH:mm" format="HH:mm" @change="changeCron" :clearable="false"></el-time-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- crontab 格式：秒  分  小时  天   月  周，6位长度，中间用空格间隔 -->
              <!--
   当任务周期选择小时时，分位时间点和时间段。
   选择时间点时，选择小时，可以多选，更新crontab表达式的第3位，如果选择多个小时，比如1、2、3，则crontab表达式为0 0 1,2,3 * * ？;
   选择时间段时，首先选择生效时间再选择间隔小时，更新crontab表达式的第3位，格式为：生效时间段/间隔时间，比如生效时间段选择01:00-18:00，间隔2小时执行一次，则crontab表达式为0 0 1-18/2 * * ？
-->
              <!-- 当任务周期选择日时，选择小时和分钟，分别更新到crontab表达式的第3位和第2位，比如选择12:34，则crontab表达式为0 34 12 * * ？ -->
              <!-- 当任务周期选择周时，选择星期、小时和分钟，分别更新到crontab表达式的第6位和第3位和第2位，比如选择周1和周2，时间选择12:34，则crontab表达式为0 34 12 * * 1,2 -->
              <!-- 当任务周期选择月时，选择天、小时和分钟，分别更新到crontab表达式的第4位、第3位和第2位，比如选择5号和6号，时间选择12:34，则crontab表达式为0 34 12 5,6 * ？ -->
              <el-form-item label="cron 表达式" prop="cronExpression">
                <span>{{cronExpression}}</span>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="运行配置" name="4">
              <div class="flex">
                <div class="mr-10">
                  <el-form-item label="运行超时" prop="timeoutType">
                    <el-radio-group v-model="form.timeoutType">
                      <el-radio :label="0">系统配置：48小时</el-radio>
                      <el-radio :label="1">自定义</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="" label-width="0">
                    <el-input-number v-model="form.timeout" controls-position="right" :disabled="form.timeoutType === 0" :min="1" :max="168" style="width: 98px"></el-input-number><span>小时</span>
                  </el-form-item>
                </div>
              </div>
              <div class="">
                <div>
                  <el-form-item label="失败自动重跑" prop="rerunType">
                    <el-radio-group v-model="form.rerunType">
                      <el-radio :label="0">系统配置：重跑次数1次，重跑间隔5分钟</el-radio>
                      <div class="mb-10"></div>
                      <el-radio :label="1">自定义</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div class="flex" style="margin-left:120px">
                  <div>
                    <el-form-item label="" label-width="0">
                      <el-input-number v-model="form.rerunTimes" controls-position="right" :disabled="form.rerunType === 0" :min="1" :max="10" style="width: 98px"></el-input-number><span class="ml-5">次</span>
                    </el-form-item>
                  </div>
                  <div class="ml-20">
                    <el-form-item label="" label-width="0">
                      <span class="mr-5">重跑间隔</span>
                      <el-input-number v-model="form.rerunInterval" controls-position="right" :disabled="form.rerunType === 0" :min="1" :max="60" style="width: 98px"></el-input-number><span>分钟</span>
                    </el-form-item>
                  </div>
                </div>
              </div>

            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <div class="side-modal-footer my-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" class="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import mixin from '../mixin'
import './common.scss'
import {
  getMemberList
} from '@/api/plan/project-manage'
import { mapGetters } from 'vuex'
import {
  getAttrConfigById,
  saveAttrConfig
} from '@/api/rd/integrate'
import dayjs from 'dayjs'
export default {
  name: 'AttributeView',
  mixins: [mixin],
  inject: ['attrStore', 'tabStore'],
  components: {},
  data () {
    return {
      activeNames: ['1', '2', '3', '4'],
      form: {
        name: '', // 任务名称
        id: '', // 任务id
        type: '', // 任务类型
        opsUser: '', // 运维负责人
        description: '', // 描述
        priority: '', // 优先级
        jobType: '0', // 调度类型
        effectiveDate: [], // 生效日期
        cronType: '', // 调度周期
        time: '00:00', // 时间点
        weekType: [], // 周
        monthType: [], // 月
        hourType: '1', // 小时类型
        selectHour1: [], // 小时
        selectHourSlot: ['00:00', '23:59'], // 小时段
        interval: 1, // 小时间隔
        selectMinuteSlot: ['00:00', '23:59'], // 分钟段
        intervalMinute: 1, // 分钟间隔
        timeoutType: '1', // 运行超时
        timeout: 1, // 运行超时时间
        rerunType: 0, // 失败自动重跑
        rerunTimes: 1, // 重跑次数
        rerunInterval: 5 // 重跑间隔
      },
      value: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: ['blur', 'change'] }],
        opsUser: [{ required: true, message: '请选择运维负责人', trigger: ['blur', 'change'] }],
        jobType: [{ required: true, message: '请选择调度类型', trigger: ['blur', 'change'] }],
        priority: [{ required: true, message: '请选择优先级', trigger: ['blur', 'change'] }],
        effectiveDate: [{ required: true, message: '请选择生效日期', trigger: ['blur', 'change'] }]
      },
      // 运维负责人
      ownerList: [],
      // 任务优先级
      priorityList: [
        { name: 'HIGHEST', value: 'HIGHEST' },
        { name: 'HIGH', value: 'HIGHEST' },
        { name: 'MEDIUM', value: 'HIGHEST' },
        { name: 'LOW', value: 'HIGHEST' },
        { name: 'LOWEST', value: 'HIGHEST' }
      ],
      cycleTypeList: [
        {
          label: '日',
          value: 'DAILY'
        },
        {
          label: '周',
          value: 'WEEK'
        },
        {
          label: '月',
          value: 'MONTH'
        },
        {
          label: '小时',
          value: 'HOUR'
        },
        {
          label: '分钟',
          value: 'MINUTE'
        }
      ],
      weekList: [
        {
          label: '周一',
          key: '1',
          value: 'MON'
        },
        {
          label: '周二',
          key: '2',
          value: 'TUE'
        },
        {
          label: '周三',
          key: '3',
          value: 'WED'
        },
        {
          label: '周四',
          key: '4',
          value: 'THU'
        },
        {
          label: '周五',
          key: '5',
          value: 'FRI'
        },
        {
          label: '周六',
          key: '6',
          value: 'SAT'
        },
        {
          label: '周日',
          key: '0',
          value: 'SUN'
        }
      ],
      monthList: [
        // 生成1-31的数组，用于月份选择
        ...Array.from({ length: 31 }, (v, k) => k + 1).map(item => {
          return {
            label: `${item}日`,
            value: item
          }
        })
      ],
      hourList: [
        // 生成0-23的数组，用于小时选择
        ...Array.from({ length: 24 }, (v, k) => k).map(item => {
          return {
            label: `${item}时`,
            value: item
          }
        })
      ],
      hourIntervalList: [
        // 生成1-12的数组，用于小时选择
        ...Array.from({ length: 12 }, (v, k) => k + 1).map(item => {
          return {
            label: `${item}`,
            value: item
          }
        })
      ],
      minuteIntervalList: [
        // 生成5-55的数组，step为5，用于分钟选择
        ...Array.from({ length: 11 }, (v, k) => k * 5 + 5).map(item => {
          return {
            label: `${item}`,
            value: item
          }
        })
      ],
      loading: 0,
      cronExpression: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    active: {
      handler (val) {
        console.log(val)
        console.log(this.tabStore)
        if (JSON.stringify(val) !== '{}') {
          // this.getAttrConfigById()
        }
      },
      immediate: true,
      deep: true
    },
    activeTab: {
      handler (val) {
        console.log(val)
        if (JSON.stringify(val) !== '{}' && val.tabType === 'computingTask') {
          this.getAttrConfigById()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getUserList()
  },
  computed: {
    ...mapGetters(['project']),
    active () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories () {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty () {
      return this.attrStore && !this.histories.length
    },
    activeTab () {
      return (this.tabStore && this.tabStore.states.active) || {}
    }
  },
  methods: {
    convertTime (timeStr) {
      const timeArr = timeStr.split(':')
      const hour = timeArr[0]
      const minute = timeArr[1]
      const arr = [minute, hour]
      const result = arr.join(' ')
      return result
    },

    // 获取成员管理列表
    async getUserList () {
      const params = { project_id: this.project.project_id }
      const res = await this.$simpleAsyncTo(
        getMemberList(params),
        '获取成员列表失败'
      )
      if (res) {
        this.ownerList = res.data
      }
    },

    handleEdit () {

    },

    // 关闭侧边栏
    cancel () {
      this.$root.eventEmitter.emit('hideSidebar')
    },

    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.cancel()
          this._saveAttrConfig()
        }
      })
    },
    async _saveAttrConfig () {
      console.log(this.form.effectiveDate)
      const params = {
        name: this.form.name,
        opsUser: this.form.opsUser,
        description: this.form.description,
        priority: this.form.priority,
        jobType: this.form.jobType,
        dateBegin: this.form.effectiveDate[0],
        dateEnd: this.form.effectiveDate[1],
        jobCycle: JSON.stringify({
          cronType: this.form.cronType,
          time: this.form.time,
          weekType: this.form.weekType,
          monthType: this.form.monthType,
          hourType: this.form.hourType,
          selectHour1: this.form.selectHour1,
          selectHourSlot: this.form.selectHourSlot,
          interval: this.form.interval,
          selectMinuteSlot: this.form.selectMinuteSlot,
          intervalMinute: this.form.intervalMinute
        }),
        cronExpr: this.cronExpression,
        timeoutType: this.form.timeoutType,
        timeout: this.form.timeout,
        rerunType: this.form.rerunType,
        rerunTimes: this.form.rerunTimes,
        rerunInterval: this.form.rerunInterval,
        id: this.form.id,
        flowId: this.form.flowId
      }
      const res = await this.$simpleAsyncTo(
        saveAttrConfig(params),
        '保存属性失败'
      )
      if (res) {
        this.$message.success('保存成功')
        this.cancel()
      }
    },
    setActiveAttr (attr) {
      this.attrStore.commit('setActive', attr)
    },
    setActiveToFirst (attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    },
    changeCron () {
      const data = this.form
      let cronExpression = ''
      if (data.cronType == 'DAILY') {
        if (data.time) {
          const time = data.time.split(':')
          cronExpression = `00 ${time[1]} ${time[0]} * * ?`
        } else {
          cronExpression = ''
        }
      } else if (data.cronType == 'WEEK') {
        if (!data.weekType && !data.time) {
          cronExpression = ''
        } else {
          const time = data.time.split(':')
          const week = data.weekType.join(',')
          cronExpression = `00 ${time[1]} ${time[0]} ? * ${week || '*'}`
        }
      } else if (data.cronType == 'MONTH') {
        if (!data.monthType && !data.time) {
          cronExpression = ''
        } else {
          const time = data.time.split(':')
          const month = data.monthType.join(',')
          cronExpression = `00 ${time[1]} ${time[0]} ${month || '*'} * ?`
        }
      }
      this.cronExpression = cronExpression
    },
    changeCronType (val) {
      const data = this.form
      if (val == 'DAILY') {
        data.time = '00:00'
        data.weekType = ''
        data.monthType = ''
        this.cronExpression = `00 00 00 * * ?`
      } else if (val == 'WEEK') {
        data.time = '00:00'
        data.monthType = []
        data.weekType = []
        this.cronExpression = `00 00 00 ? * ${data.weekType.join(',') ? data.weekType.join(',') : '*'}`
      } else if (val == 'MONTH') {
        data.time = '00:00'
        data.weekType = []
        data.monthType = []
        this.cronExpression = `00 00 00 ${data.monthType.join(',') ? data.monthType.join(',') : '*'} * ?`
      } else if (val == 'HOUR') {
        data.time = '00:00'
        data.weekType = ''
        data.monthType = ''
        data.hourType = '1'
        this.cronExpression = `00 00 * * * ?`
      } else if (val == 'MINUTE') {
        data.time = '00:00'
        data.weekType = ''
        data.monthType = ''
        this.cronExpression = `00 00/5 0-23 * * ?`
        this.form.intervalMinute = 5
        this.form.selectMinuteSlot = ['00:00', '23:59']
      }
    },
    changeHourPoint (val) {
      const data = this.form
      if (val.length == 0) {
        this.cronExpression = `00 00 * * * ?`
      } else {
        this.cronExpression = `00 00 ${val.join(',')} * * ?`
      }
    },
    changeHourType (val) {
      const data = this.form
      if (val == '1') {
        data.selectHour1 = []
        this.cronExpression = `00 00 * * * ?`
      } else if (val == '2') {
        data.interval = 1
        this.cronExpression = `00 00 0-23/1 * * ?`
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      console.log(data.selectHour1)
    },
    changeCronSelectHourSlot (val) {
      const data = this.form
      if (val.length == 0) {
        this.cronExpression = `00 00 * * * ?`
      } else {
        const time = val[0].split(':')
        const time2 = val[1].split(':')
        this.cronExpression = `00 ${time[1]} ${time[0]}-${time2[0]}/${data.interval} * * ?`
      }
    },
    changeHourInterval (val) {
      const data = this.form
      const { selectHourSlot } = data
      const time = selectHourSlot[0].split(':')
      const time2 = selectHourSlot[1].split(':')
      this.cronExpression = `00 ${time[1]} ${time[0]}-${time2[0]}/${val} * * ?`
    },
    changeCronSelectMinuteSlot (val) {
      const data = this.form
      if (val.length == 0) {
        this.cronExpression = `00 00 * * * ?`
      } else {
        const time = val[0].split(':')
        const time2 = val[1].split(':')
        this.cronExpression = `00 ${time[1]}/${data.intervalMinute} ${time[0]}-${time2[0]} * * ?`
      }
    },
    changeMinuteInterval (val) {
      const data = this.form
      const { selectMinuteSlot } = data
      const time = selectMinuteSlot[0].split(':')
      const time2 = selectMinuteSlot[1].split(':')
      this.cronExpression = `00 ${time[1]}/${val} ${time[0]}-${time2[0]} * * ?`
    },
    // 获取属性配置
    async getAttrConfigById () {
      this.loading++
      const params = { id: this.activeTab.data.id }
      const res = await this.$simpleAsyncTo(
        getAttrConfigById(params),
        '获取属性配置失败'
      )
      if (res) {
        const {
          name,
          id,
          type,
          opsUser,
          description,
          priority,
          jobType,
          dateBegin,
          dateEnd,
          jobCycle,
          rerunType,
          timeoutType,
          timeout,
          rerunTimes,
          rerunInterval,
          cronExpr,
          flowId
        } = res.data
        if (jobCycle) {
          const newJobCycle = JSON.parse(jobCycle)
          this.form = {
            name,
            id,
            type,
            opsUser,
            description,
            priority,
            jobType,
            effectiveDate: [dateBegin || '', dateEnd || ''],
            cronType: newJobCycle.cronType,
            time: newJobCycle.time,
            weekType: newJobCycle.weekType,
            monthType: newJobCycle.monthType,
            hourType: newJobCycle.hourType,
            selectHour1: newJobCycle.selectHour1,
            selectHourSlot: newJobCycle.selectHourSlot,
            interval: newJobCycle.interval,
            selectMinuteSlot: newJobCycle.selectMinuteSlot,
            intervalMinute: newJobCycle.intervalMinute,
            timeoutType,
            timeout,
            rerunType,
            rerunTimes,
            rerunInterval,
            flowId
          }
        }

        this.cronExpression = cronExpr
      }
      this.loading--
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  font-size: 14px;
  font-weight: bold;
}
.side-modal-footer {
  margin: 15px 15px;
  float: right;
}
.icon-bianjikaifajiedian-xin {
  color: #6ca0f5;
  font-size: 20px;
  vertical-align: middle;
  margin-right: 10px;
}
.input-value {
  width: 88px;
  margin: 0 10px;
}
</style>

<style lang="scss">
.time-picker {
  .el-time-spinner__list::after,
  .el-time-spinner__list::before {
    display: none !important;
  }
  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
</style>

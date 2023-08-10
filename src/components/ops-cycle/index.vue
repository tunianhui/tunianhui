<template>
  <el-form label-suffix="：" label-position="right" :label-width="labelWidth" :model="filter" :rules="rules" ref="filter" class="ops-cycle">
    <el-form-item label="时间属性" prop="job_type">
      <el-radio-group v-model="filter.job_type">
        <el-radio label="0">正常调度</el-radio>
        <el-radio label="1">暂时调度</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="调度周期" prop="job_cycle">
      <el-radio-group size="mini" v-model="filter.job_cycle" @change="periodSwitch">
        <el-radio-button v-for="(item, index) in periodList" :key="index" :label="item"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="multiple" label="选择时间" prop="choice_date" v-if="isShowChoiceDate" key="choice_date">
      <el-select size="mini" multiple v-model="filter.choice_date" key="scheduleAttr_choice_date" :multiple-limit="1">
        <el-option v-for="(item, index) in choiceDateList" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="divide-time" label="具体时间" prop="specific_time" v-if="isShowSpecificTime" key="specific_time">
      <el-select size="mini" v-model="filter.specific_time">
        <el-option v-for="(item, index) in hoursList" :key="index" :label="item" :value="item"></el-option>
      </el-select>
      <span class="units">时</span>
      <el-select size="mini" v-model="specific_time_suffix">
        <el-option v-for="(item, index) in minutesList" :key="index" :label="item" :value="item"></el-option>
      </el-select>
      <span class="units">分</span>
    </el-form-item>
    <template v-if="isShowIntervalDate">
      <el-form-item class="divide-time" label="开始时间" prop="date_begin" key="date_begin">
        <el-select size="mini" v-model="filter.date_begin">
          <el-option v-for="(item, index) in beginHoursList" :key="index" :label="item.value" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
        <span class="units">时</span>
        <el-select size="mini" v-model="date_begin_suffix">
          <el-option v-for="(item, index) in minutesList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <span class="units">分</span>
      </el-form-item>
      <!-- <el-form-item label="间隔时间" prop="interval_date" key="interval_date">
        <el-select size="mini" v-model="filter.interval_date" placeholder="请选择间隔时间">
          <el-option
            v-for="(item, index) in intervalDateList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="divide-time" label="结束时间" prop="date_end" key="date_end">
        <el-select size="mini" v-model="filter.date_end">
          <el-option v-for="(item, index) in endHoursList" :key="index" :label="item.value" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
        <span class="units">时</span>
        <el-select size="mini" v-model="date_end_suffix" disabled>
          <el-option v-for="(item, index) in minutesList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <span class="units">分</span>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import {
  periodList,
  weekList,
  monthslist,
  gapMinutesList,
  gapHoursList,
  minutesList,
  hoursList
} from './constant'

// import {dateFormat} from '@/libs/util'

export default {
  name: 'OpsCycle',
  props: {
    labelWidth: {
      type: String,
      default: '130px'
    },
    data: Object
  },
  data () {
    return {
      periodList,
      weekList,
      monthslist,
      gapMinutesList,
      gapHoursList,
      minutesList,
      hoursList,
      filter: {
        job_type: '0',
        job_cycle: '天',
        choice_date: [],
        specific_time: '00',
        date_begin: '00',
        // interval_date: 1,
        date_end: '23'
      },
      rules: {},
      specific_time_suffix: '00',
      date_begin_suffix: '00',
      date_end_suffix: '59',
      isShowChoiceDate: false,
      choiceDateList: null,
      isShowIntervalDate: false,
      intervalDateList: null,
      isShowSpecificTime: true
    }
  },
  computed: {
    beginHoursList () {
      const { date_end } = this.filter
      return hoursList.map(item => ({
        value: item,
        disabled: parseInt(item) > parseInt(date_end)
      }))
    },
    endHoursList () {
      const { date_begin } = this.filter
      return hoursList.map(item => ({
        value: item,
        disabled: parseInt(item) < parseInt(date_begin)
      }))
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.initFilter()
      }
    }
  },
  methods: {
    initFilter () {
      Object.assign(this.filter, this.data)
      const filter = this.filter
      filter.job_state = filter.job_state === 0
      filter.choice_date =
        typeof this.data.choice_date === 'string'
          ? filter.choice_date.split(',').map(item => item && parseInt(item))
          : []
      if (filter.job_cycle === '分钟' || filter.job_cycle === '小时') {
        this.date_begin_suffix =
          filter.date_begin && filter.date_begin !== '00'
            ? this.getTime(filter.date_begin, true)
            : '00'
        filter.date_begin =
          filter.date_begin && filter.date_begin !== '00'
            ? this.getTime(filter.date_begin)
            : '00'

        this.date_end_suffix =
          filter.date_end && filter.date_end !== '23'
            ? this.getTime(filter.date_end, true)
            : '59'
        filter.date_end =
          filter.date_end && filter.date_end !== '23'
            ? this.getTime(filter.date_end)
            : '23'
        // filter.interval_date =  filter.job_cycle === '分钟' ? 5 : 1
      } else if (
        filter.job_cycle === '周' ||
        filter.job_cycle === '天' ||
        filter.job_cycle === '月'
      ) {
        this.specific_time_suffix =
          filter.specific_time && filter.specific_time !== '00'
            ? this.getTime(filter.specific_time, true)
            : '00'
        filter.specific_time =
          filter.specific_time && filter.specific_time !== '00'
            ? this.getTime(filter.specific_time)
            : '00'
      }
      this.hasInitVal = true
      this.periodSwitch(this.filter.job_cycle)
    },
    periodSwitch (val) {
      const filter = this.filter
      switch (val) {
        case '天':
          this.isShowSpecificTime = true
          this.isShowChoiceDate = false
          this.isShowIntervalDate = false
          filter.specific_time = this.hasInitVal ? filter.specific_time : '00'
          this.specific_time_suffix = this.hasInitVal
            ? this.specific_time_suffix
            : '00'
          // filter.specific_time = '00'
          // this.specific_time_suffix = '00'
          filter.date_begin = ''
          filter.date_end = ''
          break
        case '周':
          this.isShowSpecificTime = true
          this.isShowChoiceDate = true
          this.isShowIntervalDate = false
          this.choiceDateList = this.weekList
          filter.specific_time = this.hasInitVal ? filter.specific_time : '00'
          this.specific_time_suffix = this.hasInitVal
            ? this.specific_time_suffix
            : '00'
          // filter.choice_date = ['星期一']
          filter.date_begin = ''
          // filter.choice_date = this.hasInitVal ? filter.choice_date && filter.choice_date !== 0 : [2]
          filter.choice_date =
            this.hasInitVal &&
              !!filter.choice_date &&
              (filter.choice_date.length !== 0 ||
                (filter.choice_date.length === 1 && filter.choice_date[0] !== 0))
              ? filter.choice_date
              : [2]
          // filter.choice_date = [0]
          filter.date_end = ''
          break
        case '月':
          this.isShowSpecificTime = true
          this.isShowChoiceDate = true
          this.isShowIntervalDate = false
          this.choiceDateList = this.monthslist
          filter.specific_time = this.hasInitVal ? filter.specific_time : '00'
          this.specific_time_suffix = this.hasInitVal
            ? this.specific_time_suffix
            : '00'
          filter.date_begin = ''
          filter.choice_date =
            this.hasInitVal &&
              !!filter.choice_date &&
              (filter.choice_date.length !== 0 ||
                (filter.choice_date.length === 1 && filter.choice_date[0] !== 0))
              ? filter.choice_date
              : [1]
          filter.date_end = ''
          break
        case '分钟':
          this.isShowSpecificTime = false
          this.isShowChoiceDate = false
          this.isShowIntervalDate = true
          this.intervalDateList = this.gapMinutesList
          filter.date_begin = this.hasInitVal ? filter.date_begin : '00'
          this.date_begin_suffix = this.hasInitVal
            ? this.date_begin_suffix
            : '00'
          // filter.interval_date =
          //   this.hasInitVal && filter.interval_date !== 1
          //     ? filter.interval_date
          //     : 5
          filter.date_end = this.hasInitVal ? filter.date_end : '23'
          this.date_end_suffix = this.hasInitVal ? this.date_end_suffix : '59'
          break
        case '小时':
          this.isShowSpecificTime = false
          this.isShowChoiceDate = false
          this.isShowIntervalDate = true
          this.intervalDateList = this.gapHoursList
          filter.date_begin = this.hasInitVal ? filter.date_begin : '00'
          this.date_begin_suffix = this.hasInitVal
            ? this.date_begin_suffix
            : '00'
          // this.interval_date = '1小时'
          // filter.interval_date = this.hasInitVal ? filter.interval_date : 1
          filter.date_end = this.hasInitVal ? filter.date_end : '23'
          this.date_end_suffix = this.hasInitVal ? this.date_end_suffix : '59'
          break
        default:
          break
      }
      this.hasInitVal = false
    },
    /**
     * [getTime 获取时间的时钟与分钟部分]
     * @param  {[type]} str [时间字符串]
     * @param  {[type]} flag [false: 为前面的时钟部分，true: 为后面的分钟部分]
     * @return {[type]}     [description]
     */
    getTime (str, flag) {
      const i = str.indexOf(':')
      return flag ? str.substring(i + 1) : str.substring(0, i)
    },
    getData () {
      const data = Object.create(null)
      const {
        specific_time,
        choice_date,
        date_begin,
        date_end,
        // interval_date,
        job_cycle,
        job_type
      } = this.filter

      data.job_cycle = job_cycle
      data.job_type = job_type

      if (job_cycle === '天') {
        data.specific_time = specific_time + ':' + this.specific_time_suffix
      } else if (job_cycle === '周' || job_cycle === '月') {
        data.choice_date = choice_date.join(',')
        data.specific_time = specific_time + ':' + this.specific_time_suffix
      } else if (job_cycle === '小时' || job_cycle === '分钟') {
        data.date_begin = date_begin + ':' + this.date_begin_suffix
        // data.interval_date = interval_date
        data.date_end = date_end + ':' + this.date_end_suffix
      }
      return data
    }
  }
}
</script>

<style lang="scss">
.ops-cycle {
  .el-select {
    width: 100%;
  }
  .divide-time {
    .el-date-editor {
      width: 116px;
    }
    .el-select {
      width: 102px;
    }
    .units {
      display: inline-block;
      padding: 0 5px;
    }
  }
}
</style>

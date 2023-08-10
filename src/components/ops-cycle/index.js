// const getTime = len =>
//   Array.from({length}, (d, i) => ({
//     label: i < 10 ? `0${i}` : i,
//     value: i
//   }))
// const hours = getTime(24)
// const minutes = getTime(60)
const dims = [
  {label: '日', value: 'day'},
  {label: '周', value: 'week'},
  {label: '月', value: 'mouth'},
  {label: '小时', value: 'hour'},
  {label: '分钟', value: 'minute'}
]

const weeks = [
  {value: '0', label: '周日'},
  {value: '1', label: '周一'},
  {value: '2', label: '周二'},
  {value: '3', label: '周三'},
  {value: '4', label: '周四'},
  {value: '5', label: '周五'},
  {value: '6', label: '周六'}
]

const days = Array.from({length: 31}, (d, i) => ({
  label: `${i + 1}日`,
  value: i + 1
}))

const hours = Array.from({length: 31}, (d, i) => ({
  label: `${i}时`,
  value: i
}))
const selectTimeList = {
  mouth: days,
  week: weeks,
  hour: hours
}
const minutes = Array.from({length: 11}, (d, i) => {
  const value = (i + 1) * 5
  return {
    label: value < 10 ? `0${value}` : value,
    value: value
  }
})

const gapList = {
  minute: minutes,
  hour: Array.from({length: 12}, (d, i) => ({
    label: i + 1,
    value: i + 1
  }))
}

const gapUnit = {
  minute: '分钟',
  hour: '小时'
}

export default {
  name: 'OpsCycle',
  props: {
    labelWidth: {
      type: String,
      default: '130px'
    }
  },
  data() {
    return {
      filter: {
        dim: 'day',
        time: '2000-01-01 00:00:00',
        selectTime: '',
        day: '',
        week: '',
        hourType: 'timing',
        timing: '',
        start: '2000-01-01 00:00:00',
        gap: '',
        end: '2000-01-01 23:59:00'
      },
      rules: {
        selectTime: {require: true, message: '必填项'}
      },
      pickerOptions: {
        selectableRange: '01:00:00 - 23:59:00'
      }
    }
  },
  render(h) {
    return (
      <el-form
        class="ops-cycle"
        label-suffix="："
        label-position="right"
        label-width={this.labelWidth}
        model={this.filter}
        rules={this.rules}
      >
        <el-form-item label="调度周期" prop="dim">
          <el-select v-model={this.filter.dim} on-change={this.changeDim}>
            {this.renderOptions(h, dims)}
          </el-select>
          {this.renderTimeRadio(h)}
        </el-form-item>
        {this.renderSelectTime(h)}
        {this.renderHourSecond(h)}
        {this.renderTimeRange(h)}
      </el-form>
    )
  },
  mounted() {
  },
  methods: {
    renderOptions(h, list) {
      return list.map(item => (
        <el-option
          key={item.value}
          label={item.label}
          value={item.value}
        ></el-option>
      ))
    },
    renderHourSecond(h) {
      return (
        ['day', 'week', 'mouth'].includes(this.filter.dim) && (
          <el-form-item label="具体时间" prop="time">
            <el-time-picker
              ref="timePicker"
              v-model={this.filter.time}
              format="HH:mm"
              clearable={false}
            ></el-time-picker>
          </el-form-item>
        )
      )
    },
    // 选择时间
    renderSelectTime(h) {
      const {dim, hourType} = this.filter
      return (
        (['mouth', 'week'].includes(this.filter.dim) ||
          (dim === 'hour' && hourType === 'timing')) && (
          <el-form-item label="选择时间" prop="selectTime">
            <el-select multiple v-model={this.filter.selectTime}>
              {this.renderOptions(h, selectTimeList[this.filter.dim])}
            </el-select>
          </el-form-item>
        )
      )
    },
    renderTimeRadio(h) {
      return (
        this.filter.dim === 'hour' && (
          <el-radio-group v-model={this.filter.hourType} class="ml-10">
            <el-radio label="range">时间段</el-radio>
            <el-radio label="timing">时间点</el-radio>
          </el-radio-group>
        )
      )
    },
    // 渲染小时开始-间隔-结束
    renderTimeRange(h) {
      const {dim} = this.filter
      return (
        ['hour', 'minute'].includes(dim) && (
          <el-form-item label="开始/间隔/结束" class="start-gap-end">
            <el-time-picker
              ref="timePicker"
              v-model={this.filter.start}
              format="HH:mm"
              clearable={false}
            ></el-time-picker>
            <span class="separator">/</span>
            <el-select v-model={this.filter.gap}>
              {this.renderOptions(h, gapList[dim])}
            </el-select>
            <span class="unit">{gapUnit[dim]}</span>
            <span class="separator">/</span>
            <el-time-picker
              ref="timePicker"
              v-model={this.filter.end}
              format="HH:mm"
              clearable={false}
              picker-options={this.pickerOptions}
            ></el-time-picker>
          </el-form-item>
        )
      )
    },
    changeDim(val) {
      if (val === 'week') {
        this.filter.selectTime = weeks[0].value
      }
      if (val === 'mouth') {
        this.filter.selectTime = days[0].value
      }
      if (val === 'hour' && this.filter.hourType === 'timing') {
        this.filter.selectTime = hours[0].value
      }
      this.filter.hourType = 'timing'
    },
    changeTime(val) {
    }
  }
}

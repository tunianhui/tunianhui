<template>
  <section class="new-build">
    <el-dialog
      :title="`${title}任务监控`"
      :visible.sync="dialogFormVisible"
      @close="close"
      width="50%"
    >
      <div :style="active === 1 ? {maxHeight: `${dialogBodyHeight}px`} : {height: `${dialogBodyHeight}px`}">
        <el-row v-if="title !== '编辑'">
          <el-col :span="16" :offset="4">
            <el-steps :active="active" simple class="form-steps">
              <el-step title="配置报警原因" icon="icon iconfont icon-1"></el-step>
              <el-step title="选择监控项" icon="icon iconfont icon-2"></el-step>
            </el-steps>
          </el-col>
        </el-row>
        <div v-if="active === 1" class="mt-10">
          <el-form :model="form" :rules="rules" :hide-required-asterisk="false" label-suffix="：" ref="form">
            <el-form-item label="报警原因" :label-width="formLabelWidth" prop="alarm_reason">
              <el-radio-group v-model="form.alarm_reason" @change="reasonChange">
                <el-radio label="1">出错</el-radio>
                <el-radio label="0">完成</el-radio>
                <el-radio label="3">未完成
                  <el-time-picker v-model="no_finish_time" format="HH:mm" value-format="HH:mm" :disabled="form.alarm_reason !== '3'"></el-time-picker>
                  <div class="el-form-item__error custom-error" v-if="noFinishError">请选择未完成时间</div>
                </el-radio>
                <el-radio label="2">运行超时
                  <el-input class="number-input mr-5" v-model.number="timeout" :disabled="form.alarm_reason !== '2'"></el-input>分钟
                  <div class="el-form-item__error custom-error" v-if="timeoutError">请输入运行超时时间</div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报警频率" :label-width="formLabelWidth" prop="send_frequence">
              <el-input class="number-input mr-5" v-model.number="form.send_frequence"></el-input>分钟/次
            </el-form-item>
            <el-form-item label="监控区间" :label-width="formLabelWidth" prop="section_type">
              <el-radio-group v-model="form.section_type" @change="sectionChange">
                <el-radio label="0">全天</el-radio>
                <el-radio label="1">指定时段
                  <el-time-picker  v-model="start_time" :disabled="form.section_type !== '1'"
                  class="ml-5" format="HH:mm" value-format="HH:mm" placeholder="起始时间">
                  </el-time-picker> ~
                  <el-time-picker  v-model="end_time" :disabled="form.section_type !== '1'"
                  class="ml-5" format="HH:mm" value-format="HH:mm" placeholder="结束时间">
                  </el-time-picker>
                  <div class="el-form-item__error custom-error" v-if="sectiontimeError">请选择指定时段</div>
                  <div class="el-form-item__error custom-error" v-if="timeCompareError">结束时间需要大于起始时间</div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接收对象" :label-width="formLabelWidth" prop="receive_person_type">
              <el-radio-group v-model="form.receive_person_type" @change="personChange">
                <el-radio label="0">责任人</el-radio>
                <el-radio label="1">自定义
                  <el-select v-model="receive_person" placeholder="请选择" :disabled="form.receive_person_type !== '1'" class="ml-5">
                    <el-option v-for="item in receiverList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                  <div class="el-form-item__error custom-error" v-if="receivePersonError">请选择自定义接收对象</div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接收方式" :label-width="formLabelWidth" prop="receive_type">
              <el-checkbox-group v-model="form.receive_type">
                <el-checkbox label="0">邮件</el-checkbox>
                <el-checkbox label="1">短信</el-checkbox>
                <el-checkbox label="2">微信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="发送次数" :label-width="formLabelWidth" prop="send_count">
              <el-input class="number-input mr-5" v-model.number="form.send_count"></el-input>分钟/次
            </el-form-item>
          </el-form>
        </div>
        <el-row v-if="active === 2 && title !== '编辑'" class="mt-10 task-wrapper" :gutter="90">
          <el-col :span="14">
            <div class="pr">
              <div class="info-title">监控项选择</div>
              <el-tabs v-model="activeTab" @tab-click="tabHandleClick">
                <el-tab-pane :label="item.label" :name="item.name" lazy v-for="item in tabs" :key="item.name">
                  <div class="task-list">
                    <div class="name">任务名称</div>
                    <!-- <el-input placeholder="请输入任务名称" v-model="name" prefix-icon="el-icon-search"></el-input> -->
                    <div class="checkbox-list">
                      <el-checkbox class="mt-10 mb-10" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                      <el-checkbox-group class="group-box" v-model="checkedTasks" @change="handleCheckedChange">
                        <div v-for="task in taskList" :key="task.cube_id" class="mb-5">
                          <el-checkbox :label="task.cube_id">{{task.cube_code}}</el-checkbox>
                        </div>
                      </el-checkbox-group>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <i class="el-icon-d-arrow-right" @click="changeChoose"></i>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="choose-box">
              <div class="choose-title">
                已选监控项
                <!-- ({{choose + '/' + all}}) -->
                </div>
              <el-select v-model="monitor" placeholder="全部类型" class="task-type" @change="typeChange">
                <el-option v-for="item in monitorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="task-title">
              <div class="task-name">监控项</div>
              <div class="type">类型</div>
            </div>
            <ul class="task-list checked-list">
              <li v-for="item in checkedTaskList" :key="item.cube_id">
                <div class="task-name">
                  <OverflowTooltip class="width-1">{{item.cube_code}}</OverflowTooltip>
                </div>
                <div class="type">{{monitorList.find(c => c.value === item.type).label}}</div>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="prev" v-if="active === 2">上一步</el-button>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" v-if="active === 2 || title === '编辑'">确 定</el-button>
        <el-button type="primary" @click="next" v-if="active === 1 && title !== '编辑'">下一步</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import dialogHeight from '@/mixins/dialog-height'
import { listCubes, save, edit } from '@/api/rd/alarm-monitor/offline'
export default {
  name: 'NewBuild',
  props: {
    title: {
      type: String
    },
    receiverList: Array,
    data: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [dialogHeight],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      active: 1,
      dialogFormVisible: true,
      formLabelWidth: '120px',
      no_finish_time: '',
      timeout: '',
      start_time: '',
      end_time: '',
      receive_person: '',
      form: {
        alarm_reason: '',
        send_frequence: '',
        section_type: '',
        receive_person_type: '',
        receive_type: [],
        send_count: ''
      },
      rules: {
        alarm_reason: [{required: true, message: '请选择报警原因', trigger: 'change'}],
        send_frequence: [
          {required: true, message: '请输入报警频率', trigger: 'change'},
          {type: 'number', message: '报警频率必须为数字值'}
        ],
        section_type: [{required: true, message: '请选择监控区间', trigger: 'change'}],
        receive_person_type: [{required: true, message: '请选择接收对象', trigger: 'change'}],
        receive_type: [{required: true, message: '请选择接收方式', trigger: 'change'}],
        send_count: [
          {required: true, message: '请输入发送次数', trigger: 'change'},
          {type: 'number', message: '发送次数必须为数字值'}
        ]
      },
      noFinishError: false,
      timeoutError: false,
      sectiontimeError: false,
      timeCompareError: false,
      receivePersonError: false,
      tabs: [{
        label: '数据处理任务',
        name: '0'
      }, {
        label: '建模任务',
        name: '1'
      }, {
        label: '萃取任务',
        name: '2'
      }, {
        label: '质量任务',
        name: '3'
      }],
      activeTab: '0',
      name: '',
      taskList: [],
      monitor: 'all',
      monitorList: [
        {label: '全部类型', value: 'all'},
        {label: '数据处理任务', value: '0'},
        {label: '建模任务', value: '1'},
        {label: '萃取任务', value: '2'},
        {label: '质量任务', value: '3'}
      ],
      choose: 5,
      all: 20,
      checkAll: false,
      checkedTasks: [],
      isIndeterminate: false,
      checkedTaskList: [],
      checkedAllTaskList: [],
      reqParams: {},
      id: ''
    }
  },
  watch: {
    title: {
      handler(val) {
        if (val === '编辑') {
          this.form = {
            alarm_reason: this.data.alarm_reason,
            send_frequence: this.data.send_frequence,
            section_type: this.data.section_type,
            receive_person_type: this.data.receive_person_type,
            receive_type: this.data.receive_type.split(','),
            send_count: this.data.send_count
          }
          this.no_finish_time = this.data.no_finish_time
          this.timeout = this.data.timeout
          this.start_time = this.data.start_time
          this.end_time = this.data.end_time
          this.receive_person = this.data.receive_person
          console.log(this.data, '===this.data===')
          this.id = this.data.id
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.listCubes()
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 新增
    async save() {
      const res = await this.$simpleAsyncTo(save(this.reqParams), '新建')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('close', 'refresh')
      }
    },
    // 修改
    async edit() {
      this.reqParams.id = this.id
      const res = await this.$simpleAsyncTo(edit(this.reqParams), '修改')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('close', 'refresh')
      }
    },
    submit() {
      if (this.title === '新建') {
        if (this.checkedAllTaskList.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择任务！'
          })
          return
        }
        let cubes = []
        this.checkedAllTaskList.forEach(item => {
          cubes.push({
            cube_id: item.cube_id,
            cube_name: item.cube_name,
            cube_code: item.cube_code
          })
        })
        this.reqParams.cubes = JSON.stringify(cubes)
        this.save()
      }
      if (this.title === '编辑') {
        this.validate('edit')
      }
    },
    close() {
      this.$emit('close')
    },
    next() {
      this.validate('add')
    },
    validate(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.noFinishError = false
          this.timeoutError = false
          this.sectiontimeError = false
          this.timeCompareError = false
          this.receivePersonError = false
          this.reqParams = {
            ...this.form,
            receive_type: this.form.receive_type.join(',')
          }
          if (this.form.alarm_reason === '3') {
            if (this.no_finish_time === '') {
              this.noFinishError = true
              return
            } else {
              this.reqParams.no_finish_time = this.no_finish_time
            }
          }
          if (this.form.alarm_reason === '2') {
            if (this.timeout === '') {
              this.timeoutError = true
              return
            } else {
              this.reqParams.timeout = this.timeout
            }
          }
          if (this.form.section_type === '1') {
            if (this.start_time === '' || this.end_time === '') {
              this.sectiontimeError = true
              return
            } else if (this.end_time <= this.start_time) {
              this.timeCompareError = true
              return
            } else {
              this.reqParams.start_time = this.start_time
              this.reqParams.end_time = this.end_time
            }
          }
          if (this.form.receive_person_type === '1') {
            if (this.receive_person === '') {
              this.receivePersonError = true
              return
            } else {
              this.reqParams.receive_person = this.receive_person
            }
          }
          if (type === 'add') {
            this.active++
          }
          if (type === 'edit') {
            this.edit()
          }
        }
      })
    },
    reasonChange() {
      this.noFinishError = false
      this.timeoutError = false
    },
    sectionChange() {
      this.sectiontimeError = false
    },
    personChange() {
      this.receivePersonError = false
    },
    // 任务列表
    async listCubes() {
      const params = {
        type: this.activeTab
      }
      const res = await this.$simpleAsyncTo(listCubes(params), '任务列表')
      if (res) {
        this.taskList = res.data
        this.checkedTasks = []
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    prev() {
      this.active--
    },
    changeChoose() {
      this.monitor = 'all'
      this.taskList.forEach(task => {
        if (this.checkedTasks.find(id => id === task.cube_id)) {
          if (!this.checkedAllTaskList.find(item => item.cube_id === task.cube_id)) {
            this.checkedAllTaskList.push({
              ...task,
              type: this.activeTab
            })
          }
        }
      })
      this.checkedTaskList = this.checkedAllTaskList
    },
    tabHandleClick() {
      this.monitor = 'all'
      this.listCubes()
    },
    typeChange() {
      if (this.monitor === 'all') {
        this.checkedTaskList = this.checkedAllTaskList
      } else {
        this.checkedTaskList = this.checkedAllTaskList.filter(item => item.type === this.monitor)
      }
    },
    handleCheckAllChange(val) {
      this.checkedTasks = val ? this.taskList.map(item => {
        return item.cube_id
      }) : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.taskList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.taskList.length
    }
  }
}
</script>

<style lang="scss">
.new-build {
  .custom-error {
    left: 80px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 120px;
  }
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 360px;
  }
  .number-input {
    width: 120px;
  }
  .form-steps {
    background: transparent;
    .el-step__arrow::before,
    .el-step__arrow::after {
      background: transparent;
    }
    .el-step__arrow {
      border-top: 1px dashed #303133;
      height: 1px;
      margin: 9px;
    }
    .icon {
      font-size: 18px;
    }
  }
  .info-title {
    position: absolute;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #333;
  }
  .el-tabs__nav-scroll {
    margin-left: 100px;
  }
  .task-wrapper {
    height: calc(100% - 56px);
    >.el-col {
      height: 100%;
    }
    .pr {
      position: relative;
      height: 100%;
      width: 100%;
    }
    .el-tabs,
    .el-tabs__content,
    .el-tab-pane {
      height: 100%;
    }
    .el-icon-d-arrow-right {
      position: absolute;
      font-size: 24px;
      right: -62px;
      top: 50%;
      transform: translateY(-50%);
      &:hover {
        color: $--color-primary;
      }
    }
  }
  .choose-box {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 15px;
    .choose-title{
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #333;
    }
    .task-type {
      width: 120px;
      position: absolute;
      right: 0px;
    }
  }
  .task-list {
    background: #fff;
    padding: 20px;
    height: calc(100% - 55px);
    overflow: hidden;
    &.checked-list {
      height: calc(100% - 101px);
      overflow: auto;
      padding-top: 0px;
    }
    .name {
      font-size: 16px;
      color: #333;
      margin-bottom: 10px;
    }
    li {
      display: flex;
      margin-bottom: 5px;
    }
    .checkbox-list {
      height: calc(100% - 25px);
    }
    .group-box {
      height: calc(100% - 45px);
      overflow: auto;
    }
  }
  .task-name {
    text-align: left;
    flex: 1;
  }
  .type {
    text-align: right;
    width: 90px;
  }
  .task-title {
    display: flex;
    font-size: 16px;
    color: #333;
    background: #fff;
    padding: 20px;
    padding-bottom: 5px;
  }
  .width-1 {
    width:calc(100% - 1px);
  }
}
</style>

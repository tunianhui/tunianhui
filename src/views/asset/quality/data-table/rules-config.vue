<template>
  <div class="rules-config-table">
    <el-button type="text" class="font-16" @click="$emit('goBack')"> &lt; 质量规则列表</el-button>
    <div class="report-title mb-10">
      <div>{{data.table_code}} 质量规则配置</div>
    </div>
    <div class="rule-table-info mb-15">
      <div class="table-icon mr-20">
        <i class="iconfont icon-weiduluojibiao"></i>
      </div>
      <div class="table-info-content">
        <div class="table-info-header">
          <span>{{data.table_code}}</span>
          <a href="javascript:;" class="font-14" @click="qualityReport">质量报告 &gt;</a>
        </div>
        <div class="basic-info">
          <div class="info-item mr-40">
            <span class="basic-label">所需项目：</span>
            <OverflowTooltip class="basic-value">{{data.project_code}}</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">负责人：</span>
            <OverflowTooltip class="basic-value">{{data.oper_user}}</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">节点任务：</span>
            <OverflowTooltip class="basic-value">{{data.job_id}}</OverflowTooltip>
          </div>
        </div>
      </div>
    </div>
    <InfoList title="告警设置" :list="alarmList" @edit="alarmEdit"></InfoList>
    <AlarmEdit v-if="alarmEditVisible" :visible="alarmEditVisible" @close="alarmEditClose" @refresh="alarmEditRefresh" :baseId="data.id" :alarm="alarm"></AlarmEdit>
    <InfoList title="调度设置" :list="dispatchList" @edit="dispatchEdit"></InfoList>
    <SideModal v-if="dispatchEditVisible" :visible.sync="dispatchEditVisible" title="调度配置" @confirm="dispatchConfirm">
      <component ref="sideComponent" :is="component" :data="dispatch"></component>
    </SideModal>
    <section class="head">
      <div class="head-title">质量规则配置</div>
      <div class="head-action">
        <el-button type="primary" icon="el-icon-plus" class="action-btn" @click="addHandle">创建分区表达式</el-button>
      </div>
    </section>
    <AddExpression v-if="visible" :visible="visible" @close="close" @refresh="refresh" :obj="{type: 'add', part: {base_id: data.id}}"></AddExpression>
    <ExpressList :data="item" v-for="(item, i) in list" :key="i" :ind="i" v-loading="!!loading" @refresh="refresh" :curRuleData="data"></ExpressList>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import InfoList from './info-list'
import AlarmEdit from './alarm-edit'
// import ScheduleConfig from './schedule-config'
import ExpressList from './express-list'
import AddExpression from './add-expression'
import SideModal from '@c/side-modal'
import {
  auditTableRuleList,
  queryAlarmInstanceByBaseId,
  queryDispatchById,
  dispatchEdit
} from '@/api/asset/quality/tableRules'
const ScheduleConfig = _ =>
  import(/* webpackChunkName: "ScheduleConfig" */ '@/views/rd/dev/norm-modeling/modeling/schedule-config')
export default {
  name: 'RulesConfigTable',
  components: {
    OverflowTooltip,
    InfoList,
    AlarmEdit,
    ExpressList,
    AddExpression,
    SideModal
  },
  props: {
    data: Object
  },
  data () {
    return {
      loading: 0,
      list: [],
      visible: false,
      alarmList: [
        { label: '告警接收人', value: '', key: 'receive_person' },
        { label: '告警方式', value: '', key: 'alarm_type' }
      ],
      dispatchList: [
        { label: '时间属性', value: '正常调度', key: 'job_type' },
        { label: '调度周期', value: '每天10:30', key: 'job_cycle' }
      ],
      alarmEditVisible: false,
      alarm: {},
      dispatch: {},
      component: ScheduleConfig,
      dispatchEditVisible: false
    }
  },
  watch: {
    data: {
      handler (val) {
        this.init(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async init (val) {
      await this.auditTableRuleList(val)
      await this.queryAlarmInstanceByBaseId(val)
      await this.queryDispatchById(val)
      if (val.source_config && val.source_config === 'startConfig') {
        this.alarmEditVisible = true
      }
    },
    addHandle () {
      this.visible = true
    },
    refresh () {
      this.visible = false
      this.auditTableRuleList(this.data)
    },
    close () {
      this.visible = false
    },
    async auditTableRuleList (val) {
      this.loading++
      const res = await this.$simpleAsyncTo(auditTableRuleList({
        base_id: val.id
      }), '获取数据失败')
      if (res) {
        this.list = res.data.map(item => {
          console.log(item, 'item')
          return {
            // expression: item.part_name + '=' + item.part_format,
            expression: item.part_all,
            part_id: item.part_id,
            part_type: item.part_type,
            tableData: item.rule_data,
            part_day: item.part_day,
            part_hour: item.part_hour
          }
        })
      }
      this.loading--
    },
    async queryAlarmInstanceByBaseId (val) {
      const res = await this.$simpleAsyncTo(queryAlarmInstanceByBaseId({
        base_id: val.id
      }), '获取数据失败')
      if (res) {
        this.alarmList.forEach(item => {
          item.value = res.data[item.key]
        })
        this.alarm = res.data
      }
    },
    async queryDispatchById (val) {
      const res = await this.$simpleAsyncTo(queryDispatchById({
        base_id: val.id
      }), '获取数据失败')
      if (res) {
        this.dispatch = res.data
        const dispatch = {
          job_type: res.data.dispatchData.job_type === '0' ? '正常调度' : '暂停调度',
          job_cycle: res.data.dispatchData.job_cycle_info
        }
        this.dispatchList.forEach(item => {
          item.value = dispatch[item.key]
        })
      }
    },
    alarmEdit () {
      this.alarmEditVisible = true
    },
    alarmEditClose () {
      this.alarmEditVisible = false
    },
    alarmEditRefresh () {
      this.alarmEditVisible = false
      this.queryAlarmInstanceByBaseId(this.data)
    },
    dispatchEdit () {
      this.dispatchEditVisible = true
    },
    async dispatchConfirm () {
      const data = this.$refs.sideComponent.getData()
      if (data.job_cycle === '周' || data.job_cycle === '月') {
        if (data.choice_date === '' || data.choice_date === null) {
          return this.$message({
            type: 'warning',
            message: '请选择时间'
          })
        }
      }
      this.globalLoading()
      const res = await this.$simpleAsyncTo(dispatchEdit(data), '保存调度配置失败')
      if (res) {
        this.dispatchEditVisible = false
        this.queryDispatchById(this.data)
        this.$message({
          message: '保存调度配置成功',
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    qualityReport () {
      this.$router.push({
        path: '/asset/quality/quality-manage/record',
        query: {
          data: this.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
.rules-config-table {
  .rule-table-info {
    display: flex;
    padding: 16px 20px;
    background-color: #f8f8f8;
    .table-icon {
      width: 40px;
      height: 40px;
      background: #6ca0f5;
      text-align: center;
      line-height: 40px;
      i {
        color: #fff;
        font-size: 30px;
      }
    }
    .table-info-content {
      flex: 1;
      .table-info-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      .basic-info {
        display: flex;
        .info-item {
          font-size: 12px;
          .basic-label {
            color: rgba($color: #000, $alpha: .5);
          }
          .basic-value {
            color: rgba($color: #000, $alpha: .8);
            width: 100px;
          }
        }
      }
    }
  }
}

</style>

<template>
  <div class="quality-report" v-loading="!!loading">
    <el-button type="text" class="font-16" @click="$emit('goBack')"> &lt; 校验记录列表</el-button>
    <div class="report-title mb-10">
      <div>{{data.table_code}} 质量报告</div>
      <div>
        <el-date-picker v-model="time" align="right" type="date" placeholder="选择日期" class="mr-10" popper-class="check-time" @change="changeTime"></el-date-picker>
      </div>
    </div>
    <div class="data-detail mb-10">
      <!-- <div class="detail-icon">
        <span>
          <i class="iconfont icon-weiduluojibiao"></i>
          逻辑维度表
        </span>
      </div> -->
      <div class="detail-info">
        <div class="font-18">{{data.table_code}}</div>
        <div class="basic-info">
          <div class="info-item mr-40">
            <span class="basic-label">所属项目：</span>
            <OverflowTooltip class="basic-value">{{data.project_code}}</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">负责人：</span>
            <OverflowTooltip class="basic-value">{{data.oper_user}}</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">节点ID：</span>
            <OverflowTooltip class="basic-value">{{total.nodeId}}</OverflowTooltip>
          </div>
        </div>
        <div class="basic-info">
          <div class="info-item mr-40">
            <span class="basic-label">报警通知：</span>
            <OverflowTooltip class="basic-value">{{total.alarm_receive_person}}</OverflowTooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="quality-analyze">
      <div class="analyze-header">
        <div>质量分析结果</div>
        <div class="run-time font-12">任务运行时间：{{total.task_run_time}}</div>
      </div>
      <div class="analyze-body">
        <div class="analyze-body-left">
          <div class="tip">
            校验累计异常:
            <div class="number">{{total.rule_total_error}}</div>
          </div>
          <div class="large-low">
            <div class="font-12">
              <i class="iconfont icon-jinggao1 font-16" style="color: #f33"></i>
              强规则累计异常：
              <span>{{total.strong_rule_error}}</span>
              个
            </div>
            <div class="font-12">
              <i class="iconfont icon-jinggao2 font-16" style="color: #ffc20f"></i>
              强规则累计异常：
              <span>{{total.weak_rule_error}}</span>
              个
            </div>
          </div>
        </div>
        <div class="analyze-body-center">
          <div class="tip">
            校验累计异常
            <div class="number">
              {{total.rule_total_verify}}<span class="special">/{{total.rule_total}}</span>
              <el-tooltip class="item" effect="dark" content="校验规则数/总规则数" placement="top">
                <i class="el-icon-info font-12" style="color:rgba(0,0,0,0.5)"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="level font-12">
            <div class="table">表级别规则：{{total.table_rule_verify}}/{{total.table_rule}}</div>
            <div class="field">字段级别规则：{{total.column_rule_verify}}/{{total.column_rule}}</div>
            <div class="custom">自定义规则：{{total.custom_rule_verify}}/{{total.custom_rule}}</div>
          </div>
          <div class="large-low font-12">
            <div>强规则：{{total.strong_rule_verify}}/{{total.strong_rule}}</div>
            <div>弱规则：{{total.weak_rule_verify}}/{{total.weak_rule}}</div>
          </div>
        </div>
        <div class="analyze-body-right">
          <div class="tip">
            评分值:
            <div class="number">{{total.total_score}}</div>
          </div>
          <div class="large-low font-12">
            <div>表级规则校验评分：{{total.table_rule_score}}</div>
            <div>字段级规则校验评分：{{total.column_rule_score}}</div>
            <div>自定义级规则校验评分：{{total.custom_rule_score}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="report-detail">
      <div class="report-header">
        <div class="">报告详情</div>
        <!-- <div class="orientation font-12">
          定位
          <el-select v-model="value" placeholder="" style="width: 360px;" class="mr-5 ml-5">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-checkbox v-model="checked">仅显示异常结果</el-checkbox>
        </div> -->
      </div>
      <div class="report-detail-table" v-for="check in checkList" :key="check.title">
        <div class="info-table mb-10" v-for="(item, i) in check.list" :key="check.key + i">
          <ul class="check-info">
            <li>
              <div class="title">
                <i :class="item.showDetail ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" @click="detailCollapse(check, item)"></i>
                {{check.title}}
              </div>
            </li>
            <li v-if="item.object_code">
              <div class="label" v-if="check.key === 'column_rule'">字段名称：</div>
              <div class="label" v-if="check.key === 'table_rule'">表名称：</div>
              <div class="value">{{item.object_code}}</div>
            </li>
            <li>
              <div class="label">稽核规则数：</div>
              <div class="value">{{item.rule_num}}</div>
            </li>
            <li>
              <div class="label">评分值：</div>
              <div class="value">{{item.object_score}}</div>
            </li>
          </ul>
          <el-table :data="item.detail" v-if="item.showDetail" style="width: 100%" @row-click="rowClick">
            <el-table-column prop="template_name" label="规则模版名称"></el-table-column>
            <el-table-column prop="audit_part" label="分区"></el-table-column>
            <el-table-column prop="rule_level" label="规则属性">
              <template slot-scope="scope">
                {{scope.row.rule_level === '0' ? '强规则': '弱规则'}}
              </template>
            </el-table-column>
            <el-table-column prop="result_value" label="实际值"></el-table-column>
            <el-table-column prop="comparison_name" label="比较方式"></el-table-column>
            <el-table-column prop="threshold" label="监控阈值"></el-table-column>
            <el-table-column prop="audit_status" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.audit_status === 'false'">
                  <i class="iconfont icon-jinggao2 font-14" style="color: #FFC20F"></i> 异常
                </span>
                <span v-if="scope.row.audit_status === 'true'">
                  <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 正常
                </span>
              </template>
            </el-table-column>
            <el-table-column label="详情" width="50">
              <template slot-scope="scope">
                <el-button type="text" @click="reportDetailHandle(scope.row)"><i class="iconfont icon-guizepeizhi font-14 color-btn"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="ckeck-instance">
      <div class="font-14" style="background-color:#fff;padding:10px">
        <div class="font-14">规则校验实例</div>
        <el-table :data="tableList" style="width: 100%">
          <el-table-column prop="id" label="节点ID">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.id}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="project_name" label="项目">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.project_name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="table_code" label="表名称">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.table_code}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="audit_part" label="分区"></el-table-column>
          <el-table-column prop="rule_name" label="规则"></el-table-column>
          <el-table-column prop="oper_user" label="负责人"></el-table-column>
          <el-table-column prop="audit_time" label="执行时间" width="260">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.audit_time}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="run_status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.run_status === '1'">
                <i class="iconfont icon-jinggao2 font-14" style="color: #F33"></i> 失败
              </span>
              <span v-if="scope.row.run_status  === '0'">
                <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 通过
              </span>
            </template>
          </el-table-column>
          <el-table-column label="日志" width="50">
            <template slot-scope="scope">
              <el-button type="text" @click="reportLogHandle(scope.row)"><i class="iconfont icon-guizepeizhi font-14 color-btn"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <ReportDetail :visible="visible" v-if="visible" :params="{base_id: id, ruleId: ruleId}" @close="close"></ReportDetail>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import ReportDetail from './report-detail'
import {dateFormat} from '@/libs/util'
import {
  getVerifyReportInfo,
  getVerifyInstance,
  getRuleReportDetail
} from '@/api/asset/quality/record'
export default {
  name: 'QualityReport',
  components: {
    OverflowTooltip,
    ReportDetail
  },
  props: {
    data: Object
  },
  data() {
    return {
      id: '',
      time: '',
      value: '',
      options: [],
      checked: false,
      visible: false,
      loading: 0,
      total: {
        rule_total_error: '',
        strong_rule_error: '',
        weak_rule_error: '',
        rule_total_verify: '',
        rule_total: '',
        table_rule_verify: '',
        table_rule: '',
        column_rule_verify: '',
        column_rule: '',
        custom_rule_verify: '',
        custom_rule: '',
        strong_rule_verify: '',
        weak_rule_verify: '',
        strong_rule: '',
        weak_rule: '',
        total_score: '',
        table_rule_score: '',
        column_rule_score: '',
        custom_rule_score: '',
        task_run_time: '',
        nodeId: '',
        alarm_receive_person: ''
      },
      checkList: [
        {title: '字段级别校验', key: 'column_rule', list: []},
        {title: '表级别校验', key: 'table_rule', list: []},
        {title: '自定义校验', key: 'custom_rule', list: []}
      ],
      ruleId: '',
      tableList: []
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.time = val.last_time
        this.id = val.id
        this.refresh()
      }
    }
  },
  created() {
  },
  methods: {
    changeTime(val) {
      this.time = dateFormat(val, 'YYYY-MM-dd')
      this.refresh()
    },
    refresh() {
      this.getVerifyReportInfo()
      this.getRuleReportDetail()
    },
    rowClick(row) {
      this.ruleId = row.rule_id
      this.getVerifyInstance()
    },
    async getVerifyReportInfo() {
      this.loading++
      const params = {
        base_id: this.id,
        maxDate: this.time
      }
      const res = await this.$simpleAsyncTo(getVerifyReportInfo(params), '获取失败')
      if (res) {
        this.total = res.data
      }
      this.loading--
    },
    async getRuleReportDetail() {
      this.loading++
      const params = {
        base_id: this.id,
        audit_time: this.time
      }
      const res = await this.$simpleAsyncTo(getRuleReportDetail(params), '获取失败')
      if (res) {
        this.checkList.forEach(item => {
          item['list'] = []
          let list = res.data[item.key]
          list.forEach((ele, i) => {
            ele['showDetail'] = false
            ele['id'] = item.key + (i + 1)
          })
          item['list'] = list
        })
        this.ruleId = res.data.rule_id
        this.getVerifyInstance()
      }
      this.loading--
    },
    async getVerifyInstance() {
      this.loading++
      const params = {
        base_id: this.id,
        maxDate: this.time,
        ruleId: this.ruleId
      }
      const res = await this.$simpleAsyncTo(getVerifyInstance(params), '获取失败')
      if (res) {
        this.tableList = res.data
      }
      this.loading--
    },
    reportDetailHandle(row) {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    reportLogHandle(row) {
      window.open(`${window.location.protocol}//${window.location.host}/asset/log?id=${row.id}`)
    },
    detailCollapse(check, item) {
      console.log(this.checkList, check, item)
      this.checkList.forEach(c => {
        if (c.key === check.key) {
          c.list.forEach(d => {
            if (d.id === item.id) {
              d.showDetail = !d.showDetail
            } else {
              d.showDetail = false
            }
          })
        } else {
          c.list.forEach(d => {
            d.showDetail = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.quality-report {
  padding: 10px 20px !important;
  overflow: auto;
  .report-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    line-height: 28px;
    font-size: 18px;
    .el-input__inner {
      border-radius: 0;
    }
  }
  .data-detail {
    height: 90px;
    display: flex;
    background-color: $grey8;
    .detail-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90px;
      background: #a186ff;
      color: #fff;
      >span {
        width: 60px;
        font-size: 12px;
        text-align: center;
        i {
          font-size: 30px;
          display: block;
          margin-bottom: 7px;
        }
      }
    }
    .detail-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 0;
      .basic-info {
        display: flex;
        .info-item {
          font-size: 12px;
          .basic-label {
            color: rgba($color: #000000, $alpha: 0.5);
          }
          .basic-value {
            color: rgba($color: #000000, $alpha: 0.8);
            width: 120px;
          }
        }
      }
    }
  }
  .quality-analyze {
    background-color: $grey8;
    padding: 15px;
    margin-bottom: 10px;
    .analyze-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .analyze-body {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      height: 90px;
      background-color: transparent;
      .flex {
        display: flex;
        align-items: center;
        background-color: $grey10;
      }
      .tip {
        flex: 1;
        padding-left: 15px;
        height: 50px;
        line-height: 50px;
        position: relative;
        font-size: 16px;
      }
      .number {
        position: absolute;
        top: 0;
        font-size: 48px;
      }
      .large-low {
        flex: 1;
        border-left: 1px solid #ddd;
        padding-left: 40px;
        color: #000;
      }
      .special {
        font-size: 12px;
        font-weight: 700;
        margin-right: 10px;
      }
      .analyze-body-left {
        @extend .flex;
        flex: 1;
        margin-right:10px;
        .tip {
          @extend .tip;
          .number {
            color: #ff7474;
            left: 130px;
            @extend .number;
          }
        }
        .large-low {
          @extend .large-low;
        }
      }
      .analyze-body-center {
        @extend .flex;
        flex: 2;
        margin-right:10px;
        .tip {
          @extend .tip;
          .number {
            left: 130px;
            @extend .number;
          }
        }
        .level {
          flex: 1;
          text-align: right;
          padding-right: 40px;
          color: #000;
        }
        .large-low {
          @extend .large-low;
        }
      }
      .analyze-body-right {
        @extend .flex;
        flex:1;
        .tip {
          @extend .tip;
          .number {
            left: 80px;
            @extend .number;
          }
        }
        .large-low {
          @extend .large-low;
        }
      }
    }
  }
  .report-detail {
    background: #f5f5f5;
    margin-top: 10px;
    padding: 15px;
    .report-header {
      display: flex;
      justify-content: space-between;
      .orientation {
        .el-input__inner {
          border-radius: 0;
        }
      }
    }
    .report-detail-table {
      // background: #ffff;
      margin-top: 10px;
      // padding: 10px;
      .info-table {
        background: #ffff;
        margin-top: 10px;
        padding: 10px;
      }
      .mark {
        border-left: 3px solid #3f5dff;
        padding-left: 10px;
        .part {
          margin-right: 35px;
        }
      }
      .check-info {
        display: flex;
        li {
          display: flex;
          min-width: 280px;
          .label,
          .value {
            font-size: 14px;
          }
        }
      }
    }
  }
  .ckeck-instance {
    background: #f8f8fa;
    margin-top: 10px;
    padding: 15px;
  }
  .width {
    width: calc(100% - 1px);
  }
}
</style>

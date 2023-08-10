<template>
  <section class="quality-record">
    <div ref="quality" v-if="!recordListVisible">
      <div class="head1">
        <div class="head-title">校验记录列表</div>
        <div class="pick-time mr-20">
          <el-date-picker
            v-model="time"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions" class="mr-10" popper-class="check-time">
          </el-date-picker>
          <el-button type="primary"  icon="el-icon-refresh-right" class="action-refresh"></el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="tabHandleClick">
          <el-tab-pane :label="item.label" :name="item.name" lazy v-for="item in tabs" :key="item.name">
            <DataTabale v-if="item.name === 'dTable'" @qualityReportHandle="qualityReportHandle"></DataTabale>
            <Datasource v-if="item.name === 'dSource'" @qualityReportHandle="qualityReportHandle"></Datasource>
            <RealTable v-if="item.name === 'real'" @qualityReportHandle="qualityReportHandle"></RealTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <QualityReport @goBack="goBack" :data="curData" v-if="recordListVisible"></QualityReport>
  </section>
</template>

<script>
import DataTabale from './datatable'
import Datasource from './datasource'
import RealTable from './real-table'
import QualityReport from './quality-report'
import storage from '@/libs/storage'
export default {
  name: 'QualityRecord',
  components: {
    DataTabale,
    Datasource,
    RealTable,
    QualityReport
  },
  data() {
    return {
      activeName: 'dTable',
      time: '',
      tabs: [
        {
          label: '数据表',
          name: 'dTable'
        },
        {
          label: '数据源',
          name: 'dSource'
        },
        {
          label: '实时元表',
          name: 'real'
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      recordListVisible: false,
      curData: {}
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(val) {
        if (val.path === '/asset/quality/quality-manage/record') {
          if (val.query && val.query.data) {
            // console.log(val.query.data, '====')
            // this.curData = {
            //   last_time: val.query.data.last_time,
            //   id: val.query.data.id,
            //   project_code: val.query.data.project_code,
            //   table_code: val.query.data.table_code,
            //   oper_user: val.query.data.oper_user
            // }
            storage.set('qualityRecord', {visible: true, data: val.query.data})
          } else {
            storage.set('qualityRecord', {visible: false, data: {}})
          }
        }
      }
    }
  },
  created() {
    const qualityRecord = storage.get('qualityRecord')
    if (qualityRecord) {
      this.recordListVisible = qualityRecord.visible
      this.curData = qualityRecord.data
    } else {
      this.recordListVisible = false
    }
  },
  methods: {
    tabHandleClick() {},
    qualityReportHandle(row) {
      this.recordListVisible = true
      storage.set('qualityRecord', {visible: true, data: row})
      this.curData = row
    },
    goBack() {
      this.recordListVisible = false
      storage.set('qualityRecord', {visible: false, data: {}})
    }
  }
}
</script>

<style lang="scss">
.quality-record {
  height: 100%;
  position: relative;
  >div:first-child{
    // overflow-y: overlay;
    height: 100%;
    padding: 0;
    .head1 {
      position: relative;
      height: 100%;
      .head-title {
        position: absolute;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding-left: 20px;
      }
      .pick-time {
        position: absolute;
        height: 40px;
        line-height: 40px;
        right: 0;
        z-index: 99;
        .el-input__inner {
          border-radius: 0;
        }
        .action-refresh {
          &.el-button {
            border-radius: 0;
            background-color: $grey10;
            color: $--color-primary;
            border-color: $--color-primary;
          }
          &.el-button--primary{
            padding: 7px 12px;
            &:hover {
              background-color: rgba($--color-primary,.1);
              border-color: rgba($--color-primary,.7);
            }
          }
        }
      }
      .el-tabs {
        height: 100%;
        .el-tabs__content {
          height: calc(100% - 60px);
          overflow: auto;
        }
      }
      .el-tabs__nav-scroll {
        margin-left: 145px;
      }
      .el-tabs__nav-wrap::after {
        background: $grey6;
      }
      .el-tabs__content {
        padding: 0 20px;
      }
    }
  }
}
.check-time {
  width: 330px!important;
  &.el-popper {
    margin-top: 0;
  }
  .popper__arrow {
    border-width: 0;
    &::after {
      border-width: 0;
    }
  }
  .el-picker-panel__body {
    margin-left: 0;
    margin-bottom: 40px;
  }
  .el-picker-panel__sidebar {
    width: 100%;
    top: initial;
    padding-top: 0;
    border-top: 1px solid $grey7;
    .el-picker-panel__shortcut {
      text-align: center;
      line-height: 40px;
    }
  }
  .el-picker-panel__content {
    width: initial;
  }
}
</style>

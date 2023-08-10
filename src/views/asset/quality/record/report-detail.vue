<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-30 10:22:02
 * @LastEditTime: 2021-08-13 17:46:22
 * @Description:
-->
<template>
  <el-dialog
    custom-class="simple-edit-dialog"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    @keyup.native.enter="confirm"
    append-to-body
    width="800px"
    top="25vh"
    v-draggable="{
      trigger: `${flag} .simple-edit-dialog .el-dialog__header`,
      body: `${flag} .simple-edit-dialog.el-dialog`,
      recover: false
    }"
  >
  <div slot="title" class="dialog-title-box">
    <span class="el-dialog__title">指标监控预警趋势图</span>
    <div class="title-right">
      <span class="text">选择日期</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange">
      </el-date-picker>
    </div>
  </div>
    <div class="sed-body" :style="{'max-height': `${dialogBodyHeight}px`}">
      <AreaChart :data="areaData" :fields="fields" :colors="[' #5CB4FC', ' #545F99']"></AreaChart>
    </div>
    <div slot="footer" class="my-btn">
      <el-button type="primary" class="primary" @click.stop="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AreaChart from '../overview/area-chart'
import {dateFormat} from '@/libs/util'
// import { getAppTrendData } from '@/api/asset/quality'
import {on, off} from '@/libs/dom'
import {getRuleVerifySpend} from '@/api/asset/quality/record'
export default {
  name: 'ReportDetail',
  props: {
    visible: Boolean,
    parentClass: {
      type: String,
      default: ''
    },
    params: Object
  },
  components: {
    AreaChart
  },
  data() {
    return {
      isVisible: false,
      dialogBodyHeight: 0,
      dialogOtherHeight: 150,
      date: '',
      areaData: [],
      fields: [],
      paramsObj: {}
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    params: {
      deep: true,
      immediate: true,
      handler(val) {
        this.paramsObj = val
        const date = new Date()
        this.date = [new Date(date.getTime() - 3600 * 1000 * 24 * 7), date]
        const fields = ['ruleCount', 'strong']
        this.fields = {
          fields,
          label: {
            ruleCount: `真实值`,
            strong: `目标值`
          }
        }
        this._getAreaData()
      }
    }
  },
  computed: {
    flag() {
      let a = ''
      if (this.parentClass && this.parentClass.indexOf('.') > -1) {
        a = this.parentClass
      } else if (this.parentClass && this.parentClass.indexOf('.') <= -1) {
        a = `.${this.parentClass}`
      } else {
        a = ''
      }
      return a
    }
  },
  created() {},
  mounted() {
    this.setDialogBodyHeight()
    on(window, 'resize', this.setDialogBodyHeight)
  },
  beforeDestory() {
    off(window, 'resize', this.setDialogBodyHeight)
  },
  methods: {
    setDialogBodyHeight() {
      const gap = this.gap ? this.gap : 0
      this.dialogBodyHeight =
        window.innerHeight * 0.85 - this.dialogOtherHeight - gap
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('close')
    },
    dateChange() {
      this._getAreaData()
    },
    async _getAreaData() {
      const params = {
        ...this.paramsObj,
        start_time: this.date.length ? dateFormat(this.date[0], 'YYYY-MM-dd') : '',
        end_time: this.date.length ? dateFormat(this.date[1], 'YYYY-MM-dd') : ''
      }
      const res = await this.$simpleAsyncTo(getRuleVerifySpend(params), '获取失败')
      if (res) {
        this.areaData = res.data.map(item => {
          return {
            ruleCount: item.result_value,
            strong: item.threshold,
            date: item.ds
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-title-box {
  display: flex;
  .title-right {
    width: calc(100% - 200px);
    display: flex;
    justify-content: flex-end;
    .text {
      font-size: 14px;
      line-height: 28px;
      margin-right: 10px;
      color: #606266;
    }
  }
}
</style>

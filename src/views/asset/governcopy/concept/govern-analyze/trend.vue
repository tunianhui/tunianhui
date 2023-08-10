<template>
  <el-dialog
    title="排行榜"
    class="govern-trend"
    :visible.sync="dialogVisible"
    @close="close"
    v-loading="!!loading"
  >
    <LineChart :data="lineData" :height="dialogBodyHeight"></LineChart>
    <el-radio-group v-model="recent" @change="getLineData">
      <el-radio-button :label="7">近7天</el-radio-button>
      <el-radio-button :label="30">近30天</el-radio-button>
    </el-radio-group>
    <div slot="footer">
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getTrendList} from '@/api/govern/govern-analyze'
import dialogHeight from '@/mixins/dialog-height'
import LineChart from './line-chart'

export default {
  name: 'GovernTrend',
  mixins: [dialogHeight],
  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    LineChart
  },
  data() {
    return {
      dialogVisible: false,
      lineData: [],
      recent: 7,
      loading: 0
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.getLineData()
      }
    }
  },
  methods: {
    async getLineData() {
      this.laoding++
      const res = await this.$simpleAsyncTo(
        getTrendList({recent: this.recent}),
        '获取数据失败'
      )
      if (res) {
        this.lineData = res.data
      }
      this.laoding--
    },
    close() {
      this.recent = 7
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.govern-trend {
  ::v-deep .el-dialog__body {
    position: relative;

    .el-radio-group {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 2px;
    }
  }
}
</style>

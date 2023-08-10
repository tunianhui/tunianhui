<template>
  <el-dialog
    title="排行榜"
    class="govern-trend"
    :visible.sync="dialogVisible"
    @close="close"
    v-loading="!!loading"
  >
    <ul class="tabs">
      <li
        v-for="item in tabs"
        :key="item.key"
        :class="activeTab === item.key && 'is-active'"
        @click="tabClick(item.key)"
      >{{item.label}}</li>
    </ul>
    <LineChart :data="lineData" :height="dialogBodyHeight - 40" :unit="unit"></LineChart>
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
import {getProjectTrendList} from '@/api/govern/govern-effect'
import dialogHeight from '@/mixins/dialog-height'
import LineChart from './line-chart-dialog'

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
      loading: 0,
      tabs: [
        {label: '存储', key: 'store'},
        {label: '计算', key: 'compute'}
      ],
      activeTab: 'store'
    }
  },
  computed: {
    unit() {
      return this.activeTab === 'store' ? 'KB' : 'CM'
    }
    // lineLegendPrefix() {
    //   return this.tabs.find(tab => this.activeTab === tab.key).label
    // }
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
    tabClick(tab) {
      this.activeTab = tab
      this.recent = 7
      this.getLineData()
    },
    async getLineData() {
      this.laoding++
      const res = await this.$simpleAsyncTo(
        getProjectTrendList({recent: this.recent}),
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

<style lang="scss" scoped>
.govern-trend {
  ::v-deep .el-dialog__body {
    position: relative;

    .tabs {
      position: absolute;
      top: -30px;
      left: 120px;
      display: flex;
      font-size: 14px;
      margin-left: 15px;
      margin-top: 2px;

      li {
        padding: 0 4px 9px;
        color: $grey3;
        margin-right: 30px;
        position: relative;
        cursor: pointer;

        &::before {
          content: '';
          display: block;
          width: 0;
          height: 2px;
          background: $--color-primary;
          position: absolute;
          bottom: 0;
          left: 50%;
          transition: $transition;
        }

        &.is-active {
          color: $grey1;
          &::before {
            width: 100%;
            left: 0;
          }
        }
      }
    }
    .el-radio-group {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 2px;
    }
  }
}
</style>

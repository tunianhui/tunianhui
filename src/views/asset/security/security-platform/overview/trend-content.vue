<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-29 09:38:23
 * @LastEditTime: 2022-08-29 11:56:56
 * @Description:
-->
<template>
  <section class="trend-content">
    <AreaChart :data="areaData"
               :fields="fields"
               :colors="[' #5CB4FC', ' #545F99', '#7DC995']"></AreaChart>
  </section>
</template>

<script>
import AreaChart from './area-chart'
import {
  queryApplicationTableRuleTrend
} from '@/api/asset/quality/overview'
export default {
  name: 'TrendContent',
  props: {
    type: String
  },
  components: {
    AreaChart
  },
  data () {
    return {
      trendText: '',
      date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
      fields: {},
      areaData: []
    }
  },
  watch: {
    type: {
      immediate: true,
      handler (val) {
        this.initText(val)
      }
    }
  },
  created () { },
  methods: {
    initText (val) {
      if (val === 'table') {
        this.trendText = '表'
      } else if (val === 'datasource') {
        this.trendText = '数据源'
      } else {
        this.trendText = '实时元表'
      }
      const fields = ['tableTotal']
      this.fields = {
        fields,
        label: {
          tableTotal: `总${this.trendText}数`
        }
      }
      // this._queryApplicationTableRuleTrend()
    },
    async _queryApplicationTableRuleTrend () {
      const params = {
        stat_type: this.type
      }
      const res = await this.$simpleAsyncTo(queryApplicationTableRuleTrend(params), '获取数据失败')
      if (res) {
        this.areaData = res.data.map(item => {
          return {
            tableTotal: item.total_num,
            date: item.create_date
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.trend-content {
  margin: 12px 0;
}
</style>

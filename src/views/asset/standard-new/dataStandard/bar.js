/*
 * @Author: 大炸鹅
 * @Date: 2023-02-03 15:57:34
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-03 16:58:15
 * @FilePath: \数据智能构建\src\views\tag\asset-market\public-market\bar.js
 */
import G2 from '@antv/g2'
export default {
  name: 'Bar',
  props: {
    data: Array,
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 220
    },
  },
  render() {
    return <div class="g2-chart" ref="chart"></div>
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: this.height,
        padding: [40, 65, 20, 'auto']
      })
      this.render()
    },
    render() {
      const data = [
        { country: '平衡型', population: 18203 },
        { country: '激进型', population: 23489 },
        { country: '稳健型', population: 29034 },
        { country: '谨慎型', population: 10970 },
        { country: '进取型', population: 1317 }
      ]
      this.chart.source(data)
      this.chart.legend('country', {
        title: null,
        marker: 'square',
        itemMarginBottom: 20,
        offsetX: 15,
        offsetY: -10,
        dy: 10,
        position: 'top-left'
      })
      this.chart.axis('country', {
        label: {
          offset: 12
        }
      })
     
      this.chart.coord().transpose()
      this.chart.interval().position('country*population').color('country')
      .label('population', {
        textStyle: {
          fill: '#8d8d8d'
        },
        offset: 10,
        formatter: text => {
          return `数量 ${text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`
        }
      })
      this.chart.render()
    }
  }
}


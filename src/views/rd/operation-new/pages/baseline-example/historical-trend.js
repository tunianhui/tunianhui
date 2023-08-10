import { Line } from '@antv/g2plot'

export default class HistoricalTrend {
  constructor(options) {
    this.chart = null
    this.chartOptions = options
  }

  init() {
    const { container, data } = this.chartOptions
    const annotations = data.filter(item => item.category === '平均').map((item) => {
      return {
        type: 'text',
        content: '最晚',
        /** 位置 */
        // ✅ 1. 支持回调设置，转换为百分比例
        position: (xScale, yScale) => {
          return [`${xScale.scale(item.date) * 100}%`, `${(1 - yScale.value.scale(item.value)) * 100}%`]
        },
        /** 图形样式属性 */
        style: {
          textAlign: 'center',
          fill: '#1B7DFD',
          fontWeight: '600',
        },
        // 设置偏移
        offsetY: -25,
        // 设置文本包围框
        background: {
          padding: [6, 8],
          style: {
            radius: 4,
            fill: '#EAF2FF',
            stroke: '#1B7DFD',
            lineWidth: 1,
          },
        },
      }
    })

    const averageData = (data.filter(item => item.category === '平均')).pop()
    const averageAnnotations = {
      type: 'text',
      content: '平均00:00',
      position: (xScale, yScale) => {
        return [`${xScale.scale(averageData.date) * 100}%`, `${(1 - yScale.value.scale(averageData.value)) * 100}%`]
      },
      offsetX: 40,
      style: {
        textAlign: 'center',
        fill: '#2684FF',
        fontWeight: '400',
      },
    }

    const commitmentData = (data.filter(item => item.category === '承诺')).pop()
    const commitmentAnnotations = {
      type: 'text',
      content: '承诺00:00',
      position: (xScale, yScale) => {
        return [`${xScale.scale(commitmentData.date) * 100}%`, `${(1 - yScale.value.scale(commitmentData.value)) * 100}%`]
      },
      offsetX: 40,
      style: {
        textAlign: 'center',
        fill: '#EF4443',
        fontWeight: '400',
      },
    }

    const line = new Line(container, {
      data,
      xField: 'date',
      yField: 'value',
      color: ['#EF4443', '#2684FF'],
      legend: {
        position: 'right-top',
      },
      label: false,
      seriesField: 'category',
      annotations: [...annotations, averageAnnotations, commitmentAnnotations],
      point: {
        size: 5,
        shape: 'circle'
      },
      yAxis: {
        title: {
          text: '产出时间',
          style: {
            fontSize: 12,
            color: '#666666',
          },
        }
      }
    })

    line.render()
    this.chart = line
  }
}

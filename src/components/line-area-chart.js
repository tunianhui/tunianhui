/*
 * @Author: 大炸鹅
 * @Date: 2023-04-18 15:13:03
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-19 09:38:22
 * @FilePath: \数据智能构建\src\components\line-area-chart.js
 */
import { Area } from '@antv/g2plot';

const detaultData = [
  {
    time: '2019-08-27',
    value: 3,
  },
  {
    time: '2019-08-28',
    value: 9,
  },
  {
    time: '2019-08-29',
    value: 14,
  },
  {
    time: '2019-08-30',
    value: 5,
  },
  {
    time: '2019-08-31',
    value: 4,
  },
  {
    time: '2019-09-01',
    value: 13,
  },
];


export default class LineAreaChart {
  constructor(options) {
    this.chart = null
    this.chartOptions = options
  }
  init() {
    const { container, data = detaultData, seriesField = 'type', color, areaStyle, legend  } = this.chartOptions
    const { clientWidth, clientHeight } = container
    this.chart = new Area(container, {
      data,
      width: clientWidth || 400,
      height: clientHeight || 400,
      xField: 'time',
      yField: 'value',
      xAxis: {
        range: [0, 1],
      },
      areaStyle,
      seriesField: seriesField,
      colorField: seriesField,
      color: color,
      legend
    });
    this.chart.render();
  }
}
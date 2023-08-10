/*
 * @Author: 大炸鹅
 * @Date: 2023-04-18 13:37:57
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 11:40:49
 * @FilePath: \数据智能构建\src\components\bar-chart.js
 */
import { Column } from '@antv/g2plot';

const detaultData = [
  {
    name: 'London',
    月份: 'Jan.',
    月均降雨量: 18.9,
  },
  {
    name: 'London',
    月份: 'Feb.',
    月均降雨量: 28.8,
  },
  {
    name: 'London',
    月份: 'Mar.',
    月均降雨量: 39.3,
  },
  {
    name: 'London',
    月份: 'Apr.',
    月均降雨量: 81.4,
  },
  {
    name: 'London',
    月份: 'May',
    月均降雨量: 47,
  },
  {
    name: 'London',
    月份: 'Jun.',
    月均降雨量: 20.3,
  },
  {
    name: 'London',
    月份: 'Jul.',
    月均降雨量: 24,
  },
  {
    name: 'London',
    月份: 'Aug.',
    月均降雨量: 35.6,
  },
  {
    name: 'Berlin',
    月份: 'Jan.',
    月均降雨量: 12.4,
  },
  {
    name: 'Berlin',
    月份: 'Feb.',
    月均降雨量: 23.2,
  },
  {
    name: 'Berlin',
    月份: 'Mar.',
    月均降雨量: 34.5,
  },
  {
    name: 'Berlin',
    月份: 'Apr.',
    月均降雨量: 99.7,
  },
  {
    name: 'Berlin',
    月份: 'May',
    月均降雨量: 52.6,
  },
  {
    name: 'Berlin',
    月份: 'Jun.',
    月均降雨量: 35.5,
  },
  {
    name: 'Berlin',
    月份: 'Jul.',
    月均降雨量: 37.4,
  },
  {
    name: 'Berlin',
    月份: 'Aug.',
    月均降雨量: 42.4,
  },
];

export default class BarChart {
  constructor(options) {
    this.chart = null
    this.chartOptions = options
  }
  init() {
    const { container, data = detaultData, seriesField, yField, xField, colorField, color, label } = this.chartOptions
    const { clientWidth, clientHeight } = container
    this.chart = new Column(container, {
      data,
      width: clientWidth || 400,
      height: clientHeight || 400,
      isGroup: true,
      xField: xField || '月份',
      yField: yField || '月均降雨量',
      seriesField: seriesField || 'name',
      colorField: colorField || 'name',
      color: color || ['#5B8FF9', '#5AD8A6'],
      legend: false,
      padding: [20, 40],
      label: label && {
        position: 'middle', // 'top', 'middle', 'bottom'
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
    });
    this.chart.render()
  }
}
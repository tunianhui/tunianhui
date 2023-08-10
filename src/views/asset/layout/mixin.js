/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 11:03:30
 * @LastEditTime: 2021-08-07 13:45:37
 * @Description:
 */
import {iconMap} from '@/config/asset-config'

export default {
  methods: {
    getIcon(type) {
      return (iconMap[type] || {}).icon
    },
    getColor(type) {
      return (iconMap[type] || {}).color
    }
  }
}

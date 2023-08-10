import {iconMap} from '@/config/rd-config'

export default {
  methods: {
    getIcon (type) {
      return (iconMap[type] || {}).icon
    },
    getColor(type) {
      return (iconMap[type] || {}).color
    }
  }
}

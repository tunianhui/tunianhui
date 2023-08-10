import OPSFlow from '@c/ops-flow/index.vue'
import {taskMenu} from '@/config/ops-config'

export default {
  extends: OPSFlow,
  name: 'TaskPeriodGraph',
  data() {
    return {
      type: 'task',
      contextmenu: taskMenu
    }
  },
  beforeCreate() {
    this.contextmenu = taskMenu
  },
  methods: {}
}

import OPSFlow from '@c/ops-flow/index.vue'
import {instanceMenu} from '@/config/ops-config'

export default {
  extends: OPSFlow,
  name: 'InstancePeriodGraph',
  data() {
    return {
      type: 'instance',
      contextmenu: instanceMenu
    }
  },
  mounted() {
    this.contextmenu = instanceMenu
  },
  methods: {}
}

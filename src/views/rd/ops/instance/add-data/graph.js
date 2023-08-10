import OPSFlow from '@c/ops-flow/index.vue'
import {instanceMenu} from '@/config/ops-config'

export default {
  extends: OPSFlow,
  name: 'InstanceAddDataGraph',
  data() {
    return {
      type: 'adddata',
      contextmenu: instanceMenu
    }
  },
  mounted() {
    this.contextmenu = instanceMenu
  },
  methods: {}
}

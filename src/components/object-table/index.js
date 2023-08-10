import Main from './main.vue'
import {mapGetters, mapMutations} from 'vuex'
import {capitalize} from '@/libs/util'

export default function (module, tabs = []) {
  return {
    extends: Main,
    name: `${capitalize(module)}ObjectTable`,
    data() {
      return {
        module,
        tabs
      }
    },
    computed: {
      // ...mapGetters(module, ['active'])
      ...mapGetters({active: `${module}/active`})
    },
    methods: {
      ...mapMutations(module, {
        setActive: 'SET_ACTIVE'
      })
    }
  }
}

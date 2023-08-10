/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-07-21 14:07:19
 * @Description:
 */
import {mapGetters} from 'vuex'
export default {
  props: {
    id: String,
    nodeData: Object
  },
  data() {
    return {

    }
  },
  created () {},
  mounted() {},
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        if (val.name) {
          this.form = val // 编辑
        } else {
          this.$refs.form && this.$refs.form.resetFields()
          this.configForm()
        }
      }
    },
    'project.skd_prj_id': {
      handler (val) {

      },
      immediate: true
    }
  },
  methods: {
    configForm () {
      this.form = {}
    }

    // ---------------- 事件 ----------------------

  }
}

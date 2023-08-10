/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-08-07 11:24:32
 * @Description:
 */
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'

export default {
  props: {
    id: String,
    nodeData: Object,
    nodes: Array,
    edges: Array
  },
  data() {
    return {
      keyword: '',
      // 动态 根据选择的表查询
      tableData: [],
      //
      fieldList: []
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
          // 初始化
          this.dataSourceList = []
          this.dataSourceTableList = []
          this.tableData = []
          this.columList = []
          this.fieldList = []
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
    },

    searchChange () {

    },

    dragSort () {
      const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: e => {
          // onEnd是结束拖拽时触发，onUpdate是列表内元素顺序更新的时候触发
          // e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
          const targetRow = this.form.outputColumn.splice(e.oldIndex, 1)[0]
          this.form.outputColumn.splice(e.newIndex, 0, targetRow)
        }
      })
    }

    // ---------------- 事件 ----------------------

  }
}

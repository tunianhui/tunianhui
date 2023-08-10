import OpsNodata from '@c/ops-nodata'
import ColumnPane from '@c/column-pane'
import {mapGetters} from 'vuex'
import {columnsData} from './instance/data.js'

export default {
  components: {
    OpsNodata,
    ColumnPane
  },
  data() {
    return {
      loading: 0,
      columnData: {},
      treeData: [],
      keyword: '',
      visibleColumnPane: false
    }
  },
  computed: {
    ...mapGetters({
      splitWidth: 'ops/splitWidth'
    })
  },
  created() {
    this.getData()
  },
  methods: {
    filterTree() {},
    async showColumns(e, {data, node}) {
      e.stopPropagation()
      this.loading++
      await this.$sleep(1000)
      // const res = await this.$simpleAsyncTo(getData({}), '获取数据失败')
      const res = columnsData
      if (res) {
        this.columnData = res.data[0]
        this.visibleColumnPane = true
      }
      this.loading--
    }
  }
}

import FilterFieldCard from '@c/filter-card'
import OverflowTooltip from '@c/overflow-tooltip'
import TableCell from '../table-cell'
export default {
  components: {
    FilterFieldCard,
    OverflowTooltip,
    TableCell
  },
  data() {
    return {
      filterData: [],
      tableData: [],
      loading: 0,
      fixed: false,
      curRow: ''
    }
  },
  methods: {
    getTableList() {},
    isSubTableHandle(row) {
      if (this.curRow === row.id) {
        this.curRow = ''
      } else {
        this.curRow = row.id
      }
    }
  }
}

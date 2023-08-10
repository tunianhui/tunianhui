export default {
  props: {
    keyword: String,
    batchBtnDisabled: Boolean
  },
  data() {
    return {
      selectedData: []
    }
  },
  computed: {
    visibleTableData() {
      return this.tableData.filter(item => item.visible)
    }
  },
  watch: {
    keyword(val) {
      this.$debounce(val => {
        this.filterByKeyword(val)
      }, 200)(val)
    },
    selectedData: {
      immediate: true,
      handler(val) {
        this.$emit('update:batch-btn-disabled', !val.length)
      }
    }
  },
  methods: {
    filterByKeyword() {},
    handleSelectionChange(val) {
      this.selectedData = val
    }
  }
}

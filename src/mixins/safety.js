export default {
  data() {
    return {
      searchValue: '',
      current: [],
      filterList: [],
      toggle: false,
      currentValue: ''
    }
  },
  methods: {
    selectHandle(v, item) {
      this.currentValue = item.value
      v.options.forEach(e => {
        e.is_select = false
      })
      item.is_select = true
      let index = this.current.findIndex(e => e.large_value === v.id)
      if (index > -1) {
        this.current.splice(index, 1, {large_class: v.des, large_value: v.id, type: item.des, value: item.value})
      } else {
        this.current.push({
          large_class: v.des,
          large_value: v.id,
          type: item.des,
          value: item.value
        })
      }
    },
    closeSelect(v) {
      v.is_select = false
      this.currentValue = ''
      let index = this.current.findIndex(e => {
        return v.value === e.value
      })
      this.current.splice(index, 1)
    },
    searchFilterTable() {},
    closeCurrentHandle(index, item) {
      this.current.splice(index, 1)
      this.filterList.forEach(e => {
        if (e.id === item.large_value) {
          e.options.forEach(v => {
            if (v.value === item.value) {
              v.is_select = false
            }
          })
        }
      })
    }
  }
}

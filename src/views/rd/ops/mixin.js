export default {
  data() {
    return {
      checkedAll: false
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(val) {
        this.deepChecked(val)
      }
    }
  },
  methods: {
    formatData(data, parent = null) {
      data.forEach(item => {
        // item.checked = false
        this.$set(item, 'checked', false)
        if (parent) {
          this.$set(item, 'parent', parent)
        }
        if (item.child) {
          this.formatData(item.child, item)
        }
      })
    },
    deepChecked(data) {
      data.forEach(item => {
        const flag = item.child.some(val => {
          return val.checked === true
        })
        if (flag) {
          item.checked = true
        }
        if (item.child) {
          this.deepChecked(item.child)
        }
      })
    },
    checkOne(obj, boolValue) {
      obj.checked = boolValue
      // 判断存不存在children,存在就递归赋值
      if (obj.child) {
        obj.child.forEach(item => this.checkOne(item, boolValue))
      }
    },
    handleCheckedOne(row) {
      if (row.checked) {
        this.checkOne(row, true)
      } else {
        this.checkOne(row, false)
      }
    },
    checkAll(arr, boolValue) {
      arr.forEach(item => {
        item.checked = boolValue
        // children同样是数组
        if (item.child) {
          this.checkAll(item.child, boolValue)
        }
      })
    },
    handleCheckedAll(scope) {
      if (this.checkedAll) {
        this.checkAll(this.tableData, true)
      } else {
        this.checkAll(this.tableData, false)
      }
    },
    filter1(data, id) {
      var newData = data.filter(x => {
        return x.checked === true
      })
      newData.forEach(x => {
        x.child && (x.child = this.filter1(x.child, true))
      })
      return newData
    },
    deepFilterId(data) {
      const newData = data.map(x => {
        return {
          cube_id: x.cube_id,
          cube_code: x.cube_code,
          child: x.child,
          instance_id: x.instance_id
        }
      })
      newData.forEach(x => {
        x.child && (x.child = this.deepFilterId(x.child, true))
      })
      return newData
    }
  }
}

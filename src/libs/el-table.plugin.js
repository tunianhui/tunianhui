import debounce from 'throttle-debounce/debounce'
import {
  getKeysMap,
  getRowIdentity,
  toggleRowStatus
} from 'element-ui/packages/table/src/util'

/*
import {optimizeElTableTreeSeletion} from '@/libs/el-table.plugin.js'
mounted() {
  this.$nextTick(_ => {
    const table = this.$refs.table
    if (table) {
      optimizeElTableTreeSeletion(table)
    }
  })
}
*/

// 对有树状结构的table，获取所有的row，使之结构扁平化
function getAllData(data, result = []) {
  ; (data || []).forEach(item => {
    if (item.children) {
      getAllData(item.children, result)
    }
    result.push(item)
  })
  return result
}

// 覆盖el-table中watcher的updateAllSelected方法
function updateAllSelected() {
  const states = this.states
  const { selection, rowKey, selectable } = states
  // 主要修改点
  const data = getAllData(states.data)
  if (data.length === 0) {
    states.isAllSelected = false
    return
  }

  let selectedMap
  if (rowKey) {
    selectedMap = getKeysMap(selection, rowKey)
  }
  const isSelected = function (row) {
    if (selectedMap) {
      return !!selectedMap[getRowIdentity(row, rowKey)]
    } else {
      return selection.indexOf(row) !== -1
    }
  }
  let isAllSelected = true
  let selectedCount = 0
  for (let i = 0, j = data.length; i < j; i++) {
    const item = data[i]
    // eslint-disable-next-line
    const isRowSelectable = selectable && selectable.call(null, item, i)
    if (!isSelected(item)) {
      if (!selectable || isRowSelectable) {
        isAllSelected = false
        break
      }
    } else {
      selectedCount++
    }
  }

  if (selectedCount === 0) isAllSelected = false
  states.isAllSelected = isAllSelected
}

// 覆盖el-table中watcher的toggleAllSelection方法
const toggleAllSelection = debounce(10, function () {
  const states = this.states
  const { data = [], selection } = states
  // when only some rows are selected (but not all), select or deselect all of them
  // depending on the value of selectOnIndeterminate

  const value = states.selectOnIndeterminate
    ? !states.isAllSelected
    : !(states.isAllSelected || selection.length)
  states.isAllSelected = value

  let selectionChanged = false
  getAllData(data).forEach((row, index) => {
    if (states.selectable) {
      if (
        states.selectable.call(null, row, index) &&
        toggleRowStatus(selection, row, value)
      ) {
        selectionChanged = true
      }
    } else {
      if (toggleRowStatus(selection, row, value)) {
        selectionChanged = true
      }
    }
  })

  if (selectionChanged) {
    this.table.$emit('selection-change', selection ? selection.slice() : [])
  }
  this.table.$emit('select-all', selection)
})

// 修复el-table树状显示时的多选功能的bug
export function optimizeElTableTreeSeletion(tableRef) {
  const store = tableRef.store
  store.updateAllSelected = updateAllSelected
  store.toggleAllSelection = toggleAllSelection
}

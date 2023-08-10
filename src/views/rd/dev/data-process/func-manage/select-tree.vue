<template>
  <el-select
    v-model="id"
    placeholder="请选择"
    ref="treeSelect"
    popper-class="select-tree1"
    @visible-change="visibleChange"
    :disabled="disabled"
  >
    <el-option
      :label="name"
      :value="id"
      style="max-height:auto;background-color:#fff"
    >
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :current-node-key="currentNodeKey"
        node-key="id"
        accordion
        :default-expand-all="true"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :render-content="renderContent"
        ref="tree"
        style="font-weight: 400"
      >
      </el-tree>
    </el-option>
    <slot></slot>
  </el-select>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'SelectTree',
  props: {
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    data: Array,
    field: {
      type: Object,
      default: () => {
        return {id: 'id', label: 'name', type: 'node_type', parent_id: 'parent_id', children: 'children'}
      }
    },
    icon: {
      type: Object,
      default: () => {
        return {
          dir: 'el-icon-folder',
          file: 'el-icon-tickets'
        }
      }
    },
    node_type: {
      type: Object,
      default: () => {
        return {
          dir: '0',
          file: '1'
        }
      }
    },
    curNode: [String, Number],
    isDirClick: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      name: '',
      treeData: [],
      currentNodeKey: ''
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.treeData = []
        this.recursionTreeData(val, this.treeData)
        this.$nextTick(_ => {
          const result = this.getCurrentPart(this.curNode, this.treeData)
          this.name = result ? result.label : ''
          this.$refs.tree.setCurrentKey(this.curNode)
        })
      }
    }
  },
  updated() {
    const result = this.getCurrentPart(this.curNode, this.treeData)
    this.name = result ? result.label : ''
  },
  methods: {
    handleNodeClick(data, node) {
      if (this.isDirClick) {
        this.currentNodeKey = data.id
        this.id = data.id
        this.name = data.label
        this.$refs.treeSelect.blur()
        this.$emit('nodeClick', {id: this.id, name: this.name})
      } else {
        if (data.node_type === this.node_type.file) {
          this.currentNodeKey = data.id
          this.id = data.id
          this.name = data.label
          this.$refs.treeSelect.blur()
          this.$emit('nodeClick', {id: this.id, name: this.name})
        }
      }
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const {id, label, type, parent_id, children} = this.field
        const treeItem = {
          label: item[label],
          node_type: item[type],
          icon: item[type] === this.node_type.dir ? this.icon.dir : this.icon.file,
          ...item,
          id: item[id] + '',
          parent_id: item[parent_id]
        }
        if (item[children] && item[children].length) {
          treeItem[children] = []
          this.recursionTreeData(item[children], treeItem[children])
        }
        target.push(treeItem)
      })
    },
    visibleChange(val) {
      this.$emit('visibleChange', val)
    },
    renderContent(h, {node, data, store}) {
      const {node_type, icon, label, id} = data
      let iconClass = '', wrapperClass = '', style = ''
      if (node_type === this.node_type.dir) {
        iconClass = `${icon} icon dir mr-5`
        wrapperClass = 'custom-node custom-node-dir'
      } else {
        iconClass = `${icon} icon file mr-5`
        wrapperClass = 'custom-node custom-node-file'
        if (node.level === 1) {
          wrapperClass += ' no-parent'
        }
        // this.$route.meta.color && (style = `color: ${this.$route.meta.color};`)
      }
      return (
        <span
          class={wrapperClass}
          data-id={node_type === this.node_type.file ? id : ''}
        >
          <span class="node-content">
            <i class={iconClass} style={style} />
            {/* <span> */}
            <OverflowTooltip>
              <span class="node-name">
                {label}
              </span>
            </OverflowTooltip>
            {/* </span> */}
          </span>
        </span>
      )
    },
    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          break
        }
        if (item[this.field.children] && item[this.field.children].length) {
          const text = this.getCurrentPart(id, item[this.field.children])
          if (text) {
            return text
          }
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.select-tree1 {
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>

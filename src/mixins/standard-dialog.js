import dialogHeight from '@/mixins/dialog-height'

export default {
  mixins: [dialogHeight],
  props: {
    visible: Boolean,
    title: String,
    data: [Object, null]
  },
  data() {
    return {
      isVisible: false,
      filter: {},
      rules: {},
      formRef: 'form',
      loading: 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    data: {
      immediate: true,
      handler(val) {
        // 编辑时使用
        Object.assign(this.filter, this.data)
        // console.log(this.filter, 'this', this.data)
      }
    }
  },
  async created() {
    await this.getTreeData()
    if (this.title.indexOf('编辑') > -1) {
      if (this.data.parentId) {
        const result = this.getCurrentPart(this.data.parentId, this.treeData)
        this.filter.parent_id = result.id
        this.filter.parent_name = result.label
        this.filter.level = result.level
        this.currentNodeKey = result.id
      } else {
        this.filter.parent_id = '/'
        this.filter.parent_name = '根目录'
      }
    }
  },
  methods: {
    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          break
        }
        if (item.children && item.children.length) {
          const text = this.getCurrentPart(id, item.children)
          if (text) {
            return text
          }
        }
      }
      return result
    },
    close() {
      const form = this.$refs[this.formRef]
      form && form.resetFields()
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    async getTreeData() {
      const res = await this.$simpleAsyncTo(
        this.getTreeDataFetch(),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData, 0)
      }
    },
    recursionTreeData(data, target, level) {
      level++
      data.forEach(item => {
        const { catalog_id, catalog_name, children, catalog_code } = item
        const treeItem = {
          label: catalog_name,
          ...item,
          id: catalog_id,
          code: catalog_code,
          level
        }
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children, level)
        }
        if (treeItem.id !== this.data.catalog_id) {
          target.push(treeItem)
        }
      })
    },
    handleNodeClick(data, node) {
      this.filter.parent_id = data.id
      this.filter.parent_name = data.label
      this.filter.level = data.level
      this.$refs.treeSelect.blur()
    }
  }
}

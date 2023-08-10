/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-01 17:46:10
 * @LastEditTime: 2023-04-30 16:36:53
 * @Description:
 */
import { getTreeData } from '@/api/rd/integrate'
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  async created () {
    await this.getFolder()
    if (this.title.indexOf('新建') > -1) {
      if (this.treeData && this.treeData.length) {
        this.form.catalogid = this.treeData[0].id
        this.form.file_catalog = this.treeData[0].name
      }
    }
    if (this.title.indexOf('移动') > -1 || this.title.indexOf('重命名') > -1 || this.title.indexOf('编辑') > -1) {
      let result = this.getCurrentPart(this.editData.parent_id, this.treeData)
      this.form.name = this.editData.name
      this.form.catalogid = result.id
      this.form.file_catalog = result.name
      this.currentNodeKey = result.id
    }
  },
  methods: {
    async getFolder() {
      const params = {
        folder_type: '5',
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getTreeData(params), '获取树数据失败')
      if (res) {
        let data = res.data.child
        this.doDelete(data)
        this.treeData = [
          {
            id: res.data.id,
            node_type: res.data.node_type,
            child: data,
            name: res.data.name
          }
        ]
      }
    },

    doDelete(treeData) {
      for (let i = treeData.length; i > 0; i--) {
        if (treeData[i - 1].node_type === '1') {
          treeData.splice(i - 1, 1)
        } else {
          if (treeData[i - 1].child) {
            this.doDelete(treeData[i - 1].child)
          }
        }
      }
    },

    getCurrentPart(id, items) {
      let result
      for (var i in items) {
        let item = items[i]
        if (item.id === id || item.id === id + '') {
          result = item
          break
        } else if (item.child) {
          result = this.getCurrentPart(id, item.child)
        }
      }
      return result
    },

    // 赋值
    handleNodeClick (data, node) {
      this.form.catalogid = data.id
      this.form.file_catalog = data.name
      this.$refs.treeSelect.blur()
    }
  }
}

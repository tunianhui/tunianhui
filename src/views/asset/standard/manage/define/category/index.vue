<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:50:50
 * @LastEditTime: 2021-08-07 16:52:13
 * @Description:
-->
<template>
  <div class='define-category side-view'>
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click.stop="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="addCategory"></i>
      </span>
    </div>
    <el-tree
      class="sv-tree"
      ref="tree"
      v-loading="!!loading"
      highlight-current
      :node-key="nodeKey"
      :data="treeData"
      :current-node-key="curNodeKey"
      :default-expanded-keys="expandedKeys"
      :auto-expand-parent="true"
      :filter-node-method="filterNode"
      :render-content="renderContent"
      :current-change="currentChange"
      @node-click="nodeClick"
      @mouseover.native="nodeMouseover"
      @mouseout.native="nodeMouseout"
    ></el-tree>
  </div>
</template>

<script>
import StandardMixin from '@/mixins/standard-tree.js'
import {getTreeData, delCatalog} from '@/api/asset/standard/category.js'
export default {
  name: 'Category',
  mixins: [StandardMixin],
  props: {},
  components: {},
  data() {
    return {
      visibleCreatePopper: false,
      getTreeDataFetch: getTreeData,
      delFetch: delCatalog,
      paramsKey: 'catalog_id',
      treeType: 'category'
    }
  },
  computed: {},
  created() {
    this.getTreeData()
  },
  mounted() {},
  methods: {
    addCategory() {
      this.setActiveRdEditDialog({
        title: '新建类目',
        component: 'CategoryEditDialog',
        data: {}
      })
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑类目',
        component: 'CategoryEditDialog',
        data
      })
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const { catalog_id, catalog_name, children, icon_code, catalog_code } = item
        const treeItem = {
          label: catalog_name,
          total: children && children.length,
          img: icon_code,
          ...item,
          id: catalog_id + '',
          code: catalog_code
        }
        this.briefMap[catalog_id] = item
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    nodeClick(data, node) {
      const attr = {
        title: this.$route.meta.name,
        attrType: this.$route.name,
        name: data.id + '',
        label: data.label,
        data
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

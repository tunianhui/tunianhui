<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-07 16:50:50
 * @LastEditTime: 2021-08-07 16:52:36
 * @Description:
-->
<template>
  <div class='define-dict side-view'>
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="addDict"></i>
        <i
          class="icon el-icon-folder-add"
          title="新建文件夹"
          @click="createFolder"
        ></i>
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
    <div class="sv-bottom" @click="openObjectTable('DICT')">
      <span>字典查询列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
    <RenameRemove
      v-if="isDialogShow"
      @close="closeFolder"
      :title="`${title}文件夹`"
      :editData="editData"
    ></RenameRemove>
  </div>
</template>

<script>
import StandardMixin from '@/mixins/standard-tree.js'
import RenameRemove from './rename-remove'
import {
  getTreeData,
  deleteDict
} from '@/api/asset/standard/dict.js'
import {delCatalog} from '@/api/asset/standard/category.js'
export default {
  name: 'Dict',
  mixins: [StandardMixin],
  props: {},
  components: {
    RenameRemove
  },
  data() {
    return {
      getTreeDataFetch: getTreeData,
      treeType: 'dict',
      delFetch: deleteDict,
      paramsKey: 'range_id',
      isDialogShow: false,
      editData: {},
      title: '新建'
    }
  },
  computed: {},
  created() {
    this.getTreeData()
  },
  mounted() {},
  methods: {
    addDict() {
      this.setActiveRdEditDialog({
        title: '新建数据字典',
        component: 'DictEditDialig',
        data: {}
      })
    },
    createFolder() {
      this.isDialogShow = true
      this.title = '新建'
    },
    modifyFile(data, node) {
      if (data.type === 'node') {
        this.setActiveRdEditDialog({
          title: '编辑数据字典',
          component: 'DictEditDialig',
          data
        })
      } else {
        this.isDialogShow = true
        this.editData = data
        this.title = '编辑'
      }
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const { catalog_id, catalog_name, children, range_code, type, range_name, range_id, catalog_code } = item
        const treeItem = {
          label: type === 'folder' ? catalog_name : range_name,
          total: children && children.length,
          icon: type === 'folder' ? 'el-icon-folder' : this.$route.meta && this.$route.meta.icon,
          ...item,
          id: type === 'folder' ? catalog_id : range_id,
          code: type === 'folder' ? catalog_code : range_code,
          type
        }
        this.briefMap[type === 'folder' ? catalog_id : range_id] = item
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    nodeClick(data, node) {
      if (data.type === 'node') {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name,
          name: data.id,
          label: data.label,
          data
        }
        this.attrStore.commit('add', attr)
        this.attrStore.commit('setActiveToFirst', attr)
      }
    },
    closeFolder(data) {
      this.isDialogShow = false
    },
    deleteFolder(data) {
      if (data.children && data.children.length) {
        return this.$message({
          type: 'warning',
          mmessage: '存在子节点不允许删除'
        })
      }
      this.$confirm('请确认是否删除此文件夹吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(delCatalog({catalog_id: data.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 15:50:18
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-16 09:34:09
 * @FilePath: \数据智能构建\src\views\rd\exreact\idsCenter\mapping-table\index.vue
-->
<template>
  <div class="mapping-table-id side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i
          class="icon el-icon-document-add"
          title="新建文件"
          @click="createFile"
        ></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input
        v-model="keywords"
        class="dark-input"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
      ></el-input>
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
    <div class="sv-bottom" @click="openObjectTable('MAPPINGTABLEID')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import { getIdCnterListAll, delJobs } from '@/api/rd/exreact/mapping-id'
export default {
  name: "MappingTableIdIndex",
  mixins: [mixins],
  data() {
    return {
      listTreeAllFn: getIdCnterListAll,
      deleteFn: delJobs
    }
  },
  methods: {
    createFile() {
      this.setActiveRdEditDialog({
        title: 'ID映射表配置',
        component: `MappingTableId`,
        data: {...this.project, isEdit: false}
      })
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: 'ID映射表配置',
        component: `MappingTableId`,
        data: {...this.project, ...data, isEdit: true}
      })
    },
    nodeClick(data, node) {
      const attr = {
        title: '实体ID',
        attrType: this.types.MAPPINGTABLEID,
        name: data.id + '',
        label: data.sourceMappingName,
        data,
        width: '500px'
      }
      this.attrStore.commit('add', attr)
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const { id, children, sourceMappingName } = item
        const treeItem = {
          label: sourceMappingName,
          type: 1,
          icon: this.icons[1],
          ...item,
          id: id + ''
        }
        this.briefMap[id] = item
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        target.push(treeItem)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>
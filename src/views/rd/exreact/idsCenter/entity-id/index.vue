<template>
  <div class="entity-id side-view">
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
    <div class="sv-bottom" @click="openObjectTable('ENTITYID')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import { getIdCnterListAll, deleteIdEntity } from '@/api/rd/exreact/entity-id'
export default {
  name: 'EntityId',
  mixins: [mixins],
  data() {
    return {
      listTreeAllFn: getIdCnterListAll,
      deleteFn: deleteIdEntity
    }
  },
  methods: {
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建',
        component: `IdEditCreate`,
        data: {}
      })
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑',
        component: `IdEditCreate`,
        data: {...data}
      })
    },
    nodeClick(data, node) {
      const attr = {
        title: '实体ID',
        attrType: this.types.ENTITYID,
        name: data.id + '',
        label: data.idName,
        data,
        width: '500px'
      }
      this.attrStore.commit('add', attr)
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const { id, children, idName } = item
        const treeItem = {
          label: idName,
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
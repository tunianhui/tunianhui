<!--
 * @Author: 大炸鹅
 * @Date: 2023-03-03 09:33:18
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-03-03 17:11:25
 * @FilePath: \智能BId:\项目\数据智能构建\src\views\rd\exreact\idsCenter\main\index.vue
-->
<template>
  <div class="main-id side-view">
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
    <!-- <div class="sv-bottom" @click="openObjectTable('ENTITYID')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div> -->
  </div>
</template>

<script>
import mixins from '../mixins'
import { getMainList, deleteMain } from '@/api/rd/exreact/main-id.js'
export default {
  name: 'MainId',
  mixins: [mixins],
  data() {
    return {
      listTreeAllFn: getMainList,
      deleteFn: deleteMain
    }
  },
  methods: {
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建主体',
        component: `MainIdEdit`,
        data: {}
      })
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑主体',
        component: `MainIdEdit`,
        data: {...data}
      })
    },
    nodeClick(data, node) {
      // const attr = {
      //   title: '实体ID',
      //   attrType: this.types.ENTITYID,
      //   name: data.id + '',
      //   label: data.idName,
      //   data,
      //   width: '500px'
      // }
      // this.attrStore.commit('add', attr)
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const { subject_id, subject_code, children } = item
        const treeItem = {
          label: subject_code,
          type: 1,
          icon: this.icons[1],
          ...item,
          id: subject_id + ''
        }
        this.briefMap[subject_id] = item
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
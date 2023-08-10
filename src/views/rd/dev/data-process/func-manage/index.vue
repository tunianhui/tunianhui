<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-09 14:36:21
 * @LastEditTime: 2023-05-10 13:55:59
 * @Description:
-->
<template>
  <section class="func-manage side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="createFile"></i>
        <i class="icon el-icon-folder-add" title="新建文件夹" @click="createFolder"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>
    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">{{fileBrief.status === '0' ? '生效' : '失效'}}</div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.name }}</p>
        </div>
        <div class="brief-body">
          <p>
            <span class="label">创建人：</span>
            <span class="value">{{ fileBrief.create_user }}</span>
          </p>
          <p>
            <span class="label">创建时间：</span>
            <span class="value">{{ fileBrief.create_time }}</span>
          </p>
        </div>
      </div>
    </NodePopper>
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout" :props="defaultProps"></el-tree>
  </section>
</template>

<script>
import { getTreeData, deleteFileAndDir } from '@/api/rd/func-manage.js'
import fileManage from '@/mixins/file-manage.js'
export default {
  name: 'FuncManage',
  mixins: [fileManage],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      deleteFetch: deleteFileAndDir,
      folder_type: '3',
      defaultProps: {
        children: 'child',
        label: 'label'
      }
    }
  },
  methods: {
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建函数管理',
        component: 'FuncManageEdit',
        data: { ...this.project }
      })
    },
    createFolder () {
      this.setActiveRdEditDialog({
        title: '新建文件夹',
        component: 'CreateFolderManage',
        data: { ...this.project, treeData: this.treeData, folder_type: this.folder_type }
      })
    },
    edit (data, node) {
      this.setActiveRdEditDialog({
        title: '编辑函数管理',
        component: 'FuncManageEdit',
        data: { ...this.project, ...data, folder_type: this.folder_type }
      })
    },
    nodeClick (data, node) {
      if (data.node_type !== '0') {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name,
          name: data.id + '',
          label: data.label,
          data,
          treeData: this.treeData
        }
        this.attrStore.commit('add', attr)
        this.attrStore.commit('setActiveToFirst', attr)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

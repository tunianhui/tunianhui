<template>
  <section class="sync-task side-view">
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
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout" :props="defaultProps"></el-tree>
  </section>
</template>

<script>
import fileManage from '@/mixins/file-manage.js'
import { getTreeData, delFolder } from '@/api/rd/sync-task.js'
import { types } from '@/config/rd-config'
export default {
  name: 'SyncTask',
  mixins: [fileManage],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      deleteFetch: delFolder,
      folder_type: '5',
      defaultProps: {
        children: 'child',
        label: 'label'
      }
    }
  },
  methods: {
    createFile () {
      this.tabStore.commit('add', {
        label: '新建同步任务',
        tabType: types.SYNCTASK,
        name: Date.now() + '',
        component: 'SyncTaskEdit',
        data: {
          treeData: this.treeData
        }
      })
    },
    createFolder () {
      this.setActiveRdEditDialog({
        title: '新建文件夹',
        component: 'CreateFolderManage',
        data: { ...this.project, treeData: this.treeData, folder_type: this.folder_type }
      })
    },
    nodeClick (data, node) {
      this.tabStore.commit('add', {
        label: '编辑同步任务',
        tabType: types.SYNCTASK,
        name: data.id,
        component: 'SyncTaskEdit',
        data: {
          ...data,
          treeData: this.treeData
        }
      })
    },
    edit (data) {
      this.tabStore.commit('add', {
        label: '编辑同步任务',
        tabType: types.SYNCTASK,
        name: data.id,
        component: 'SyncTaskEdit',
        data: {
          ...data,
          treeData: this.treeData
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

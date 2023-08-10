<template>
  <section class="source-manage side-view">
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
      :props="defaultProps"></el-tree>
  </section>
</template>

<script>
import fileManage from '@/mixins/file-manage.js'
// import {FILE_TYPE} from '@/config/dics'
// import {data} from './data.js'
import { getTreeData, deleteFileOrFolder } from '@/api/rd/source-manage.js'
import { types } from '@/config/rd-config'
const deleteOpt = {
    class: '',
    icon: 'el-icon-delete',
    label: '删除',
    command: 'removeFile'
  },
  // renameOpt = {
  //   class: '',
  //   icon: 'el-icon-edit',
  //   label: '重命名',
  //   command: 'rename'
  // },
  modifyOpt = {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑',
    command: 'edit'
  },
  modifyOptContent = {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑内容',
    command: 'editContent'
  }
export default {
  name: 'SourceManage',
  mixins: [fileManage],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      deleteFetch: deleteFileOrFolder,
      folder_type: '4',
      defaultProps: {
        children: 'child',
        label: 'label'
      }
    }
  },
  methods: {
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建资源',
        component: 'SourceManageEdit',
        data: { ...this.project, treeData: this.treeData }
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
        title: '编辑资源',
        component: 'SourceManageEdit',
        data: { ...this.project, treeData: this.treeData, ...data }
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
      // const attr = {
      //   title: data.name,
      //   tabType: types.CODETASKSHELL,
      //   name: data.id + '',
      //   label: data.label,
      //   data,
      //   component: 'ViewContent'
      // }
      // this.tabStore.commit('add', attr)
    },
    editContent(data) {
      const attr = {
        title: data.name,
        tabType: types.CODETASKSHELL,
        name: data.id + '',
        label: data.label,
        data,
        component: 'ViewContent'
      }
      this.tabStore.commit('add', attr)
    },
    getContextmenu(data) {
      const menus = []
      if (data.node_type === '0') {
        menus.push(deleteOpt)
        // menus.push(renameOpt)
      } else {
        menus.push(modifyOpt)
        menus.push({...modifyOptContent, disabled: data.is_allow_view ? false : true})
        menus.push(deleteOpt)
        // menus.push(renameOpt)
      }
      return menus
    },
    rename(data, node) {
      this.setActiveRdEditDialog({
        title: '重命名',
        component: 'CreateFolderManage',
        data: {
          ...this.project,
          treeData: this.treeData,
          data,
          folder_type: this.folder_type,
          sourceManage: 'sourceManage'
        }
      })
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

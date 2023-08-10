<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 10:43:55
 * @LastEditTime: 2023-07-15 19:17:00
 * @Description:
-->
<template>
  <section class="sync-task side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建任务" @click="createTask"></i>
        <!-- <i class="icon el-icon-folder-add"
           title="新建文件夹"
           @click="createFolder"></i> -->
      </span>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>

    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout" :props="defaultProps"></el-tree>

    <!-- 新建文件夹 -->
    <RenameRemove v-if="isDialogShow" @close="isDialogShow = false" :title="title" :editData="editData"></RenameRemove>

    <!-- 新增&编辑任务 -->
    <Task v-if="showTask" @close="showTask = false" :title="taskTitle" :editData="taskData"></Task>
  </section>
</template>

<script>
import Task from './components/task.vue'
import RenameRemove from './components/rename-remove'
// import fileManage from '@/mixins/file-manage.js'
import devTask from './dev-task.js'
import { deleteFlow, deleteFileOrFolder, getTreeData } from '@/api/rd/integrate'
import { renameTask, moveTask, cloneTask, deleteTask, getTaskinfo } from '@/api/rd/data-collection'

import { types } from '@/config/rd-config'
import { mapGetters } from 'vuex'

export default {
  name: 'SyncTask',
  mixins: [devTask],
  components: {
    Task,
    RenameRemove
  },
  data () {
    return {
      // 方法变量
      getTreeDataFetch: getTreeData, // 获取左侧列表
      deleteFetch: deleteFileOrFolder, // 删除文件或文件夹
      deleteTask: deleteTask,
      deleteFlow: deleteFlow,
      moveTask: moveTask,
      cloneTask: cloneTask,

      folder_type: '5',
      defaultProps: {
        children: 'child',
        label: 'label'
      },

      isDialogShow: false,
      title: '',
      editData: {},

      showTask: false,
      taskTitle: '新增任务',
      taskData: {}
    }
  },
  created () {
  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    'project.skd_prj_id': {
      handler (val) {
        // 切换项目 刷新列表
      },
      immediate: true
    }
  },
  methods: {
    // 新建任务
    createTask (data, node) {
      // -----> 数据集成下面
      this.showTask = true
      this.taskTitle = '新建任务'
      this.taskData = data
    },

    createFile () {
      this.tabStore.commit('add', {
        label: '新建业务',
        tabType: types.SYNCTASK,
        name: Date.now() + '',
        component: 'SyncTaskEdit',
        data: {
          treeData: this.treeData
        }
      })
    },

    createFolder () {
      this.isDialogShow = true
      this.title = '新建文件夹'
    },

    // 点击
    nodeClick (data, node) {
      this.tabStore.commit('add', {
        label: data.name,
        tabType: types.SYNCTASK,
        name: data.id,
        component: 'SyncTaskEdit',
        data: {
          ...data
        }
      })
    },

    // 编辑任务 ----> 画布
    edit (data) {
      this.tabStore.commit('add', {
        label: data.name,
        tabType: types.SYNCTASK,
        name: data.id,
        component: 'SyncTaskEdit',
        data: {
          ...data
        }
      })
    },

    // 任务重命名
    rename (data, node) {
      this.isDialogShow = true
      this.title = '重命名'
      this.editData = data
    },

    // 移动
    moveFolder (data, node) {
      this.isDialogShow = true
      if (data.node_type === '1') {
        this.title = '移动文件路径'
      } else {
        this.title = '移动文件夹路径'
      }
      this.editData = data
    },

    // 任务克隆 克隆一个已存在的任务，在此基础上修改任务的配置，提高配置的效率
    clone (data, node) {
      this.isDialogShow = true
      this.title = '克隆文件'
      this.editData = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

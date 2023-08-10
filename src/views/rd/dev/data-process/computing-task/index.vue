<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 10:43:55
 * @LastEditTime: 2023-08-08 16:47:15
 * @Description:
-->
<template>
  <section class="sync-task side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-folder-add" title="新建文件夹" @click="createFolder"></i>
        <i class="icon icon-yewuliucheng iconfont" title="新建业务流程" @click="createBuinessProcess"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>

    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @dblclick.native="handleNodeDoubleClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout" :props="defaultProps"></el-tree>

    <!-- 新建文件夹 重命名 删除 -->
    <Rename v-if="editFolderShow" @close="editFolderShow = false" :title="title" :editData="editData"></Rename>

    <!-- 新建/编辑业务流程 -->
    <Process v-if="isProcessShow" @close="isProcessShow = false" :title="processTitle" :editData="processData"></Process>
  </section>
</template>

<script>
import Rename from './components/rename-remove.vue'
import Process from './components/buinessProcess.vue'
import devTask from './dev-task.js'
import { deleteFlow, deleteFileOrFolder, getTreeData, getFlow, deleteTask, getTask } from '@/api/rd/integrate'
import { mapGetters } from 'vuex'

export default {
  name: 'dataDevelopment',
  mixins: [devTask],
  components: {
    Rename,
    Process
  },
  data () {
    return {
      getTreeDataFetch: getTreeData, // 获取数结构列表
      deleteFetch: deleteFileOrFolder, // 删除文件或文件夹
      deleteFlow: deleteFlow,
      deleteTask: deleteTask,
      folder_type: '5',
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      editFolderShow: false,
      isProcessShow: false,
      title: '',
      processTitle: '',
      editData: {},
      processData: {},
      lastClickTime: null
    }
  },
  created () {

  },
  mounted () {
    this.$root.eventEmitter.on('node-edit', (nodeData) => {
      this.showNode(nodeData)
    })
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    createFile () {
      this.tabStore.commit('add', {
        label: '新建业务流程',
        tabType: 'computingTask',
        name: Date.now() + '',
        component: 'ComputingTaskEdit',
        data: {
          treeData: this.treeData
        }
      })
    },

    createFolder () {
      this.editFolderShow = true
      this.title = '新建文件夹'
    },

    // 新建业务流程
    createBuinessProcess () {
      this.isProcessShow = true
      this.processTitle = '新建业务流程'
    },

    handleNodeDoubleClick (data, node) {
      // 原生 拿不到 data node
    },

    nodeClick (data, node) {
      // node_type：'0':文件夹，'1'：文件(节点)，'2':业务流程，'3':任务类型
      const { node_type, name, id } = data
      if (node_type === '2') {
        if (this.lastClickTime && ((new Date().getTime() - this.lastClickTime) < 300)) {
          // 双击事件
          this.tabStore.commit('add', {
            label: name,
            tabType: 'computingTask',
            name: id,
            component: 'ComputingTaskEdit',
            data: {
              ...data
            }
          })
        } else {
          // 单击事件
        }
        this.lastClickTime = new Date().getTime()
      }

      // 文件 真实节点
      if (node_type === '1') {
        this.getTaskData(data)
      }
    },

    // 获取节点信息
    async getTaskData (data) {
      const res = await getTask({ id: data.id })
      if (res) {
        const { config, code, id, flowId, name, type } = res.data
        let formData = {}
        if (config) {
          formData = JSON.parse(config)
        }
        const form = {
          isNode: true,
          object_type: type,
          code,
          id,
          flowId,
          name,
          type,
          ...formData
        }
        this.showTab(form, 'nodeAttr')
      }
    },

    // 获取节点信息
    showNode (nodeData) {
      const data = {
        isNode: true,
        object_type: nodeData.type,
        ...nodeData
      }
      this.showTab(data, 'nodeAttr')
    },

    // 编辑节点
    showTab (data, flag) {
      console.log('form-data-1', data, flag)
      this.tabStore.commit('add', {
        label: data.name,
        tabType: 'computingTask',
        name: data.id,
        component: 'ComputingTaskEdit',
        flag: flag,
        data: {
          ...data
        }
      })
    },

    // 编辑业务流程
    edit (data) {
      if (data.node_type === '2') {
        this.isProcessShow = true
        this.processTitle = '编辑业务流程'
        this.getFlowData(data, data.id)
      }

      if (data.node_type === '1') {
        this.tabStore.commit('add', {
          label: data.name,
          tabType: 'computingTask',
          name: data.id,
          component: 'ComputingTaskEdit',
          data: {
            ...data
          }
        })
      }
    },

    // 业务流程详情
    async getFlowData (data, id) {
      const res = await getFlow({ id })
      if (res) {
        // const { id, catalogid, name, remark, skdPrjId } = res.data
        // 获取备注
        this.processData = {
          ...data,
          ...res.data
        }
      }
    },

    // 移动
    moveFolder (data, node) {
      this.editFolderShow = true
      this.title = data.node_type === '1' ? '移动文件' : '移动文件夹'
      this.editData = data
    },

    // 重命名
    rename (data, node) {
      this.editFolderShow = true
      this.title = '重命名'
      this.editData = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

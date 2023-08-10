<template>
  <section class="server side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" @click="createFile"></i>
      </span>
    </div>

    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">{{ getDicsValue('status_tag', fileBrief.status) }}</div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.name }}</p>
        </div>
        <div class="brief-body">
          <p>
            <span class="label">创建人：</span>
            <span class="value">{{ fileBrief.oper_user }}</span>
          </p>
          <p>
            <span class="label">创建时间：</span>
            <span class="value">{{ fileBrief.oper_time }}</span>
          </p>
        </div>
      </div>
    </NodePopper>

    <!-- 业务流程 -->
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>

    <div class="sv-bottom" @click="openObjectTable('FLOW')">
      <span>{{ $route.meta.name }}列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import serverTreeMixin from '@/mixins/server-tree'
import { getTreeData, deleteBusinessFlow } from '@/api/server/businessFlow'

export default {
  name: 'Flow',
  mixins: [serverTreeMixin],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      removeFileFetch: deleteBusinessFlow, // 业务流程删除
      editFile: this.editItem
    }
  },
  methods: {
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建业务流程',
        component: 'FlowEdit',
        data: { ...this.project }
      })
    },

    editItem () {
      const mockJson = {
        'process_name': 'aabb',
        'api_group': '3079a3ecc62148fc9d0cf5615487f138',
        'process_desc': 'aabb',
        'id': '2b8b78467f20431eac8aea8571197823'
      }
      this.setActiveRdEditDialog({
        title: '编辑业务流程',
        component: 'FlowEdit',
        data: mockJson
      })
    }
  }
}
</script>


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

    <!-- 服务编排 -->
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>

    <div class="sv-bottom" @click="openObjectTable('ARRANGE')">
      <span>{{ $route.meta.name }}列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import serverTreeMixin from '@/mixins/server-tree'
import { types } from '@/config/server-config'
import { getTreeData, deleteLayout } from '@/api/server/serivceLayout'

export default {
  name: 'Arrange',
  mixins: [serverTreeMixin],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      removeFileFetch: deleteLayout,
      editFile: this.editItem,
      type: '编排'
    }
  },
  methods: {
    createFile () {
      this.tabStore.commit('add', {
        label: '新建服务编排',
        tabType: types.ARRANGE,
        name: Date.now() + '',
        component: 'ArrangeEdit',
        data: {}
      })
    },
    // 编辑
    editItem () {
      this.tabStore.commit('add', {
        label: '编辑服务编排',
        tabType: types.ARRANGE,
        name: Date.now() + '',
        component: 'ArrangeEdit',
        data: {}
      })
    }
  }
}
</script>


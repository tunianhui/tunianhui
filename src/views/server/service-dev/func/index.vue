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

    <!-- 函数 -->
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>

    <div class="sv-bottom" @click="openObjectTable('FUNC')">
      <span>{{ $route.meta.name }}列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import serverTreeMixin from '@/mixins/server-tree'
import { types } from '@/config/server-config'
import { getTreeData } from '@/api/server/server'

export default {
  name: 'Func',
  mixins: [serverTreeMixin],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      editFile: this.editItem,
      type: '函数'
    }
  },
  created () {
  },
  methods: {
    createFile () {
      this.tabStore.commit('add', {
        label: '新建函数',
        tabType: types.FUNC,
        name: Date.now() + '',
        component: 'FuncEdit',
        data: {}
      })
    },
    // 编辑、测试、新增  ---- 不一样的
    editItem () {
      this.tabStore.commit('add', {
        label: '编辑函数',
        tabType: types.FUNC,
        name: Date.now() + '',
        component: 'FuncEdit',
        data: {}
      })
    }
  }
}
</script>


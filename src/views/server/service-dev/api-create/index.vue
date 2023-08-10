<template>
  <section class="server side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" @click="createApi"></i>
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

    <!-- API生成 -->
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>

    <div class="sv-bottom" @click="openObjectTable('APICREATE')">
      <span>{{ $route.meta.name }}列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import { getTreeData, getDelApi, getOffline } from '@/api/server/server'
import serverTreeMixin from '@/mixins/server-tree'
import { types } from '@/config/server-config'

export default {
  name: 'Create',
  mixins: [serverTreeMixin],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      removeFileFetch: getDelApi,
      offlineFetch: getOffline,
      editFile: this.editApi,
      testFile: this.testApi,
      type: '生成'
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    createApi () {
      this.tabStore.commit('add', {
        label: '生成API',
        tabType: types.APICREATE,
        name: Date.now() + '',
        component: 'ApiCreateEdit',
        data: {}
      })
    },
    editApi () {
      this.tabStore.commit('add', {
        label: '编辑API',
        tabType: types.APICREATE,
        name: Date.now() + '',
        component: 'ApiCreateEdit',
        data: {}
      })
    },
    // 测试API 打开新页面 之前的API测试
    testApi () {

    }
  }
}
</script>


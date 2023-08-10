<template>
  <section class="atom side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="createFile"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>
    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">{{ getDicsValue('status_tag', fileBrief.status) }}</div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.name }}</p>
          <!-- <p class="label">{{fileBrief.type}}</p> -->
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
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>
    <!-- @node-contextmenu="treeNodeContextMenu" -->
    <!-- <Contextmenu
      ref="treeContextmenu"
      :menus="contextmenus"
      :data="curNodeData"
      :node="curNode"
      @command="contextmenuHandle"
    ></Contextmenu>-->
    <div class="sv-bottom" @click="openObjectTable('DERIVE')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { del, offLine } from '@/api/rd/derive'
import { types } from '@/config/rd-config'
import { mapMutations } from 'vuex'

export default {
  name: 'Derive',
  mixins: [rdTreeMixin],
  data () {
    return {
      removeFileFetch: del,
      offlineFetch: offLine
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    createFile (type) {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit'
      })
    },
    modifyFile (data, node) {
      this.setActiveRdEditDialog({
        title: '编辑派生指标',
        component: 'DeriveEditDialog',
        data
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

<template>
  <section class="limit side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" @click="createFile"></i>
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
    <div class="sv-bottom" @click="openObjectTable('LIMIT')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { FILE_TYPE } from '@/config/dics'
import { delLimit, offLine } from '@/api/rd/limit'
import { types } from '@/config/rd-config'
export default {
  name: 'Limit',
  mixins: [rdTreeMixin],
  data () {
    return {
      removeFileFetch: delLimit,
      offlineFetch: offLine
    }
  },
  methods: {
    nodeClick (data, node) {
      // this.$refs.treeContextmenu.hide()
      if (data.type === FILE_TYPE) {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name,
          name: data.id,
          label: data.label,
          data
          // data: {...res.data, status: data.status}
        }
        this.attrStore.commit('add', attr)
        this.attrStore.commit('setActiveToFirst', attr)
      }
    },
    modifyFile (data, node) {
      this.setActiveRdEditDialog({
        title: '编辑业务限定',
        component: 'LimitEditDialog',
        data
      })
    },
    createFile () {
      this.tabStore.commit('add', {
        label: '新建业务限定',
        tabType: types.LIMIT,
        name: '新建业务限定',
        component: 'LimitEdit',
        data: {}
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

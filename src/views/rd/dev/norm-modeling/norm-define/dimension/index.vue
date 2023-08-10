<template>
  <section class="dimension side-view">
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
    <div class="sv-bottom" @click="openObjectTable('DIMENSION')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { delDim, offLine } from '@/api/rd/dimension'
import { types } from '@/config/rd-config'

export default {
  name: 'Dimension',
  mixins: [rdTreeMixin],
  data () {
    return {
      removeFileFetch: delDim,
      offlineFetch: offLine
    }
  },
  mounted(){
    if (this.$route.params.type !==undefined){
      this.createFile()
    }
    console.log(this.$route.params);
    console.log(this.$route);
  },
  methods: {
    createFile () {
      this.tabStore.commit('add', {
        label: '新建维度',
        tabType: types.DIMENSION,
        name: Date.now() + '',
        component: 'DimensionEdit',
        data: {}
      })
    },
    modifyFile (data, node) {
      // this.queryDimension(data, data.dim_type, 'edit')
      this.tabStore.commit('add', {
        label: '编辑维度：' + data.label,
        tabType: types.DIMENSION,
        name: '编辑' + data.id,
        component: 'DimensionEdit',
        // visibleFileQuote: true,
        data
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

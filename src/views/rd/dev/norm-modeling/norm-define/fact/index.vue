<template>
  <section class="fact side-view">
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
        <!-- <div
          class="brief-tag"
          :type="fileBrief.status"
        >{{getDicsValue('status_tag', fileBrief.status)}}</div>-->
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
    <div class="sv-bottom" @click="openObjectTable('FACT')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
// import {DIR_TYPE} from '@/config/dics'
import { delBusProcess } from '@/api/rd/fact'

export default {
  name: 'Fact',
  mixins: [rdTreeMixin],
  data () {
    return {
      removeFileFetch: delBusProcess
      // offlineFetch: offLineBusProcess
    }
  },
  methods: {
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建业务过程',
        component: 'FactEdit',
        data: { ...this.project }
      })
    },
    // 修改文件
    modifyFile (data, node) {
      this.setActiveRdEditDialog({
        title: '编辑业务过程',
        component: 'FactEdit',
        data: { ...data }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

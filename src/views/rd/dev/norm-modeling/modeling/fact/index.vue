<template>
  <section class="dimension-table side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
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
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { FILE_TYPE } from '@/config/dics'
import { del, offLine } from '@/api/rd/fact-table'
import { types } from '@/config/rd-config'
import { mapMutations } from 'vuex'
export default {
  name: 'FactTable',
  mixins: [rdTreeMixin],
  inject: ['fileStore'],
  data () {
    return {
      noEditContextmenu: true,
      removeFileFetch: del,
      offlineFetch: offLine,
      FACTTABLE: types.FACTTABLE
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
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    nodeClick (data, node) {
      // this.$refs.treeContextmenu.hide()
      if (data.type === FILE_TYPE) {
        console.log(data)
        const opt = {
          label: data.label,
          data: data,
          tabType: types.FACTTABLE,
          name: data.id,
          component: 'FactTableEdit'
        }
        this.tabStore.commit('add', opt)
        this.fileStore.commit('add', opt)
        this.fileStore.commit('setActiveToFirst', opt)
      }
    },
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建事实逻辑表',
        component: 'FactTableCreate',
        data: { ...this.project }
      })
    },
    trialRun (data) {
      let routeUrl = this.$router.resolve({
        path: '/rd/trialRun',
        query: {
          id: data.id,
          type: 'fact'
        }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

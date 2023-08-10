<template>
  <section class="atom side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" v-popover:create-popper></i>
        <el-popover ref="create-popper" placement="bottom-start" popper-class="dark-popper create-popper" :visible-arrow="false" trigger="hover" v-model="visibleCreatePopper">
          <ul class="popper-list">
            <li @click="createFile('atom')">
              <touch-ripple>新建原子指标</touch-ripple>
            </li>
            <li @click="createFile('deriveAtom')">
              <touch-ripple>新建衍生原子指标</touch-ripple>
            </li>
          </ul>
        </el-popover>
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
    <div class="sv-bottom" @click="openObjectTable('ATOM')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { del, offLine } from '@/api/rd/atom'
import { types } from '@/config/rd-config'
import { mapMutations } from 'vuex'

export default {
  name: 'Atom',
  mixins: [rdTreeMixin],
  data () {
    return {
      removeFileFetch: del,
      offlineFetch: offLine,
      visibleCreatePopper: false
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    createFile (type) {
      if (type === 'atom') {
        this.tabStore.commit('add', {
          label: '新建原子指标',
          name: `new_atom`,
          tabType: types.ATOM,
          component: 'AtomEdit',
          data: {}
        })
      } else {
        this.setActiveRdEditDialog({
          component: 'DeriveAtomEdit'
        })
      }
      this.visibleCreatePopper = false
    },
    modifyFile (data, node) {
      this.setActiveRdEditDialog({
        title: '编辑原子指标',
        component: 'AtomEditDialog',
        data
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

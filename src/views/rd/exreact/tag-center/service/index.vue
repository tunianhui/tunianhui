<template>
  <section class="tag-service side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>
    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">
          {{ getDicsValue('status_tag', fileBrief.status) || '测试' }}
        </div>
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

    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>
    <!-- <div class="sv-bottom" @click="openObjectList('TAGSERVICE')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div> -->
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { remove, offLine } from '@/api/rd/exreact/regular'
import { getTreeData } from '@/api/rd/exreact/'
import { DIR_TYPE } from '@/config/dics'

const fileMenus = [
  // {
  //   class: '',
  //   icon: 'el-icon-edit-outline',
  //   label: '编辑',
  //   command: 'modifyFile'
  // },
  {
    class: '',
    icon: 'el-icon-copy-document',
    label: '克隆',
    command: 'clone'
  }
  // {
  //   class: '',
  //   icon: 'iconfont icon-xiaxian2',
  //   label: '下线',
  //   command: 'offline'
  // },
  // {
  //   class: '',
  //   icon: 'el-icon-delete',
  //   label: '下线并删除',
  //   command: 'removeFile'
  // }
]

export default {
  name: 'TagService',
  mixins: [rdTreeMixin],
  data () {
    return {
      getTreeDataFetch: getTreeData,
      removeFileFetch: remove,
      offlineFetch: offLine
    }
  },
  methods: {
    // createFile() {
    //   this.setActiveRdEditDialog({
    //     title: '新建标签服务',
    //     component: `ServiceEdit`,
    //     data: {...this.project}
    //   })
    // },
    getContextmenu (data) {
      return data.type === DIR_TYPE ? [] : fileMenus
    },
    modifyFile (data, node) { },
    clone (data, node) { },
    addData (data, node) { }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

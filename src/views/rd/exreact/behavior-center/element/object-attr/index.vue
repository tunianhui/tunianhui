<template>
  <section class="regular side-view">
    <div class="sv-top flex-layout space-between" @click="goBehaviorBoard">
      <span>
        <i :class="behaviorBoard.icon"></i>
        {{ behaviorBoard.label }}
      </span>
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i
          class="icon el-icon-document-add"
          title="新建文件"
          @click="createFile"
        ></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input
        v-model="keywords"
        class="dark-input"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
      ></el-input>
    </div>
    <NodePopper
      v-model="visibleFileBrief"
      popper-class="dark-popper"
      :node="popperNode"
    >
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
            <span class="value">{{ fileBrief.operUser }}</span>
          </p>
          <p>
            <span class="label">创建时间：</span>
            <span class="value">{{ fileBrief.operTime }}</span>
          </p>
        </div>
      </div>
    </NodePopper>
    <el-tree
      class="sv-tree"
      ref="tree"
      v-loading="!!loading"
      highlight-current
      :node-key="nodeKey"
      :data="treeData"
      :current-node-key="curNodeKey"
      :default-expanded-keys="expandedKeys"
      :auto-expand-parent="true"
      :filter-node-method="filterNode"
      :render-content="renderContent"
      :current-change="currentChange"
      @node-click="nodeClick"
      @mouseover.native="nodeMouseover"
      @mouseout.native="nodeMouseout"
    ></el-tree>
    <div class="sv-bottom" @click="openObjectTable('OBJECTATTR')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import {getListAll, del} from '@/api/rd/exreact/object-attr'
import {DIR_TYPE, FILE_TYPE} from '@/config/dics'

const fileMenus = [
  {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑',
    command: 'modifyFile'
  },
  // {
  //   class: '',
  //   icon: 'el-icon-copy-document',
  //   label: '克隆',
  //   command: 'clone'
  // }
  // {
  //   class: '',
  //   icon: 'iconfont icon-xiaxian2',
  //   label: '下线',
  //   command: 'offline'
  // },
  {
    class: '',
    icon: 'el-icon-delete',
    label: '删除',
    command: 'removeFile'
  }
]

export default {
  name: 'Regular',
  mixins: [rdTreeMixin],
  data() {
    return {
      getTreeDataFetch: getListAll,
      removeFileFetch: del
    }
  },
  methods: {
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建对象属性',
        component: `ObjectAttrEdit`,
        data: {...this.project}
      })
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const {objectAttrCode, objectAttrName, id} = item
        const treeItem = {
          name: objectAttrName,
          code: objectAttrCode,
          label: objectAttrName || objectAttrCode,
          type: FILE_TYPE,
          // parentId: parentId + '',
          icon: this.icons[FILE_TYPE],
          ...item,
          id: id + ''
        }
        // this.briefMap[id] = item
        this.briefMap[id] = treeItem
        target.push(treeItem)
      })
    },
    getContextmenu(data) {
      return data.type === DIR_TYPE ? [] : fileMenus
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑对象属性',
        component: `ObjectAttrEdit`,
        data: {...this.project, ...data}
      })
    },
    clone(data, node) {},
    addData(data, node) {}
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

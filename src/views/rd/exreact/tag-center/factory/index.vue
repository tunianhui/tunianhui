<template>
  <section class="tag-factory side-view">
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
          <p class="value">{{ fileBrief.label_name }}</p>
          <p class="value">{{ fileBrief.label_desc }}</p>
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
    <div class="sv-bottom" @click="openObjectTable('FACTORY')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
// import {offLine} from '@/api/rd/exreact/regular'
// import {getTreeData} from '@/api/rd/exreact/'
// import { getTreeData } from './data'
import {
  getFactoryLabelList,
  deleteTag,
  offLine
} from '@/api/rd/exreact/tag-center'
import {FILE_TYPE} from '@/config/dics'
// import {types} from '@/config/rd-config'

const modifyOpt = {
  class: '',
  icon: 'el-icon-edit-outline',
  label: '编辑',
  command: 'modifyFile'
}
const deleteOpt = {
  class: '',
  icon: 'el-icon-document-remove',
  label: '删除',
  command: 'removeFile'
}
const offlineOpt = {
  class: '',
  icon: 'iconfont icon-xiaxian2',
  label: '下线',
  command: 'offline'
}
export default {
  name: 'TagFactory',
  mixins: [rdTreeMixin],
  inject: ['fileStore'],
  data() {
    return {
      // getTreeDataFetch: getTreeData,
      removeFileFetch: deleteTag,
      offlineFetch: offLine
    }
  },
  methods: {
    nodeClick(data, node) {
      const attr = {
        title: '工厂标签',
        attrType: this.types.FACTORY,
        name: data.id + '',
        label: data.code,
        data,
        width: '500px'
      }
      this.attrStore.commit('add', attr)
    },
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建工厂标签',
        component: `FactoryEdit`,
        data: {...this.project}
      })
    },
    getContextmenu(data) {
      const menus = []
      if (data.type === FILE_TYPE) {
        if (!this.noEditContextmenu) {
          menus.push(modifyOpt)
        }
        if (['6', '7'].includes(data.status) && this.offlineFetch) {
          menus.push(offlineOpt)
        }
        menus.push(deleteOpt)
      }
      return menus
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑工厂标签',
        component: `FactoryEdit`,
        data: {...this.project, ...data}
      })
    },
    clone(data, node) {},
    addData(data, node) {},
    async getTreeData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getFactoryLabelList({project_code: this.project.project_code}), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData)
        if (this.treeData.length > 0) {
          const id = this.activeTreeId || this.treeData[0].id
          this.changeTreeState(id)
          this.setActiveTreeId('')
        }
      }
      this.loading--
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        // const { id, name, code, type, parentId, children, total } = item
        const id = item.id, label = item.label_name
        const treeItem = {
          label,
          type: 1,
          icon: 'iconfont icon-biaoqian',
          ...item,
          id: id + '',
          name: label
        }
        this.briefMap[id] = item
        // if (children && children.length) {
        //   treeItem.children = []
        //   this.recursionTreeData(children, treeItem.children)
        // }
        target.push(treeItem)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

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
          v-popover:create-popper
        ></i>
        <el-popover
          ref="create-popper"
          placement="bottom-start"
          popper-class="dark-popper create-popper"
          :visible-arrow="false"
          trigger="hover"
          v-model="visibleCreatePopper"
        >
          <ul class="popper-list">
            <li @click="createFile('Domain')">
              <touch-ripple>新建行为域</touch-ripple>
            </li>
            <li @click="createFile('Bus')">
              <touch-ripple>新建业务线</touch-ripple>
            </li>
          </ul>
        </el-popover>
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
        <!-- <div class="brief-tag" :type="fileBrief.status">
          {{ getDicsValue('status_tag', fileBrief.status) || '测试' }}
        </div> -->
        <div class="brief-head">
          <p class="value">{{ fileBrief.displayName }}</p>
          <p class="value">{{ fileBrief.name }}</p>
        </div>
        <div class="brief-body">
          <p>
            <span class="label">创建人：</span>
            <span class="value">{{ fileBrief.creatorDisplayName }}</span>
          </p>
          <p>
            <span class="label">更新人：</span>
            <span class="value">{{ fileBrief.modifierDisplayName }}</span>
          </p>
          <p>
            <span class="label">更新时间：</span>
            <span class="value">{{ fileBrief.gmtModified }}</span>
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
    <div class="sv-bottom" @click="openObjectTable('DOMAINBUS')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
// import {remove, offLine} from '@/api/rd/exreact/regular'
import {getlistFieldAndBusiField, delDomain, delBus} from '@/api/rd/exreact/domain-bus'
// import { getTreeData } from './data'
import {DIR_TYPE, FILE_TYPE} from '@/config/dics'
import OverflowTooltip from '@c/overflow-tooltip'
// import { treeData } from '../../../../ops/logic/instance/data'

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
  components: {
    // OverflowTooltip
  },
  data() {
    return {
      // getTreeDataFetch: getTreeData,
      removeFileFetch: null,
      // offlineFetch: offLine,
      visibleCreatePopper: false
    }
  },
  methods: {
    createFile(type) {
      const title = `新建${type === 'Domain' ? '行为域' : '业务线'}`
      this.setActiveRdEditDialog({
        title,
        component: `${type}Edit`,
        data: {...this.project}
      })
      this.visibleCreatePopper = false
    },
    getContextmenu(data) {
      // return data.type === DIR_TYPE ? [] : fileMenus
      return fileMenus
    },
    modifyFile(data, node) {
      if (data.type === 1) {
        this.setActiveRdEditDialog({
          title: '编辑业务线',
          component: `BusEdit`,
          data: {...this.project, ...data}
        })
      } else {
        this.setActiveRdEditDialog({
          title: '编辑行为域',
          component: `DomainEdit`,
          data: {...this.project, ...data}
        })
      }
    },
    clone(data, node) {},
    addData(data, node) {},
    async getTreeData() {
      this.loading++
      // const {
      //   business_field_name,
      //   business_field_id,
      //   project_name,
      //   project_id
      // } = this.project
      const res = await this.$simpleAsyncTo(getlistFieldAndBusiField(), '获取列表失败')
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
        const { id, name, domainId, count } = item
        let type = null
        let children = item.bizLineVOS
        if (children) {
          type = 0
        } else {
          type = 1
        }
        const treeItem = {
          label: name,
          type,
          parentId: domainId + '',
          total: count,
          icon: this.icons[type],
          ...item,
          id: id + ''
        }
        this.briefMap[id] = item
        if (children && children.length) {
          treeItem.children = []
          this.recursionTreeData(children, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    nodeClick(data, node) {
      let type = ''
      if (data.type === 0) {
        type = 'behavior'
      } else {
        type = 'bizLine'
      }
      const attr = {
        title: this.$route.meta.name,
        attrType: this.$route.name,
        name: data.id + '',
        label: data.label,
        data,
        type
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    renderContent(h, { node, data, store }) {
      const { type, icon, total, label, id } = data
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
        contextmenus = this.getContextmenu(data),
        controls = contextmenus.length ? (
          <span class="node-controls">
            <i class="icon el-icon-copy-document" v-clipboard={{ value: data.label }} onClick={e => e.stopPropagation()} />
            <span class="more-control">
              <el-popover
                popper-class="more-popover"
                placement="bottom-end"
                width="100px"
                trigger="hover"
              >
                <ul class="popper-list">
                  {contextmenus.map(item => (
                    <li
                      key={item.command}
                      class={{ 'is-disabled': item.disabled }}
                      on-click={ev => {
                        ev.stopPropagation()
                        this.$root.eventEmitter.emit('hideSidebar')
                        this[item.command](data, node)
                      }}
                    >
                      <i class={item.icon}></i>
                      <span class="ml-8 font-12">{item.label}</span>
                    </li>
                  ))}
                </ul>
                <i
                  class="icon el-icon-more"
                  onClick={e => e.stopPropagation()}
                  slot="reference"
                />
              </el-popover>
            </span>
          </span>
        ) : ''

      if (type === DIR_TYPE) {
        iconClass = `${icon} icon dir`
        _total = `(${total})`
        wrapperClass = 'custom-node custom-node-dir'
      } else {
        iconClass = `${icon} icon file`
        wrapperClass = 'custom-node custom-node-file'
        if (node.level === 1) {
          wrapperClass += ' no-parent'
        }

        this.$route.meta.color && (style = `color: ${this.$route.meta.color};`)
      }
      return (
        <span class={wrapperClass} data-id={type === FILE_TYPE ? id : ''}>
          <span class="node-content">
            <i class={iconClass} style={style} />
            {/* <span> */}
            <OverflowTooltip>
              <span class="node-name">
                {label}
                {_total}{' '}
              </span>
            </OverflowTooltip>
            {/* </span> */}
          </span>
          {controls}
        </span>
      )
    },
    removeFile(data, node) {
      if (data.type === 1) {
        this.removeFileFetch = delBus
      } else {
        this.removeFileFetch = delDomain
      }
      this.$confirm('请确认是否删除此文件吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { id } = data
          this.loading++
          const res = await this.$simpleAsyncTo(
            this.removeFileFetch({ id }),
            '删除文件失败'
          )
          if (res) {
            this.$message({
              showClose: true,
              message: '删除文件成功',
              type: 'success'
            })
            this.$refs.tree.remove(node, data)
            this.treeData.forEach(item => {
              if (item.id === data.parentId) {
                item.total -= 1
              }
            })
            const activeTab = this.tabStore.states.active
            activeTab &&
              activeTab.name === 'objectTable' &&
              this.objectTableType === this.$route.name &&
              this.$root.eventEmitter.emit('refreshTable')
            // this.$root.eventEmitter.on('refreshTable')

            this.tabStore && this.tabStore.commit('remove', id)
            this.attrStore.commit('remove', id + '')
            this.attrStore.commit('setActive', null)
          }
          this.loading--
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

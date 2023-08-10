<template>
  <section class="tag-category side-view">
    <div class="sv-head">
      <strong>{{ $route.meta.name }}</strong>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData()"></i>
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
            <span class="label">操作人：</span>
            <span class="value">{{ fileBrief.oper_user }}</span>
          </p>
          <p>
            <span class="label">操作时间：</span>
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
      :props="defaultProps"
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
    <div class="sv-bottom" @click="openObjectTable('CATEGORY')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
// import {offLine} from '@/api/rd/exreact/regular'
import {getTabCategoryList, deleteCategory} from '@/api/rd/exreact/tag-center'
import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import OverflowTooltip from '@c/overflow-tooltip'
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
  name: 'TagCategory',
  mixins: [rdTreeMixin],
  data() {
    return {
      // getTreeDataFetch: getTreeData,
      removeFileFetch: deleteCategory,
      // offlineFetch: offLine,
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  methods: {
    async getTreeData() {
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data.child, this.treeData)
      }
    },
    recursionTreeData(source, target) {
      source.forEach((item, index) => {
        const {name, child} = item
        let icon = '', total = 0, id = item.id
        if (item.name === '工厂标签' || item.name === '手工标签') {
          id = item.name + index + new Date()
          if (item.name === '工厂标签') {
            item.child.forEach(el => {
              el.icon = 'iconfont icon-gongchangbiaoqian'
              el.fileType = '工厂'
            })
          } else {
            item.child.forEach(el => {
              el.icon = 'iconfont icon-biaoqian2'
              el.fileType = '手工'
            })
          }
        }
        if (!item.child) {
          icon = item.icon
        }
        if (item.name !== '工厂标签' && item.name !== '手工标签' && item.child) {
          icon = this.icons[child ? 0 : 1]
          let children = item.child.filter(item => item.name === '工厂标签' || item.name === '手工标签')
          children.forEach(val => {
            total = total + val.child.length
          })
        }
        const treeItem = {
          label: name,
          ...item,
          type: child ? 0 : 1,
          icon,
          total,
          id: id + ''
        }
        this.briefMap[id] = item
        if (child && child.length) {
          treeItem.child = []
          this.recursionTreeData(child, treeItem.child)
        }
        target.push(treeItem)
      })
    },
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建标签类目',
        component: `CategoryEdit`,
        data: {...this.project}
      })
    },
    getContextmenu(data) {
      return fileMenus
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑标签类目',
        component: `CategoryEdit`,
        data: {...this.project, ...data}
      })
    },
    nodeClick(data, node) {
      if (data.fileType === '工厂') {
        const attr = {
          title: '工厂标签',
          attrType: this.types.FACTORY,
          name: data.id + '',
          label: data.code,
          data,
          width: '500px'
        }
        this.attrStore.commit('add', attr)
      } else if (data.fileType === '手工') {
        const opt = {
          label: data.label,
          data: data,
          tabType: this.types.LOGIC,
          name: data.fileType,
          component: 'LogicEdit'
        }
        this.tabStore.commit('add', opt)
      }
    },
    // nodeMouseover(event) {
    //   const fileNode = this.findFileNode(event)
    //   this.fileNode = fileNode

    //   if (!fileNode) return
    //   const id = getData(fileNode, 'id')
    //   this.fileBrief = this.briefMap[id]
    //   this.popperNode = fileNode.parentNode
    // },
    // findFileNode(event) {
    //   const el = event.target,
    //     nodeClass = `.custom-node-file`

    //   let customNode = el.closest(nodeClass)
    //   if (customNode === null) {
    //     if (hasClass(el, 'el-tree-node__expand-icon')) {
    //       customNode = el.parentNode.querySelector(nodeClass)
    //     } else if (hasClass(el, 'el-tree-node__content')) {
    //       customNode = el.querySelector(nodeClass)
    //     }
    //   }
    //   return customNode
    // },
    renderContent(h, { node, data, store }) {
      const { type, icon, total, label, id } = data
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
        contextmenus = this.getContextmenu(data),
        controls = ''

      let menus = (<span class="more-control">
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
      </span>)
      if (data.name !== '工厂标签' && data.name !== '手工标签') {
        // controls = contextmenus.length ? (
        //   <span class="node-controls">
        //     <i class="icon el-icon-copy-document" v-clipboard={{ value: data.label }} onClick={e => e.stopPropagation()} />
        //   </span>
        // ) : ''
        if (data.type === DIR_TYPE) {
          controls = contextmenus.length ? (
            <span class="node-controls">
              <i class="icon el-icon-copy-document" v-clipboard={{ value: data.label }} onClick={e => e.stopPropagation()} />
              {menus}
            </span>
          ) : ''
        } else {
          controls = contextmenus.length ? (
            <span class="node-controls">
              <i class="icon el-icon-copy-document" v-clipboard={{ value: data.label }} onClick={e => e.stopPropagation()} />
            </span>
          ) : ''
        }
      }
      if (type === DIR_TYPE) {
        if (!icon) {
          iconClass = ``
          _total = ''
          wrapperClass = ''
        } else {
          iconClass = `${icon} icon dir`
          _total = `(${total})`
          wrapperClass = 'custom-node custom-node-dir'
        }
      } else {
        iconClass = `${icon} icon file`
        wrapperClass = 'custom-node custom-node-file'
        if (node.level === FILE_TYPE) {
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
    clone(data, node) {},
    addData(data, node) {}
    // async getTreeData() {
    //   this.loading++
    //   const res = await this.$simpleAsyncTo(getTreeData(), '获取失败')
    //   if (res) {
    //     this.treeData = []
    //     this.recursionTreeData(res.data, this.treeData)
    //     if (this.treeData.length > 0) {
    //       const id = this.activeTreeId || this.treeData[0].id
    //       this.changeTreeState(id)
    //       this.setActiveTreeId('')
    //     }
    //   }
    //   this.loading--
    // }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

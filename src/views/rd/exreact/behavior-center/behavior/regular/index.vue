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
          <p class="value">{{ fileBrief.cube_code }}</p>
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
    <div class="sv-bottom" @click="openObjectTable('REGULAR')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import {remove, offLine, getRegularTree} from '@/api/rd/exreact/regular'
// import {getRegularTree} from '@/api/rd/exreact/'
// import { getRegularList } from '@/api/rd/exreact/regular'
import {DIR_TYPE, FILE_TYPE} from '@/config/dics'
import {mapMutations} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'

const dirMenus = [
  {
    class: '',
    icon: 'iconfont icon-bushuju',
    label: '补数据',
    command: 'addData'
  }
]
const fileMenus = [
  {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑',
    command: 'modifyFile'
  },
  {
    class: '',
    icon: 'el-icon-copy-document',
    label: '克隆',
    command: 'clone'
  },
  {
    class: '',
    icon: 'iconfont icon-guizeyinqing',
    label: '行为规则任务',
    command: 'regularTask'
  },
  {
    class: '',
    icon: 'iconfont icon-bushuju',
    label: '补数据',
    command: 'addData'
  },
  {
    class: '',
    icon: 'iconfont icon-xiaxian2',
    label: '下线',
    command: 'offline'
  },
  {
    class: '',
    icon: 'el-icon-delete',
    label: '下线并删除',
    command: 'removeFile'
  }
]

export default {
  name: 'Regular',
  mixins: [rdTreeMixin],
  inject: ['fileStore'],
  data() {
    return {
      // getTreeDataFetch: getTreeData,
      removeFileFetch: remove,
      offlineFetch: offLine
    }
  },
  created() {
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getTreeData() {
      const params = {projectId: this.project.project_id}
      const res = await this.$simpleAsyncTo(getRegularTree(params), '获取数据失败')
      if (res) {
        this.recursionTreeData(res.data)
        this.treeData = res.data
        // this.getSpanArr(this.tableData)
      }
    },
    recursionTreeData(source) {
      source.forEach(item => {
        // const { id, name, code, type, parentId, children, total } = item
        item.name = item.base_name
        item.label = item.base_name
        item.type = 0
        item.icon = 'el-icon-folder'
        item.rules.forEach(val => {
          val.name = val.cube_name
          val.label = val.cube_name
          val.type = 1
          val.icon = this.$route.meta && this.$route.meta.icon
          this.briefMap[val.id] = val
        })
        item.children = item.rules
        this.briefMap[item.name] = item
      })
    },
    nodeClick(data, node) {
      // this.$refs.treeContextmenu.hide()
      if (data.type === FILE_TYPE) {
        const attr = {
          label: data.label,
          data: data,
          attrType: this.types.REGULAR,
          name: data.id,
          component: 'RegularAttr',
          width: '500px'
        }
        this.attrStore.commit('add', attr)
      }
    },
    createFile() {
      this.setActiveRdEditDialog({
        title: '新建行为规则',
        component: 'RegularEditDialog',
        data: {...this.project}
      })
    },
    getContextmenu(data) {
      return data.type === DIR_TYPE ? dirMenus : fileMenus
    },
    modifyFile(data, node) {
      this.setActiveRdEditDialog({
        title: '编辑行为规则',
        component: 'RegularEditDialog',
        data: {...this.project, ...data}
      })
    },
    clone(data, node) {},
    regularTask(data, node) {},
    addData(data, node) {
      this.setActiveRdEditDialog({
        title: '行为规则补数据',
        component: 'RegularAddData',
        data: {...this.project, ...data}
      })
    },
    renderContent(h, { node, data, store }) {
      const { type, icon, label, id } = data
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
        _total = `(${data.children ? data.children.length : 0})`
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
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

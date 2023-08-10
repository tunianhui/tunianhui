<template>
  <section class="dimension side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i
          class="icon iconfont icon-tianjia"
          title="新建文件"
          v-if="true"
          v-popover:createPopper
        ></i>
        <el-popover
          ref="createPopper"
          v-if="true"
          popper-class="dark-popper create-popper"
          placement="bottom-start"
          :visible-arrow="false"
          v-model="visibleCreatePopper"
        >
          <ul class="popper-list">
            <li @click="createFile('new')">
              <touch-ripple>创建建表工单</touch-ripple>
            </li>
            <li @click="createFile('edit')">
              <touch-ripple>创建修改表工单</touch-ripple>
            </li>
            <li @click="createFile('batchImport')">
              <touch-ripple>批量导入</touch-ripple>
            </li>
            <li @click="createFile('batchExport')">
              <touch-ripple>批量导出</touch-ripple>
            </li>
          </ul>
        </el-popover>
        <i
          class="icon el-icon-folder-add"
          title="新建文件夹"
          @click="createFolder"
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
          {{ fileBrief.status | filterStatus }}
        </div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.name }}</p>
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
    <RenameRemove
      v-if="isDialogShow"
      @close="close"
      :title="title"
      :editData="editData"
    ></RenameRemove>
    <div class="sv-bottom" @click="openObjectTable('DIMENSION')">
      <span>{{ $route.meta.name }}对象列表</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import {delDim, offLine} from '@/api/rd/dimension'
import {types} from '@/config/rd-config'
import RenameRemove from './rename-remove'
import {list, del} from '@/api/rd/table-manage.js'
import {FILE_TYPE, DIR_TYPE, SHELL, SQL} from '@/config/dics'
const moveOpt = {
    class: '',
    icon: 'el-icon-rank',
    label: '移动',
    command: 'moveFolder',
  },
  deleteOpt = {
    class: '',
    icon: 'el-icon-delete',
    label: '删除',
    command: 'removeFile',
  },
  renameOpt = {
    class: '',
    icon: 'el-icon-edit',
    label: '重命名',
    command: 'rename',
  },
  modifyOpt = {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑',
    command: 'nodeClick',
  },
  offlineOpt = {
    class: '',
    icon: 'iconfont icon-xiaxian2',
    label: '下线',
    command: 'offline',
  }

export default {
  name: 'Dimension',
  mixins: [rdTreeMixin],
  components: {
    RenameRemove,
  },
  data() {
    return {
      removeFileFetch: delDim,
      offlineFetch: offLine,
      visibleCreatePopper: false,
      isDialogShow: false,
      title: '',
      editData: {},
      del,
    }
  },
  filters: {
    filterStatus(val) {
      if (val == 1) {
        return '未提交'
      } else if (val == 2) {
        return '待审批'
      } else if (val == 3) {
        return '被驳回'
      } else if (val == 4) {
        return '已通过'
      }
    },
  },
  computed: {
  },
  created(){
    this.$root.eventEmitter.on('table-manage-refresh-treeData', () => {
      this.getTreeData()
    })
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('table-manage-refresh-treeData')
    next()
  },
  mounted() {
    if (this.$route.params.type !== undefined) {
      this.createFile()
    }
    console.log(this.$route.params)
    console.log(this.$route)
  },
  methods: {
    async getTreeData() {
      this.loading++
      const params = {
        folder_type: '7',
        project_id: this.project.project_id,
      }
      const res = await this.$simpleAsyncTo(list(params), '获取树数据失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data.child, this.treeData)
        if (this.treeData.length > 0) {
          const id = this.activeTreeId || this.treeData[0].id
          this.changeTreeState(id)
          this.setActiveTreeId('')
        }
      }
      this.loading--
    },
    getContextmenu(data) {
      const menus = []
      menus.push(moveOpt)
      if(data.node_type === FILE_TYPE + ''){

      }else {
        menus.push(renameOpt)
      }
      menus.push(deleteOpt)
      return menus
    },
    recursionTreeData(source, target) {
      source.forEach((item) => {
        const {id, name, node_type, child, object_type} = item
        let treeItem = {}
        if (node_type === DIR_TYPE + '') {
          treeItem = {
            label: name,
            node_type,
            icon: this.icons[DIR_TYPE],
            ...item,
            id: id + '',
            object_type,
            children: child || [],
          }
        } else {
          treeItem = {
            label: name,
            node_type,
            ...item,
            id: id + '',
            object_type,
            children: child || [],
          }
          if (object_type === SHELL) {
            treeItem.icon = this.icons[SHELL]
          } else {
            treeItem.icon = this.icons[SQL]
          }
        }
        this.briefMap[id] = item
        if (child && child.length) {
          treeItem.children = []
          this.recursionTreeData(child, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    close(data) {
      this.isDialogShow = false
    },
    createFile(type) {
      if (type == 'new' || type == 'edit') {
        this.tabStore.commit('add', {
          label: type == 'new' ? '建表工单' : '修改表工单',
          name: type == 'new' ? 'new_CreatTable' : 'modify_EditTable',
          tabType: types.TABLEMANAGE,
          component: type == 'new' ? 'CreatTable' : 'EditTable',
          data: {creatClick: true},
        })
      } else {
        this.setActiveRdEditDialog({
          component: type == 'batchImport' ? 'BatchImport' : 'BatchExport',
        })
      }
      this.visibleCreatePopper = false
    },
    modifyFile(data, node) {
      this.tabStore.commit('add', {
        label: '编辑维度：' + data.label,
        tabType: types.DIMENSION,
        name: '编辑' + data.id,
        component: 'DimensionEdit',
        data,
      })
    },
    createFolder() {
      this.isDialogShow = true
      this.title = '新建文件夹'
    },
    moveFolder(data, node) {
      this.isDialogShow = true
      if (data.node_type === FILE_TYPE + '') {
        this.title = '移动文件'
      } else {
        this.title = '移动文件夹'
      }
      this.editData = data
    },
    rename(data, node) {
      this.isDialogShow = true
      this.title = '重命名'
      this.editData = data
    },
    removeFile(data, node) {
      this.$confirm(
        `请确认是否删除【${data.label}】${
          data.node_type == '1' ? '文件' : '文件夹'
        }？`,
        '删除',
        {
          comfirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const { id } = data
          let params
          if (data.node_type === FILE_TYPE + '') {
            params = {
              id: data.id,
              node_type: data.node_type,
              oper_type: data.oper_type,
            }
          } else {
            params = {
              id: data.id,
              node_type: data.node_type,
            }
          }
          this.loading++
          const res = await this.$simpleAsyncTo(
            this.del(params),
            `删除${data.node_type == '1' ? '文件' : '文件夹'}失败`
          )
          if (res) {
            this.$message({
              showClose: true,
              message: '删除文件成功',
              type: 'success',
            })
            this.$refs.tree.remove(node, data)
            this.treeData.forEach((item) => {
              if (item.id === data.parentId) {
                item.total -= 1
              }
            })
            const activeTab = this.tabStore.states.active
            activeTab &&
              activeTab.name === 'objectTable' &&
              this.objectTableType === this.$route.name &&
              this.$root.eventEmitter.emit('refreshTable')

            this.tabStore && this.tabStore.commit('remove', id)
          }
          this.loading--
        })
        .catch(async (_) => {
          this.$message({
            type: 'info',
            message: '取消删除！',
          })
        })
    },
    nodeClick(data, node) {
      if (data.node_type === FILE_TYPE + '') {
        let tabType = types.TABLEMANAGE,
          component
        if (data.status == 1 || data.status == 3) {
          if (data.oper_type == '新建表') {
            component = 'CreatTable'
          } else if (data.oper_type == '修改表') {
            component = 'EditTable'
          }
          const attr = {
            title: this.$route.meta.name,
            tabType,
            name: data.id + '',
            label: data.label,
            data,
            treeData: this.treeData,
            component,
          }
          this.tabStore.commit('add', attr)
        } else if (data.status == 2 || data.status == 4) {
          component = 'ViewTable'
          const attr = {
            title: this.$route.meta.name,
            tabType,
            name: data.id + '',
            label: data.label,
            data,
            treeData: this.treeData,
            component,
          }
          this.tabStore.commit('add', attr)
        }
      }
    },
    renderContent(h, {node, data, store}) {
      const {node_type, icon, label, id} = data
      const contextmenus = this.getContextmenu(data)
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
        controls = '',
        menus = (
          <span class="more-control">
            <el-popover
              popper-class="more-popover"
              placement="bottom-end"
              width="100px"
              trigger="hover"
            >
              <ul class="popper-list">
                {contextmenus.map((item) => (
                  <li
                    key={item.command}
                    class={{'is-disabled': item.disabled}}
                    on-click={(ev) => {
                      ev.stopPropagation()
                      this[item.command](data, node)
                    }}
                  >
                    <i class={item.icon} />
                    <span class="ml-8 font-12">{item.label}</span>
                  </li>
                ))}
              </ul>
              <i
                class="icon el-icon-more"
                onClick={(e) => e.stopPropagation()}
                slot="reference"
              />
            </el-popover>
          </span>
        )
      if (node_type === DIR_TYPE + '') {
        iconClass = `${icon} icon dir`
        let files = data.children.filter((e) => {
          return e.node_type === '1'
        })
        _total = `(${files.length})`
        wrapperClass = 'custom-node custom-node-dir'
        controls = <span class="node-controls">{menus}</span>
      } else {
        iconClass = `${icon} icon file`
        wrapperClass = 'custom-node custom-node-file'
        controls = (
          <span class="node-controls">
            <i
              class="icon el-icon-copy-document"
              v-clipboard={{value: data.label}}
              onClick={(e) => e.stopPropagation()}
            />
            {menus}
          </span>
        )
        this.$route.meta.color && (style = `color: ${this.$route.meta.color};`)
      }
      return (
        <span
          class={wrapperClass}
          data-id={node_type === FILE_TYPE + '' ? id : ''}
        >
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
  },
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

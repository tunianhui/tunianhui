<template>
  <section class="code-task side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="createFile"></i>
        <i class="icon el-icon-folder-add" title="新建文件夹" @click="createFolder"></i>
      </span>
    </div>
    <NodePopper v-model="visibleFileBrief" popper-class="dark-popper" :node="popperNode">
      <div class="tree-node-brief">
        <div class="brief-tag" :type="fileBrief.status">
          {{ getDicsValue('status_tag', fileBrief.status) }}
        </div>
        <div class="brief-head">
          <p class="value">{{ fileBrief.name }}</p>
          <!-- <p class="label">{{fileBrief.type}}</p> -->
        </div>
        <div class="brief-body">
          <p>
            <!-- <span class="label">创建人：</span> -->
            <!-- <span class="value">{{ fileBrief.oper_user }}</span> -->
          </p>
          <p>
            <!-- <span class="label">创建时间：</span> -->
            <!-- <span class="value">{{ fileBrief.oper_time }}</span> -->
          </p>
        </div>
      </div>
    </NodePopper>
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>
    <RenameRemove v-if="isDialogShow" @close="close" :title="title" :editData="editData"></RenameRemove>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import RenameRemove from './rename-remove'
import {
  getTreeDataList,
  getDeleleFolder,
  getOffline
} from '@/api/rd/code-task.js'
import { FILE_TYPE, DIR_TYPE, SHELL, SQL } from '@/config/dics'
import OverflowTooltip from '@c/overflow-tooltip'
import { types } from '@/config/rd-config'
const moveOpt = {
  class: '',
  icon: 'el-icon-rank',
  label: '移动',
  command: 'moveFolder'
},
  deleteOpt = {
    class: '',
    icon: 'el-icon-delete',
    label: '下线并删除',
    command: 'removeFile'
  },
  renameOpt = {
    class: '',
    icon: 'el-icon-edit',
    label: '重命名',
    command: 'rename'
  },
  modifyOpt = {
    class: '',
    icon: 'el-icon-edit-outline',
    label: '编辑',
    command: 'nodeClick'
  },
  offlineOpt = {
    class: '',
    icon: 'iconfont icon-xiaxian2',
    label: '下线',
    command: 'offline'
  }
export default {
  name: 'CodeTask',
  mixins: [rdTreeMixin],
  components: {
    RenameRemove
  },
  data () {
    return {
      isDialogShow: false,
      title: '',
      editData: {},
      icons: {
        // [DIR_TYPE]: 'el-icon-folder',
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: 'iconfont icon-functions',
        [SHELL]: 'iconfont icon-Shell',
        [SQL]: 'iconfont icon-MxSQL'
      },
      offlineFetch: getOffline
    }
  },
  mounted () { },
  methods: {
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建文件',
        component: 'addFile',
        data: { ...this.project }
      })
    },
    createFolder () {
      this.isDialogShow = true
      this.title = '新建文件夹'
    },
    async getTreeData () {
      this.loading++
      // const res = await this.$simpleAsyncTo(getTreeData(), '获取树数据失败')
      const params = {
        folder_type: '2',
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(
        getTreeDataList(params),
        '获取树数据失败'
      )
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
    renderContent (h, { node, data, store }) {
      const { node_type, icon, label, id } = data
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
                {contextmenus.map(item => (
                  <li
                    key={item.command}
                    class={{ 'is-disabled': item.disabled }}
                    on-click={ev => {
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
                onClick={e => e.stopPropagation()}
                slot="reference"
              />
            </el-popover>
          </span>
        )
      if (node_type === DIR_TYPE + '') {
        iconClass = `${icon} icon dir`
        // _total = `(${data.children.length})`
        let files = data.children.filter(e => {
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
              v-clipboard={{ value: data.label }}
              onClick={e => e.stopPropagation()}
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
    recursionTreeData (source, target) {
      source.forEach(item => {
        const { id, name, node_type, child, object_type } = item
        let treeItem = {}
        if (node_type === DIR_TYPE + '') {
          treeItem = {
            label: name,
            node_type,
            icon: this.icons[DIR_TYPE],
            ...item,
            id: id + '',
            object_type,
            children: child || []
          }
        } else {
          treeItem = {
            label: name,
            node_type,
            ...item,
            id: id + '',
            object_type,
            children: child || []
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
    nodeClick (data, node) {
      if (data.node_type === FILE_TYPE + '') {
        let tabType
        if (data.object_type === SQL) {
          tabType = types.CODETASKSQL
        } else {
          tabType = types.CODETASKSHELL
        }
        const attr = {
          title: this.$route.meta.name,
          tabType,
          name: data.id + '',
          label: data.label,
          data,
          treeData: this.treeData,
          component: 'CodeTaskEdit'
        }
        this.tabStore.commit('add', attr)
      }
    },
    moveFolder (data, node) {
      this.isDialogShow = true
      if (data.node_type === FILE_TYPE + '') {
        this.title = '移动文件'
      } else {
        this.title = '移动文件夹'
      }
      this.editData = data
    },
    rename (data, node) {
      this.isDialogShow = true
      this.title = '重命名'
      this.editData = data
    },
    removeFile (data, node) {
      this.$confirm(`请确认是否删除【${data.label}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.loading++
          const { id, node_type } = data
          const res = await this.$simpleAsyncTo(
            getDeleleFolder({ id, node_type }),
            `删除${data.node_type === DIR_TYPE + '' ? '文件夹' : '文件'}失败`
          )
          if (res) {
            this.$message({
              showClose: true,
              message: `删除${data.node_type === DIR_TYPE + '' ? '文件夹' : '文件'
                }成功`,
              type: 'success'
            })
            this.$refs.tree.remove(node, data)
            this.tabStore && this.tabStore.commit('remove', id)
            this.getTreeData()
          }
          this.loading--
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // async offline(data, node) {
    //   console.log(data)
    // },
    getContextmenu (data) {
      const menus = []
      if (data.node_type === FILE_TYPE + '') {
        menus.push(modifyOpt)
        // menus.push(offlineOpt)
        if (['0', '6'].includes(data.status) && this.offlineFetch) {
          menus.push(offlineOpt)
          deleteOpt.label = '下线并删除'
        } else {
          deleteOpt.label = '删除'
        }
      } else {
        deleteOpt.label = '删除'
      }
      menus.push(moveOpt)
      menus.push(renameOpt)
      menus.push(deleteOpt)
      return menus
    },
    close (data) {
      this.isDialogShow = false
    }
    // nodeMouseover() {}
  }
}
</script>

<style lang="scss">
@import '@/assets/css/side-view.scss';
</style>

<template>
  <section class="ad-search side-view">
    <div class="sv-head">
      <div class="meta-name">{{ $route.meta.name }}</div>
      <span>
        <i class="icon el-icon-refresh" title="刷新" @click="getTreeData"></i>
        <i class="icon el-icon-document-add" title="新建文件" @click="createFile"></i>
        <i class="icon el-icon-folder-add" title="新建文件夹" @click="addFolder"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input v-model="keywords" class="dark-input" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
    </div>
    <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" @mouseover.native="nodeMouseover" @mouseout.native="nodeMouseout"></el-tree>
    <!-- @node-contextmenu="treeNodeContextMenu" -->
    <!-- <Contextmenu
      ref="treeContextmenu"
      :menus="contextmenus"
      :data="curNodeData"
      :node="curNode"
      @command="contextmenuHandle"
    ></Contextmenu>-->
    <AddEditFolder v-if="visible" @close="close" :title="title" :editData="editData"></AddEditFolder>
  </section>
</template>

<script>
import rdTreeMixin from '@/mixins/rd-tree'
import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import { types, treeTypes } from '@/config/rd-config'
import AddEditFolder from './add-edit-folder'
// import {mapGetters} from 'vuex'
import { getTreeData, getDel } from '@/api/rd/ad-search'
import OverflowTooltip from '@c/overflow-tooltip'
const moveOpt = {
  class: '',
  icon: 'el-icon-rank',
  label: '移动',
  command: 'moveFolder'
},
  deleteOpt = {
    class: '',
    icon: 'el-icon-delete',
    label: '删除',
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
  }
export default {
  name: 'AdSearch',
  mixins: [rdTreeMixin],
  components: {
    AddEditFolder
  },
  computed: {
    // ...mapGetters(['project'])
  },
  data () {
    return {
      tree_params_type: types.ADSEARCH,
      keywords: '',
      showAddFolder: false,
      folder_name: '',
      removeFileFetch: getDel,
      visible: false,
      title: '新建文件夹',
      editData: {},
      popperNode: null,
      visibleFileBrief: false,
      fileBrief: 'null',
      loading: 0,
      nodeKey: 'id',
      treeData: [],
      curNodeKey: '',
      expandedKeys: [],
      currentChange: [],
      contextmenus: [],
      curNodeData: {},
      curNode: {},
      icons: {
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: 'icon-MxSQL'
      }
    }
  },
  created () {
    this.$root.eventEmitter.on('refresh', _ => {
      this.getTreeData()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$root.eventEmitter.off('refresh')
    next()
  },
  methods: {
    async getTreeData () {
      this.loading++
      const params = {
        folder_type: treeTypes[types.ADSEARCH],
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(
        getTreeData(params),
        '获取树列表失败'
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
    // treeNodeContextMenu(event, data, node, tree) {
    //   if (data.node_type === DIR_TYPE + '') {
    //     this.contextmenus = [{...renameOpt}, {...moveOpt}, {...deleteOpt}]
    //   } else {
    //     this.contextmenus = [
    //       {...renameOpt},
    //       {...moveOpt},
    //       {...deleteOpt},
    //       {...modifyOpt}
    //     ]
    //   }
    //   this.visibleContextmenu(event, data, node)
    // },
    nodeClick (data, node) {
      // this.$refs.treeContextmenu.hide()
      if (data.node_type === FILE_TYPE + '' || data.node_type === FILE_TYPE) {
        const opt = {
          label: data.label,
          data: data,
          tabType: types.ADSEARCH,
          name: data.id,
          visibleFileQuote: true,
          component: 'AdSearchEdit'
        }
        this.tabStore.commit('add', opt)
      }
    },
    // 移动
    moveFolder (data, node) {
      this.visible = true
      if (DIR_TYPE + '' === data.type) {
        this.title = '移动文件夹'
      } else {
        this.title = '移动文件'
      }
      this.editData = data
    },
    // 重命名
    rename (data, node) {
      this.visible = true
      if (DIR_TYPE + '' === data.type) {
        this.title = '文件夹重命名'
      } else {
        this.title = '文件重命名'
      }
      this.editData = data
    },
    // 新建文件夹
    addFolder () {
      this.visible = true
      this.title = '新建文件夹'
      this.editData = {}
    },
    // 新建文件
    createFile () {
      this.setActiveRdEditDialog({
        title: '新建',
        component: 'AdSearchNewFile',
        data: { ...this.project }
      })
    },
    close (val) {
      this.visible = val
    },
    renderContent (h, { node, data, store }) {
      const contextmenus = this.getContextmenu(data)
      let iconClass,
        wrapperClass,
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
      if (data.node_type === DIR_TYPE + '' || data.node_type === DIR_TYPE) {
        iconClass = `${data.icon} icon dir`
        wrapperClass = 'custom-node custom-node-dir'
        controls = <span class="node-controls">{menus}</span>
      } else {
        iconClass = `icon iconfont ${data.icon} file`
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
          data-id={data.node_type === FILE_TYPE + '' ? data.id : ''}
        >
          <span class="node-content">
            <i class={iconClass} style={style} />
            {/* <span> */}
            <OverflowTooltip>
              <span class="node-name">{data.label}</span>
            </OverflowTooltip>
            {/* </span> */}
          </span>
          {controls}
        </span>
      )
    },
    getContextmenu (data) {
      const menus = []
      if (data.node_type === FILE_TYPE + '') {
        menus.push(modifyOpt)
      }
      menus.push(moveOpt)
      menus.push(renameOpt)
      menus.push(deleteOpt)
      return menus
    },
    recursionTreeData (source, target) {
      source.forEach(item => {
        const { id, name, node_type, child } = item
        const treeItem = {
          label: name,
          node_type,
          icon: this.icons[node_type],
          ...item,
          id: id + ''
        }
        // this.briefMap[id] = item
        if (child && child.length) {
          treeItem.children = []
          this.recursionTreeData(child, treeItem.children)
        }
        target.push(treeItem)
      })
    },
    removeFile (data, node) {
      this.$confirm(`请确认是否删除【${data.label}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.loading = true
          const { id, node_type } = data
          const res = await this.$simpleAsyncTo(
            this.removeFileFetch({ id, node_type }),
            `删除${data.node_type === '0' ? '文件夹' : '文件'}失败`
          )
          if (res) {
            this.$message({
              showClose: true,
              message: `删除${data.node_type === '0' ? '文件夹' : '文件'}成功`,
              type: 'success'
            })
            this.$refs.tree.remove(node, data)
            this.tabStore && this.tabStore.commit('remove', id)
          }
          this.loading = false
        })
        .catch(_ => {
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

import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import OverflowTooltip from '@c/overflow-tooltip'
import {mapMutations} from 'vuex'
import {types} from '@/config/asset-config'
import {capitalize} from '@/libs/util'
import { hasClass, getData } from '@/libs/dom'
import NodePopper from '@/components/node-popper'
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
const deleteFolderOpt = {
  class: '',
  icon: 'el-icon-document-remove',
  label: '删除',
  command: 'deleteFolder'
}
export default {
  inject: ['tabStore', 'attrStore'],
  components: {
    NodePopper
  },
  data() {
    return {
      loading: 0,
      nodeKey: 'id',
      treeData: [],
      curNodeKey: '',
      expandedKeys: [],
      currentChange: [],
      briefMap: {},
      fileBrief: 'null',
      popperNode: null,
      fileNode: null,
      visibleFileBrief: false,
      icons: {
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: this.$route.meta && this.$route.meta.icon
      },
      types
    }
  },
  created() {
    // this.getTreeData()
    // 新建/修改刷新树 在组件中调用 this.$root.eventEmitter.emit('refresh')
    this.$root.eventEmitter.on('refresh', type => {
      this.getTreeData()
    })

    // 删除刷新树及tabs 在组件中调用 this.$root.eventEmitter.emit('remove')
    this.$root.eventEmitter.on('remove', data => {
      this.$route.name === this.objectTableType && this.removeFile(data)
    })
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('refresh')
    this.$root.eventEmitter.off('remove')
    next()
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getTreeData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        this.getTreeDataFetch(),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData)
        // if (this.treeData.length > 0) {
        //   const id = this.activeTreeId || this.treeData[0].id
        //   this.changeTreeState(id)
        //   // this.setActiveTreeId('')
        // }
      }
      this.loading--
    },
    recursionTreeData (source, target) {
    },
    changeTreeState(id) {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
        this.curNodeKey = id
        this.expandedKeys = [id]
        // id !== this.expandedKeys[0] && (this.expandedKeys = [id])
      })
    },
    nodeClick(data, node) {
      if (data.type === FILE_TYPE) {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name,
          name: data.id + '',
          label: data.label,
          data
        }
        this.attrStore.commit('add', attr)
        this.attrStore.commit('setActiveToFirst', attr)
      }
    },
    nodeMouseover(event) {
      const fileNode = this.findFileNode(event)
      this.fileNode = fileNode

      if (!fileNode) return
      const id = getData(fileNode, 'id')
      console.log(id)
      this.fileBrief = this.briefMap[id]
      this.popperNode = fileNode.parentNode
    },
    nodeMouseout() {
      this.popperNode = null
    },
    findFileNode(event) {
      const el = event.target,
        nodeClass = `.custom-node-file`

      let customNode = el.closest(nodeClass)
      if (customNode === null) {
        if (hasClass(el, 'el-tree-node__expand-icon')) {
          customNode = el.parentNode.querySelector(nodeClass)
        } else if (hasClass(el, 'el-tree-node__content')) {
          customNode = el.querySelector(nodeClass)
        }
      }
      return customNode
    },
    renderContent(h, { node, data, store }) {
      const { type, icon, total = 0, label, id, img } = data
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
        iconBox = '',
        contextmenus = this.getContextmenu(data),
        controls = contextmenus.length ? (
          <span class="node-controls">
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
      if (type) {
        if (type === 'folder') {
          iconClass = `${icon} icon dir`
          if (img) {
            iconBox = (<img src={require(`@/assets/images/${img}`)} style='width:14px;margin-right:8px'></img>)
          } else if (icon) {
            iconBox = (<i class={iconClass} style={style} />)
          }
          _total = `(${total})`
          wrapperClass = 'custom-node custom-node-dir'
        } else {
          iconClass = `${icon} icon file`
          wrapperClass = 'custom-node custom-node-file'
          if (node.level === 1) {
            wrapperClass += ' no-parent'
          }
          this.$route.meta.color && (style = `color: ${this.$route.meta.color};`)
          iconBox = (<i class={iconClass} style={style} />)
        }
      } else {
        if (img) {
          iconBox = (<img src={require(`@/assets/images/${img}`)} style='width:14px;margin-right:8px'></img>)
        }
        _total = `(${total})`
        wrapperClass = 'custom-node custom-node-dir'
      }
      return (
        <span class={wrapperClass} data-id={id}>
          <span class="node-content">
            {iconBox}
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
    getContextmenu(data) {
      let menus = []
      if (this.treeType === 'category') {
        if (data.parentId && data.parentId !== '/') {
          menus = [modifyOpt, deleteOpt]
        }
      } else if (this.treeType === 'dict') {
        if (data.parentId) {
          if (data.type === 'folder') {
            menus = [modifyOpt, deleteFolderOpt]
          } else {
            menus = [modifyOpt, deleteOpt]
          }
        }
      } else {
        if (data.type === 'node') {
          menus = [modifyOpt, deleteOpt]
        }
      }
      // menus = [modifyOpt, deleteOpt]
      // if (data.type === FILE_TYPE) {
      //   if (!this.noEditContextmenu) {
      //     menus.push(modifyOpt)
      //   }

      //   if (['0', '6', '7'].includes(data.status) && this.offlineFetch) {
      //     menus.push(offlineOpt)
      //   }
      //   menus.push(deleteOpt)
      // }

      return menus
    },
    modifyFile(data, node) {},
    removeFile(data, node) {
      this.$confirm('请确认是否删除此文件吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(this.delFetch({[this.paramsKey]: data.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    openObjectTable(type) {
      const key = 'standard'
      this.$store.commit(`${key}/SET_ACTIVE`, types[type])
      this.tabStore.commit('add', {
        label: `标准查询列表`,
        tabType: types.OBJECTTABLE,
        name: `${key}_${types.OBJECTTABLE}`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    filterNode(value, data) {
      if (!value) return true
      // 忽略大小写
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      // return data.label.indexOf(value) !== -1
    }
  }
}

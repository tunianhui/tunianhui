// import Contextmenu from '@/components/contextmenu'
import NodePopper from '@/components/node-popper'
import { getTreeData } from '@/api/rd/dev'
import { hasClass, getData } from '@/libs/dom'
import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import { treeTypes, types, iconMap } from '@/config/rd-config'
import { mapGetters, mapMutations } from 'vuex'
// import clipboard from '@/libs/clipboard'
import { capitalize, loop } from '@/libs/util'
import OverflowTooltip from '@c/overflow-tooltip'

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

const trialRunOpt = {
  class: '',
  icon: 'iconfont icon-run-log',
  label: '试跑',
  command: 'trialRun'
}

export default {
  components: {
    // Contextmenu,
    NodePopper
  },
  inject: ['tabStore', 'attrStore'],
  data() {
    return {
      keywords: '',
      loading: 0,
      treeData: [],
      nodeKey: 'id',
      curNodeKey: '',
      curNode: {},
      curNodeData: {},
      expandedKeys: [],
      currentChange: [],
      contextmenus: [],
      getTreeDataFetch: getTreeData,
      removeDirFetch: loop,
      removeFileFetch: loop,
      offlineFetch: null,
      // removeFileFetchParamKey: 'id',
      icons: {
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: this.$route.meta && this.$route.meta.icon
      },
      briefMap: {},
      // fileMenuNoOffline: [modifyOpt, deleteOpt],
      // fileMenuWithOffline: [modifyOpt, offlineOpt, deleteOpt],
      visibleFileBrief: false,
      fileBrief: `null`,
      fileNode: null,
      popperNode: null,
      types,
      behaviorBoard: {
        icon: iconMap[types.BEHAVIORBOARD].icon,
        label: '行为看板'
      }
    }
  },
  computed: {
    ...mapGetters(['project', 'activeTreeId']),
    objectTableType() {
      const key = this.getObjectTableKey()
      return this.$store.getters[`${key}/active`]
    }
  },
  watch: {
    keywords(val) {
      this.$debounce(_ => {
        this.$refs.tree.filter(val)
      }, 200)()
    },
    project: {
      immediate: true,
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.getTreeData()
        }
      }
    },
    activeTreeId(id) {
      if (id) {
        this.changeTreeState(id)
        this.setActiveTreeId('')
      }
    }
  },
  created() {
    // 新建/修改刷新树 在组件中调用 this.$root.eventEmitter.emit('refresh')
    this.$root.eventEmitter.on('refresh', type => {
      // new Set([
      //   type,
      //   (this.tabStore.states.active || {}).tabType,
      //   this.objectTableType
      // ]).has(this.$route.name) && this.getTreeData()
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
  // 路由跳转时beforeDestroy 在 created事件之后调用 ？？
  // beforeDestroy() {
  //   // console.log('beforeDestroy')
  //   this.$root.eventEmitter.off('refresh')
  //   this.$root.eventEmitter.off('remove')
  // },
  methods: {
    ...mapMutations({
      setActiveTreeId: 'SET_ACTIVE_TREE_ID',
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    getObjectTableKey() {
      const path = this.$route.path

      let key = ''
      if (path.indexOf('dev') > -1) {
        key = 'dev'
      } else if (path.indexOf('exreact') > -1) {
        key = 'exreact'
      } else if (path.indexOf('workbench') > -1) {
        key = 'exreact'
      }
      return key
    },
    openObjectTable(type) {
      const key = this.getObjectTableKey()
      this.$store.commit(`${key}/SET_ACTIVE`, types[type])
      // console.log(types, types.OBJECTTABLE, types, types[type])
      this.tabStore.commit('add', {
        label: `${key === 'exreact' ? '萃取' : ''}对象页表页`,
        tabType: types.OBJECTTABLE,
        name: `${key}_${types.OBJECTTABLE}`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    goBehaviorBoard() {
      this.tabStore.commit('add', {
        label: this.behaviorBoard.label,
        tabType: types.BEHAVIORBOARD,
        name: types.BEHAVIORBOARD,
        component: capitalize(types.BEHAVIORBOARD),
        data: {}
      })
    },
    changeTreeState(id) {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
        this.curNodeKey = id
        this.expandedKeys = [id]
        // id !== this.expandedKeys[0] && (this.expandedKeys = [id])
      })
    },
    async getTreeData() {
      this.loading++
      const {
        business_field_name,
        business_field_id,
        project_name,
        project_id
      } = this.project
      const res = await this.$simpleAsyncTo(
        this.getTreeDataFetch({
          // ...this.project,
          business_field_name,
          business_field_id,
          project_name,
          project_id,
          type: treeTypes[this.tree_params_type || this.$route.name]
        }),
        '获取列表失败'
      )
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
        const { id, name, code, type, parentId, children, total } = item
        const treeItem = {
          label: children ? name : code,
          type,
          parentId: parentId + '',
          total,
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
    nodeClick(data, node) {
      // this.$refs.treeContextmenu.hide()
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
      this.fileBrief = this.briefMap[id]
      this.popperNode = fileNode.parentNode
    },
    nodeMouseout(event) {
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
    getContextmenu(data) {
      const menus = []
      if (data.type === FILE_TYPE) {
        if (!this.noEditContextmenu) {
          menus.push(modifyOpt)
        }

        if (['0', '6', '7'].includes(data.status) && this.offlineFetch) {
          menus.push(offlineOpt)
        }
        if (types.FACTTABLE === this.FACTTABLE) {
          if (['6', '7'].includes(data.status)) {
            menus.push(trialRunOpt)
          }
        }
        if (types.DIMENSIONTABLE === this.DIMENSIONTABLE) {
          if (['6', '7'].includes(data.status)) {
            menus.push(trialRunOpt)
          }
        }
        menus.push(deleteOpt)
      }

      return menus
    },
    contextmenuHandle({ command, data, node }) {
      this[command](data, node)
    },
    createDir(data, node) {
      console.log('createDir')
    },
    createFile(data, node) {
      console.log('createFile')
    },
    modifyFile(data, node) {
      console.log('modifyFile')
    },
    getRemoveFileParams(data) { },
    getRemoveDirParams(data) { },
    getOfflineParams(data) { },
    removeFile(data, node) {
      console.log(data, node)
      this.$confirm(`请确认是否删除【${data.label}】文件？`, '删除', {
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
    },
    removeDir(data, node) {
      this.$confirm(`请确认是否删除此【${data.label}】目录？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading++
        const res = await this.$simpleAsyncTo(
          this.removeDirFetch({ id: data.id }),
          '删除目录失败'
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '删除目录成功',
            type: 'success'
          })
          this.$refs.tree.remove(node, data)
          const ids = this.getIds(node, [])
          ids.forEach(id => {
            this.tabStore && this.tabStore.commit('remove', id)
          })
        }
        this.loading--
      })
    },
    // 下线
    offline(data, node) {
      this.$confirm('请确认是否下线？', '下线', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(
            this.offlineFetch({ id: data.id }),
            '下线失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '下线成功！'
            })
            this.getTreeData()
          }
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消下线！'
          })
        })
    },
    getIds(node, ids) {
      if (node.childNodes) {
        node.childNodes.forEach(child => {
          const { type, id } = child.data
          if (type === FILE_TYPE) {
            ids.push(id)
          } else {
            this.getIds(child, ids)
          }
        })
      }
      return ids
    },
    filterNode(value, data) {
      if (!value) return true
      // 忽略大小写
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      // return data.label.indexOf(value) !== -1
    }
  }
}


import NodePopper from '@/components/node-popper'
import { hasClass, getData } from '@/libs/dom'
import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import { types, iconMap } from '@/config/server-config'
import { mapGetters, mapMutations } from 'vuex'
import { capitalize, loop } from '@/libs/util'
import OverflowTooltip from '@c/overflow-tooltip'
// import { getTreeData } from '@/api/server/server'
// 修改
const modifyOpt = {
  class: '',
  icon: 'el-icon-edit-outline',
  label: '编辑',
  command: 'modifyFile'
}
// 删除
const deleteOpt = {
  class: '',
  icon: 'el-icon-document-remove',
  label: '删除',
  command: 'removeFile'
}
// 测试
const testOpt = {
  class: '',
  icon: 'iconfont icon-ceshi',
  label: '测试',
  command: 'test'
}
// 上线
const onlineOpt = {
  class: '',
  icon: 'iconfont icon-shangxian1',
  label: '上线',
  command: 'online'
}
// 下线
const offlineOpt = {
  class: '',
  icon: 'iconfont icon-xiaxian2',
  label: '下线',
  command: 'offline'
}
export default {
  inject: ['tabStore', 'attrStore'],
  components: {
    NodePopper
  },
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
      getTreeDataFetch: loop,
      removeDirFetch: loop,
      removeFileFetch: loop,
      editFile: loop,
      offlineFetch: null,
      icons: {
        [DIR_TYPE]: 'el-icon-folder', // 0
        [FILE_TYPE]: this.$route.meta && this.$route.meta.icon // 1
      },
      briefMap: {},
      visibleFileBrief: false,
      fileBrief: `null`,
      fileNode: null,
      popperNode: null,
      types
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
      setActiveTreeId: 'SET_ACTIVE_TREE_ID',
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),

    // 数据结构 ---> 参考 standard
    async getTreeData () {
      this.loading++
      const {
        project_id
      } = this.project
      // type 生成  注册  函数  编排
      const res = await this.$simpleAsyncTo(
        this.getTreeDataFetch({
          project_id,
          type: this.type // 业务流程 单独
        }),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData)
      }
      this.loading--
    },

    recursionTreeData(source, target) {
      source.forEach(item => {
        const { id, name, type, parentId, child } = item
        const treeItem = {
          label: name,
          type,
          parentId,
          icon: this.icons[type],
          ...item,
          id: id
        }
        this.briefMap[id] = item
        if (child && child.length) {
          treeItem.children = []
          this.recursionTreeData(child, treeItem.children)
        }
        target.push(treeItem)
      })
    },

    // recursionTreeData(source, target) {
    //   source.forEach(item => {
    //     const { id, name, code, type, parentId, children, total } = item
    //     const treeItem = {
    //       label: children ? name : code,
    //       type,
    //       parentId: parentId + '',
    //       total,
    //       icon: this.icons[type],
    //       ...item,
    //       id: id + ''
    //     }
    //     this.briefMap[id] = item
    //     if (children && children.length) {
    //       treeItem.children = []
    //       this.recursionTreeData(children, treeItem.children)
    //     }
    //     target.push(treeItem)
    //   })
    // },

    changeTreeState(id) {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
        this.curNodeKey = id
        this.expandedKeys = [id]
        // id !== this.expandedKeys[0] && (this.expandedKeys = [id])
      })
    },
    renderContent(h, { node, data, store }) {
      const { type, icon, total = 0, label, id } = data
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
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
      // 0
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
    nodeClick (data, node) {
      data.type = 1
      if (data.type === FILE_TYPE) {
        const attr = {
          title: this.$route.meta.name,
          attrType: this.$route.name, // this.$route.name
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
    getContextmenu (data) {
      const menus = []
      data.type = 1
      if (data.type === FILE_TYPE) {
        menus.push(modifyOpt)
        menus.push(testOpt)
        menus.push(onlineOpt)
        menus.push(offlineOpt)
        menus.push(deleteOpt)
      }
      return menus
    },
    contextmenuHandle({ command, data, node }) {
      this[command](data, node)
    },
    modifyFile (data, node) {
      const { id } = data
      console.log('modifyFile')
      this.editFile({ id }) // data
    },
    removeFile(data, node) {
      this.$confirm('请确认是否删除吗？', '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { id } = data
          this.loading++
          const res = await this.removeFileFetch({ id })
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
    // 测试
    test (data, node) {
      this.$message({
        type: 'success',
        message: '测试测试！'
      })
    },
    // 上线
    online (data, node) {
      this.$confirm('请确认是否上线？', '上线', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(
            this.offlineFetch({ id: data.id }),
            '上线失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '上线成功！'
            })
            this.getTreeData()
          }
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消上线！'
          })
        })
    },
    // 下线
    offline (data, node) {
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
    openObjectTable (type) {
      const key = 'server'
      this.$store.commit(`${key}/SET_ACTIVE`, types[type])
      console.log(types, types.OBJECTTABLE, types[type])
      this.tabStore.commit('add', {
        label: `查询列表`,
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

import {DIR_TYPE, FILE_TYPE} from '@/config/dics'
import NodePopper from '@/components/node-popper'
import {hasClass, getData} from '@/libs/dom'
import OverflowTooltip from '@c/overflow-tooltip'
import {mapGetters, mapMutations} from 'vuex'
import Contextmenu from '@/components/contextmenu'

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
  copyOpt = {
    class: '',
    icon: 'el-icon-copy-document',
    label: '克隆',
    command: 'clone'
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
    command: 'edit'
  },
  addFolder = {
    class: '',
    icon: 'el-icon-folder',
    label: '新建文件夹',
    command: 'createFolder'
  },
  addTask = {
    class: '',
    icon: 'el-icon-document-add',
    label: '新建任务',
    command: 'createTask'
  }
export default {
  components: {
    Contextmenu,
    NodePopper
  },
  inject: ['attrStore', 'tabStore'],
  computed: {
    ...mapGetters(['project', 'activeTreeId'])
  },
  data() {
    return {
      nodeKey: 'id',
      treeData: [],
      curNodeKey: '',
      expandedKeys: [],
      contextmenus: [],
      curNodeData: {},
      currentChange: [],
      curNode: {},
      keywords: '',
      loading: 0,
      icons: {
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: this.$route.meta && this.$route.meta.icon
      },
      visibleFileBrief: false,
      popperNode: null,
      fileBrief: {},
      briefMap: {},
      funcType: {
        sysOther: '其他函数',
        sysString: '字符串函数',
        sysMath: '数学函数',
        sysDate: '日期函数',
        sysWindow: '窗口函数',
        sysAggregation: '聚合函数'
      }
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
    }
  },
  created() {
    this.$root.eventEmitter.on('refresh', _ => {
      this.getTreeData()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$root.eventEmitter.off('refresh')
    next()
  },
  methods: {
    ...mapMutations({
      setActiveTreeId: 'SET_ACTIVE_TREE_ID',
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getTreeData () {
      this.loading++
      const { project_id } = this.project
      const res = await this.$simpleAsyncTo(
        this.getTreeDataFetch({
          project_id,
          folder_type: this.folder_type
        }),
        '获取列表失败'
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
    changeTreeState(id) {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
        this.curNodeKey = id
        this.expandedKeys = [id]
        // id !== this.expandedKeys[0] && (this.expandedKeys = [id])
      })
    },

    recursionTreeData(source, target) {
      source.forEach(item => {
        const {id, name, node_type, child, parent_id} = item
        const treeItem = {
          label: name,
          node_type,
          icon: this.icons[node_type + ''],
          ...item,
          id: id + '',
          parent_id,
          total: child && child.length
        }
        this.briefMap[id] = item
        if (child && child.length) {
          treeItem.child = []
          this.recursionTreeData(child, treeItem.child)
        }
        target.push(treeItem)
      })
    },

    renderContent(h, {node, data, store}) {
      const { node_type, icon, label, id, total } = data
      const contextmenus = this.getContextmenu(data)
      let iconClass,
        wrapperClass,
        _total = '',
        style = '',
        controls = contextmenus.length ? (
          <span class="node-controls">
            <i
              class="icon el-icon-copy-document"
              v-clipboard={{value: data.label}}
              onClick={e => e.stopPropagation()}
            />
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
                      class={{'is-disabled': item.disabled}}
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
        ) : (
          ''
        )
      if (node_type === DIR_TYPE + '') {
        iconClass = `${icon} icon dir`
        _total = `(${total || 0})`
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

    filterNode(value, data) {
      if (!value) return true
      // 忽略大小写
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      // return data.label.indexOf(value) !== -1
    },

    getContextmenu(data) {
      const menus = []
      // 文件夹
      if (data.node_type === '0') {
        menus.push(deleteOpt)
        menus.push(moveOpt)
        menus.push(copyOpt)
        menus.push(renameOpt)
      }
      // 文件(节点) ----> 具体的组件 ------> 一个集成任务
      if (data.node_type === '1') {
        menus.push(deleteOpt)
        menus.push(moveOpt)
        menus.push(copyOpt)
        menus.push(renameOpt)
      }
      // 业务流程
      if (data.node_type === '2') {
        menus.push(modifyOpt)
        menus.push(deleteOpt)
        menus.push(copyOpt)
        menus.push(renameOpt)
        // menus.push(addFolder)
      }
      // 任务类型  新建业务流程生成  ----> 数据集成、通用、数据库、数据处理、机器学习
      if (data.node_type === '3') {
        menus.push(addTask)
      }
      return menus
    },

    contextmenuHandle({command, data, node}) {
      this[command](data, node)
    },

    nodeMouseover(event) {
      const fileNode = this.findFileNode(event)
      this.fileNode = fileNode
      if (!fileNode) return
      const id = getData(fileNode, 'id')
      this.fileBrief = this.briefMap[id]
      this.popperNode = fileNode.parentNode
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

    nodeMouseout(event) {
      this.popperNode = null
    },

    addAttr(arr, attr) {
      arr.forEach(e => {
        let children = e.children
        e.funcType = attr
        if (e.children && e.children.length) {
          this.addAttr(children, attr)
        }
      })
    },

    moveFolder(data, node) {

    },

    rename(data, node) {

    },

    // 克隆 克隆一个已存在的任务，在此基础上修改任务的配置，提高配置的效率
    clone (data, node) {

    },

    removeFile (data, node) {
      this.$confirm(`本操作将同步下线生产环境中的任务，该任务已生成实例的调度类型都会被置为空跑，确认是否删除【${data.label}】？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { id, node_type } = data
          // 删除业务流程
          if (node_type === '2') {
            const params = {
              id,
              projectId: this.project.project_id
            }
            const res = await this.$simpleAsyncTo(
              this.deleteFlow(params),
              '删除失败'
            )
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 刷新列表
              this.getTreeData()
            }
          }

          // 删除节点
          if (node_type === '1') {
            const params = {
              id, // 节点id
              flowId: '', // 所属业务流程id
              projectId: this.project.project_id
            }
            // 查询一个id就行
            const res = await this.$simpleAsyncTo(
              this.deleteTask(params),
              '删除失败'
            )
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 刷新列表
              this.getTreeData()
            }
          }

          // 删除业文件夹
          if (node_type === '0') {
            const res = await this.$simpleAsyncTo(
              this.deleteFetch({id, node_type}),
              '删除失败'
            )
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 刷新列表
              this.getTreeData()
            }
          }
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

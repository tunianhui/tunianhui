import { mapGetters, mapMutations } from 'vuex'
import { treeTypes, types, iconMap } from '@/config/rd-config'
import { DIR_TYPE, FILE_TYPE } from '@/config/dics'
import { capitalize, loop } from '@/libs/util'
import {getTreeData as _getTreeData} from './data'
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
export default {
  inject: ['tabStore', 'attrStore'],
  computed: {
    ...mapGetters(['project', 'activeTreeId']),
  },
  data() {
    return {
      loading: 0,
      nodeKey: 'id',
      treeData: [],
      curNodeKey: '',
      expandedKeys: [],
      currentChange: [],
      keywords: '',
      icons: {
        [DIR_TYPE]: 'el-icon-folder',
        [FILE_TYPE]: this.$route.meta && this.$route.meta.icon
      },
      briefMap: {},
      types
    }
  },
  watch: {
    project: {
      immediate: true,
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.getTreeData()
        }
      }
    }
  },
  mounted() {
    this.$root.eventEmitter.on('refresh', type => {
      this.getTreeData()
    })
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('refresh')
    next()
  },
  methods: {
    ...mapMutations({
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
      this.tabStore.commit('add', {
        label: `${key === 'exreact' ? '萃取' : ''}对象页表页`,
        tabType: types.OBJECTTABLE,
        name: `${key}_${types.OBJECTTABLE}`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    async getTreeData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        this.listTreeAllFn(),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data, this.treeData)
        if (this.treeData.length > 0) {
          // const id = this.activeTreeId || this.treeData[0].id
          // this.changeTreeState(id)
          // this.setActiveTreeId('')
        }
      }
      this.loading--
    },
    recursionTreeData(source, target) {},
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
            <OverflowTooltip>
              <span class="node-name">
                {label}
                {_total}{' '}
              </span>
            </OverflowTooltip>
          </span>
          {controls}
        </span>
      )
    },
    getContextmenu(data) {
      const menus = []
      if (data.type === FILE_TYPE) {
        menus.push(modifyOpt, deleteOpt)
      }

      return menus
    },
    nodeClick(data, node) {},
    nodeMouseover(event) {},
    nodeMouseout(event) {},
    modifyFile(data, node) {
      console.log('modifyFile')
    },
    removeFile(data, node) {
      this.$confirm(`请确认是否删除【${data.label}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(this.deleteFn({id: data.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getTreeData()
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
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
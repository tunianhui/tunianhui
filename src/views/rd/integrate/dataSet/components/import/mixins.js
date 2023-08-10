/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-08-07 11:47:19
 * @Description:
 */
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
import { getDatasourceList, getdstablelist, getdstablefieldlist, getdsparam, getdictitemlist } from '@/api/rd/data-collection'
export default {
  props: {
    id: String,
    nodeData: Object,
    nodes: Array,
    edges: Array
  },
  data () {
    return {
      form: {
        // nodeType: 'reader' // 输入组件
      },
      keyword: '',
      dataSourceList: [],
      dataSourceTableList: [],
      schemaList: [],
      splitList: [],
      // 是否显示字段管理
      dialogVisible: false,
      // 选择的字段 绑定值
      fieldData: [],
      fieldList: [],
      andOrNotList: [],
      leftParentheseList: [],
      columList: [],
      operatorList: [],
      rightParentheseList: [],
      // 输入过滤  配置模式&脚本模式 回显
      filterType: true, // true 脚本
      partitionKeyList: []
    }
  },
  created () {},
  mounted() {},
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        this.configData()
        if (Object.keys(val).length > 1) {
          this.form = val
          this.getSchemaData()
          this.filterType = !!this.form.filterWhere
        } else {
          // 初始化
          this.configForm()
          this.form.name = val.name
          this.filterType = true
          this.dataSourceTableList = []
          this.splitList = []
          this.columList = []
          this.fieldList = []
          this.getDataSource()
          this.getSchemaData()
          this.$refs.form && this.$refs.form.resetFields()
        }
      }
    },

    'project.skd_prj_id': {
      handler (val) {

      },
      immediate: true
    },
    'form.dataSourceId': {
      immediate: true,
      handler (val) {
        if (val) {
          const data = this.dataSourceList.find(ele => ele.dataSourceId === val)
          if (data) {
            this.form.database = data.database
          }
        }
        // 编辑状态 少量执行 ---> 只执行一次最好
        this.getDataSource()
      }
    },
    'form.column': {
      immediate: true,
      handler (val) {
        this.fieldData = val.map(item => item.name)
        if (this.fieldList && this.fieldList.length) {
          let arr = []
          this.fieldData.forEach(name => {
            let obj = this.fieldList.find(ele => ele.fieldName === name)
            this.fieldList = this.fieldList.filter(ele => ele.fieldName !== name)
            arr.push(obj)
          })
          this.fieldList = [...this.fieldList, ...arr]
        }
      }
    },
    'form.schemaId': {
      handler (val) {
        if (val) {
          this.getSchemafield(val)
        }
      }
    },
    'form.tableId': {
      immediate: true,
      handler (val) {
        if (val) {
          const data = this.dataSourceTableList.find(ele => ele.tableId === val)
          if (data) {
            this.form.tableAlias = data.tableName
            this.form.table = this.form.tableNum ? [data.tableName] : data.tableName
          }
        }
      }
    },
    'form.index': {
      immediate: true,
      handler (val) {
        if (val) {
          const data = this.documentList.find(ele => ele.indexId === val)
          if (data) {
            this.form.tableAlias = data.indexName
          }
        }
      }
    }
  },
  methods: {
    configForm () {
      this.form = {}
    },

    configData() {},

    searchChange () {

    },

    dragSort () {
      const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: e => {
          // onEnd是结束拖拽时触发，onUpdate是列表内元素顺序更新的时候触发
          // e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
          const targetRow = this.form.column.splice(e.oldIndex, 1)[0]
          this.form.column.splice(e.newIndex, 0, targetRow)
        }
      })
    },

    filterArray (arr, filterList) {
      const names = filterList.map(item => item.name)
      return arr.filter(item => !names.includes(item.name))
    },

    // 选择数据源 更新表
    dataSourceChange (val) {
      this.form.tableId = ''
      this.form.table = ''
      this.form.column = []
      this.getdstable()
    },

    tableChange () {
      this.form.splitPk = ''
      this.form.column = []
      this.getdstablefield()
    },

    getSchemaData() {},

    // 数据源表列表
    async getdstable () {
      const { dataSourceId } = this.form
      const dataSource = this.dataSourceList.find(ele => ele.dataSourceId === dataSourceId)
      const { database } = dataSource
      const res = await getdstablelist({ dataSourceId, database })
      if (res) {
        this.dataSourceTableList = res.data.table
        if (this.form.tableId) {
          // 编辑回显
          await this.getdstablefield()
          if (this.fieldList && this.fieldList.length) {
            let arr = []
            this.fieldData.forEach(name => {
              let obj = this.fieldList.find(ele => ele.fieldName === name)
              this.fieldList = this.fieldList.filter(ele => ele.fieldName !== name)
              arr.push(obj)
            })
            this.fieldList = [...this.fieldList, ...arr]
          }
        }
      }
    },

    // 数据源表字段列表
    async getdstablefield () {
      const { dataSourceId, tableId } = this.form
      const dataSource = this.dataSourceList.find(ele => ele.dataSourceId === dataSourceId)
      const table = this.dataSourceTableList.find(ele => ele.tableId === tableId)
      const { database } = dataSource
      const { tableName } = table
      const res = await getdstablefieldlist({ dataSourceId, database, tableId, tableName })
      if (res) {
        const { field } = res.data
        this.partitionKeyList = field.filter(ele => ele.partitionKey)
        this.splitList = field.map(ele => ele.fieldName)
        this.columList = JSON.parse(JSON.stringify(field))
        this.fieldList = JSON.parse(JSON.stringify(field))
        if (!this.form.column.length) {
          // ----> 回显
          this.form.column = field.map(item => {
            return { name: item.fieldName, type: item.dataType }
          })
        }
      }
    },

    // ---------------- 事件 ----------------------
    // 字段管理
    manageField () {
      this.dialogVisible = true
    },

    // 选择输入过滤模式
    selectFilterType () {
      this.filterType = !this.filterType
    },

    addConfig () {
      const data = { andOrNot: '', leftParenthese: '', columnName: '', operator: '', columnValue: '', rightParenthese: '', key: Date.now() }
      this.form.filterCriterion.push(data)
    },

    handleDelConfig (item, index) {
      this.form.filterCriterion.splice(index, 1)
    },

    // 删除输出字段
    handdleDel (item, index) {
      this.form.column.splice(index, 1)
    },

    // 批量管理输出字段
    handdleSure () {
      this.form.column = this.fieldData.map(ele1 => {
        const item = this.fieldList.find(ele2 => ele2.fieldName === ele1)
        return { name: item.fieldName, type: item.dataType }
      })
      this.dialogVisible = false
    }
  }
}

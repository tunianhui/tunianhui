/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-08-08 14:06:31
 * @Description:
 */
import {mapGetters} from 'vuex'
export default {
  props: {
    id: String,
    nodeData: Object,
    nodes: Array,
    edges: Array
  },
  data() {
    return {
      form: {},
      keyword: '',
      keyword1: '',
      keyword2: '',
      dataSourceList: [],
      dataSourceTableList: [],
      documentList: [],
      documentTypeList: [],
      // 是否显示字段管理
      dialogVisible: false,
      // 选择的字段
      fieldData: [],
      writeModeList: [],
      fieldList: []
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
          this.form = val // 编辑
          this.getSchemaData()
        } else {
          this.dataSourceList = []
          this.dataSourceTableList = []
          this.fieldList = []
          this.getDataSource()
          this.getSchemaData()
          this.configForm()
          this.form.name = val.name
          this.$refs.form && this.$refs.form.resetFields()
          if (val.inputColumn) {
            this.form.inputColumn = val.inputColumn
          }
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
        this.getDataSource()
      }
    },
    'form.tableId': {
      immediate: true,
      handler (val) {
        if (val) {
          const data = this.dataSourceTableList.find(ele => ele.tableId === val)
          if (data) {
            this.form.tableAlias = data.tableName
            this.form.table = data.tableName
          }
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
    'form.outputColumn': {
      immediate: true,
      handler (val) {
        this.fieldData = val.map(item => item.name)
        this.updateMappingColumn()
      }
    },
    'form.mappingMethod': {
      immediate: true,
      handler (val) {
        this.updateMappingColumn()
      }
    }
  },
  methods: {
    configForm () {
      this.form = {}
    },

    // ---------------- 事件 ----------------------
    // 字段管理
    manageField () {
      this.dialogVisible = true
    },

    searchChange () {

    },

    getSchemaData() {},

    getDataSource () {},

    // 同行映射是输出第一行对应输入第一行字段，输出第二行对应输入第而行字段。同名映射是输出id对应输入id字段，输出name字段对应输入name字段
    // 同名映射，以输出字段的顺序为准，对应输入字段的同名的字段，有就对应，没有就不对应显示。
    // 同行映射，以输出字段的顺序为准，按照行号对应输入字段名称。
    // 同名映射 && 同行映射
    updateMappingColumn () {
      if (this.form.mappingMethod === 'samename') {
        const mappingColumn = this.form.outputColumn.map(item => {
          const data = this.form.inputColumn.find(ele => ele.name === item.name)
          return data ? { inputName: item.name, outputName: item.name } : { inputName: '', outputName: '' }
        })
        this.form.mappingColumn = mappingColumn.filter(ele => ele.inputName)
      } else {
        const mappingColumn = this.form.outputColumn.map((item, index) => {
          if (index < this.form.inputColumn.length) {
            const data = this.form.inputColumn[index]
            return { inputName: item.name, outputName: data.name }
          } else {
            return { inputName: '', outputName: '' }
          }
        })
        this.form.mappingColumn = mappingColumn.filter(ele => ele.inputName)
      }
    },

    handdleDel (item, index) {
      this.form.outputColumn.splice(index, 1)
    },

    handdleSure () {
      this.form.outputColumn = this.fieldData.map(ele1 => {
        const item = this.fieldList.find(ele2 => ele2.name === ele1)
        return { name: item.name, type: item.type }
      })
      this.dialogVisible = false
    }

  }
}

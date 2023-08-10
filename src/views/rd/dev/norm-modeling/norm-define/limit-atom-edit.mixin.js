import {mapGetters, mapMutations} from 'vuex'
import {getMetaFactLogicBasesCode} from '@/api/rd/dev'
import MiniFlow from '@c/graph/er/mini-flow'
import SimplePanel from '@c/graph/er/simple-panel'
import {on, off} from '@/libs/dom'
import {
  types,
  factLogicRelationTypesMap,
  logicPkTypes,
  logicSystemTypes
} from '@/config/rd-config'
import {loop} from '@/libs/util'
import {getRelationDatas} from '../flow-data.js'
import {getSourceTableModelInfo} from '@/api/rd/limit'
import '@/assets/css/limit-atom-edit.scss'

export default {
  components: {
    MiniFlow,
    SimplePanel
  },
  inject: ['tabStore'],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editForm: {
        id: undefined,
        business_field_name: '',
        space_type_name: '',
        data_field_id: '',
        data_field_name: '',
        project_name: '',
        fact_logic_base_id: ''
      },
      editFormRules: {
        data_field_id: [{required: true, message: '请选择数据域'}],
        fact_logic_base_id: [{required: true, message: '请选择来源表'}]
      },
      sourceTableList: [],
      loading: 0,
      tableLoading: true,
      tabList: [
        {label: '全局', type: 'whole'},
        {label: '模型相关', type: 'modal'}
      ],
      activeTab: 'whole',
      wholeData: [],
      modalData: [],
      visibleEdit: false,
      // activeRow: {},
      flowData: {},
      activeModal: {
        type: 'whole',
        list: []
      },
      activeField: {},
      height: 300,
      delFetch: loop,
      offlineFetch: loop
    }
  },
  computed: {
    ...mapGetters(['project']),
    tableData() {
      return this.activeTab === 'whole' ? this.wholeData : this.modalData
    }
  },
  watch: {},
  created() {
    this.handleInit()
  },
  mounted() {
    this.setHeight()
    on(window, 'resize', this.setHeight)
  },
  beforeDestroy() {
    off(window, 'resize', this.setHeight)
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    handleInit() {
      Object.assign(this.editForm, this.project, this.data)
      if (!this.editForm.data_field_id) {
        this.editForm.data_field_id = this.metadata[0].data_field_id
      }
      this.getSourceTableList()
      if (this.editForm.fact_logic_base_id) {
        this.getData()
      }
    },
    setHeight() {
      const refs = this.$refs
      this.height =
        refs.container.clientHeight -
        refs.title.clientHeight -
        refs.editForm.$el.clientHeight -
        107
    },
    tabClick(tab) {
      this.activeTab = tab.type
      this.activeField = {}
      if (tab.type === 'modal') {
        if (!this.activeModal.list.length && !this.lastActiveModal) {
          Object.assign(this.activeModal, this.flowData, {type: 'fact'})
          this.getModalData()
        } else {
          this.activeModal = this.lastActiveModal
        }
      } else {
        this.lastActiveModal = {...this.activeModal}
        this.activeModal = {
          list: [],
          type: 'whole'
        }
      }
    },
    changeDataFieldId() {
      this.getSourceTableList()
      this.wholeData = []
      this.activeTab = 'whole'
      this.activeModal = {
        type: 'whole',
        list: []
      }
      this.activeField = {}
      this.modalData = []
      // this.changeSourceTable()
    },
    changeSourceTable() {
      this.activeTab = 'whole'
      this.activeModal = {
        type: 'whole',
        list: []
      }
      this.activeField = {}
      this.modalData = []
      this.getData()
    },
    changeActiveModal(data) {
      this.activeField = {}
      if (data.type === 'whole') {
        this.activeTab = 'whole'
        this.lastActiveModal = {...this.activeModal}
        this.activeModal = {
          list: [],
          type: 'whole'
        }
      } else {
        this.activeTab = 'modal'
        this.activeModal = data
        this.getModalData()
      }
    },
    changeModalTable() {
      this.activeField = {}
      this.getModalData()
    },
    showFieldTable(item) {
      this.activeField = item
      this.getModalData()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading++
        const res = await this.$simpleAsyncTo(
          this.delFetch({
            id: row.id
          })
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        }
        this.loading--
      })
    },
    // 查看同源
    handleSameSource(row) {},
    // 相关派生指标
    handleRelatedDerive(row, params) {
      this.$store.commit(`dev/SET_ACTIVE`, types.DERIVE)
      this.tabStore.commit('add', {
        label: '对象页表页',
        tabType: types.OBJECTTABLE,
        name: `dev_${types.OBJECTTABLE}`, // tab页的标识
        component: `DevObjectTable`,
        data: {
          params
        }
      })
    },
    handleOffLine(row, name) {
      this.$confirm(`是否下线${name}`, '下线', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading++
        const res = await this.$simpleAsyncTo(
          this.offlineFetch({
            id: row.id
          })
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '下线成功',
            type: 'success'
          })
        }
        this.loading--
      })
    },
    getData(refresh) {
      this.activeRow = {}
      if (this.activeTab === 'whole') {
        this.getWholeTableData()
        this.getFlowData()
      } else {
        this.getModalData()
      }
      refresh === true && this.$root.eventEmitter.emit('refresh')
    },
    getWholeTableData() {},
    getModalData() {
      this.activeModal.type === 'fact' ? this.getFactList() : this.getDimList()
    },
    processFlowData(data) {
      const {
          keyData = {},
          attrData = [],
          dsData = {},
          logic_fact_code,
          logic_fact_name,
          business_field_id
        } = data,
        pkHead = {
          head: true,
          group_type: 'primarykey',
          children: []
        },
        systemHead = {
          head: true,
          group_type: 'system',
          children: []
        },
        attrHead = {
          head: true,
          group_type: 'attr',
          children: []
        },
        measureHead = {
          head: true,
          group_type: 'measure',
          children: []
        },
        relationHead = {
          head: true,
          group_type: 'relation',
          children: []
        }
      this.flowData = {
        list: [],
        name: logic_fact_name,
        code: logic_fact_code,
        id: business_field_id
      }
      const pkData = {
        ...logicPkTypes,
        element_id: keyData.pk_id,
        element_code: keyData.pk_code,
        element_name: keyData.pk_name,
        element_type: keyData.pk_type
      }
      pkHead.children.push(pkData)
      this.flowData.list.push(pkData, pkHead)
      attrData.forEach(item => {
        const {relation_type} = item
        const obj = {
          ...item,
          name: item.rel_dim_name,
          code: item.rel_dim_table,
          id: item.rel_dim_id,
          ...factLogicRelationTypesMap[relation_type]
        }
        if (relation_type === '1') {
          attrHead.children.push(obj)
        } else if (relation_type === '2') {
          measureHead.children.push(obj)
        } else if (relation_type === '3') {
          obj.relationDatas = getRelationDatas(item)
          relationHead.children.push(obj)
        }
        this.flowData.list.push(obj)
      })

      this.flowData.list.push(attrHead, measureHead, relationHead)

      const systemData = {
        ...logicSystemTypes,
        element_id: dsData.biz_date_key,
        element_code: dsData.partition_code,
        element_name: dsData.partition_name + '，' + dsData.biz_data_value,
        element_type: dsData.data_type
      }
      systemHead.children.push(systemData)
      this.flowData.list.push(systemData, systemHead)
    },
    async getFlowData() {
      const res = await this.$simpleAsyncTo(
        getSourceTableModelInfo({
          fact_logic_base_id: this.editForm.fact_logic_base_id
        }),
        '获取数据失败'
      )
      if (res) {
        this.processFlowData(res.data)
      }
    },
    async getFactList() {},
    async getDimList() {},
    async getSourceTableList() {
      const {data_field_id} = this.editForm
      if (!data_field_id) return
      this.editForm.data_field_name = this.metadata.find(
        item => item.data_field_id === data_field_id
      ).data_field_name
      this.loading++
      const res = await this.$simpleAsyncTo(
        getMetaFactLogicBasesCode({
          project_id: this.editForm.project_id,
          project_name: this.editForm.project_name,
          data_field_id
        }),
        '获取来源表失败'
      )
      if (res) {
        if (!this.data.fact_logic_base_id) {
          this.editForm.fact_logic_base_id = ''
        }
        this.sourceTableList = res.data
      }

      this.loading--
    }
  }
}

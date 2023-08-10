import TableFlow from '@c/graph/er/index'
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import FilterList from '@c/filter-list'
import NewField from './new-field'
import ListMode from './list-mode'
import ModelRelation from './model-relation'
import FieldForm from './field-form'
import CommonComputeLogic from './common-compute-logic'
import rdEdit from '@/mixins/rd-edit'
import {loop} from '@/libs/util'
import {on, off} from '@/libs/dom'
import {getRelationDatas} from '../flow-data'
import {mapGetters} from 'vuex'

const ScheduleConfig = _ =>
  import(/* webpackChunkName: "ScheduleConfig" */ './schedule-config')
const PhysicalConfig = _ =>
  import(/* webpackChunkName: "PhysicalConfig" */ './physical-config')

export default {
  mixins: [rdEdit],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    TableEditLayout,
    SideModal,
    NewField,
    ModelRelation,
    FilterList,
    FieldForm,
    CommonComputeLogic
  },
  data() {
    return {
      activeMode: 'type',
      icons: ['el-icon-caret-bottom', 'el-icon-caret-top'],
      components: [ListMode, TableFlow],
      component: TableFlow,
      btns: [
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.handleSave,
          disabled: false,
          title: '保存'
        },
        {
          icon: 'icon iconfont icon-fabu',
          handler: this.handleSubmit,
          disabled: false,
          title: '提交'
        },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      tabs: [
        {
          label: '表信息',
          title: '维度逻辑表详情',
          handler: this.tabClick,
          confirm: this.tableConfirm,
          component: null,
          // key: 'dimensionDatas',
          data: {}
        },
        {
          label: '调度配置',
          title: '调度配置',
          handler: this.tabClick,
          confirm: this.opsConfirm,
          component: ScheduleConfig,
          // key: 'ops',
          data: this.data
        },
        {
          label: '物理化配置',
          title: '物理化配置',
          handler: this.tabClick,
          confirm: this.physicalConfirm,
          component: PhysicalConfig,
          // key: 'physical',
          data: {
            cycle_day: 30
          }
        },
        {
          label: '主表编辑',
          handler: this.tabClick,
          icon: 'el-icon-caret-top',
          confirm: loop,
          type: 1
        }
      ],
      relationDialogTitle: '编辑',
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      relationHead: {
        head: true,
        group_type: 'relation',
        element_name: '关联维度',
        visible: true,
        children: []
      },
      attrHead: {
        head: true,
        group_type: 'attr',
        element_name: '属性',
        visible: true,
        children: []
      },
      saveFetch: loop,
      submitFetch: loop,
      scheduleDataFetch: loop,
      scheduleEditFetch: loop,
      physicalDataFetch: loop,
      physicalEditFetch: loop,
      fieldStore: [],
      tableData: [],
      initialData: {},
      relationData: {},
      newFieldData: {},
      newFieldTitle: '',
      visibleAttrDialog: false,
      visibleRelationDialog: false,
      visibleEidtField: false,
      visibleFieldEditor: false,
      activeEditField: {},
      activeEditFieldCode: '',
      // editFieldList: [],
      activeEditFieldValue: '',
      allData: this.data,
      visibleCommonComputeLogic: false,
      fieldEditorHeight: 300,
      readonly: false,
      loading: 0,
      handelType: ''
    }
  },
  computed: {
    ...mapGetters(['project']),
    editFieldList() {
      const disabledData = [],
        data = []
      this.tableData.forEach(item => {
        if (!item.head) {
          item.disabled ? disabledData.push(item) : data.push(item)
        }
      })
      return [...disabledData, ...data]
    },
    relationFieldList() {
      const {elementDatas = []} = this.initialData
      return elementDatas.filter(item =>
        this.fieldStore.every(f => f.element_id !== item.element_id)
      )
    }
  },
  watch: {
    fieldStore: {
      deep: true,
      handler(val) {
        this.processData()
      }
    }
  },
  mounted() {
    this.setFieldEditorHeight()
    on(window, 'resize', this.setFieldEditorHeight)
  },
  beforeDestroy() {
    off(window, 'resize', this.setFieldEditorHeight)
  },
  methods: {
    getRelationDatas,
    setFieldEditorHeight() {
      this.fieldEditorHeight = this.$refs.editFieldDialog && this.$refs.editFieldDialog.dialogBodyHeight - 41
    },
    async tabClick(tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }
      if (tab.type) {
        if (tab.type === 1) {
          this.component = this.components[0]
          tab.icon = this.icons[0]
          tab.type = 2
          this.activeMode = 'type'
        } else {
          this.component = this.components[1]
          tab.icon = this.icons[1]
          tab.type = 1
        }
      } else {
        if (this.sideModelOption.visible) {
          this.sideModelOption.visible = false
          await this.$sleep(200)
        }

        if (tab.title === '调度配置') {
          await this.getScheduleData()
        } else if (tab.title === '物理化配置') {
          await this.getPhysicalData()
        }

        // this.sideModelOption.visible = true
        Object.assign(this.sideModelOption, tab, {visible: true})
      }
    },
    changeMode(name) {
      this.activeMode = name
      this.processData()
    },
    showTableInfo() {
      this.tabClick(this.tabs[0])
    },
    async getData() {},
    initData() {},
    processFieldByType() {},
    processData() {
      if (this.activeMode === 'type') {
        this.processFieldByType()
      } else if (this.activeMode === 'source') {
        const obj = {}

        this.fieldStore.forEach(item => {
          if (!obj[item.cube_code]) {
            obj[item.cube_code] = [
              {
                head: true,
                element_name: item.cube_code,
                visible: true,
                children: [item]
              },
              item
            ]
          } else {
            obj[item.cube_code][0].children.push(item)
            obj[item.cube_code].push(item)
          }
        })
        this.tableData = [
          ...this.primaryGroup,
          ...Object.values(obj).flat(),
          ...this.systemGroup
        ]
      }
    },
    backToGraph() {
      this.component = this.components[1]
      this.tabs[3].icon = this.icons[1]
      this.tabs[3].type = 1
    },
    selectChange(data) {
      if (typeof data === 'boolean') {
        this.fieldStore.forEach(item => (item.checked = data))
      } else {
        this.fieldStore.some(item => {
          if (item.element_id === data.element_id) {
            item.checked = data.checked
            return true
          }
        })
      }
    },
    async remove(params) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        this.deleteFetch(params),
        '删除属性失败'
      )
      if (res) {
        const index = this.fieldStore.findIndex(
          item => item.element_id === params.element_id
        )
        this.fieldStore.splice(index, 1)
      }
      this.loading--
    },
    batchRemove(data) {
      const res = [],
        ids = data.map(item => item.element_id)
      this.fieldStore.forEach(item => {
        !ids.includes(item.element_id) && res.push(item)
      })
      this.fieldStore = res
    },
    create(data) {},
    editRelation(row) {
      this.visibleRelationDialog = true
      this.relationDialogTitle = '编辑模型关系'
      this.relationData = row
      this.handelType = 'edit'
    },
    modifyRelation(data) {
      const index = this.fieldStore.findIndex(
          item => item.element_id === data.element_id
        ),
        relationDatas = this.getRelationDatas(data)

      if (index > -1) {
        const _data = Object.assign({}, this.fieldStore[index], data, {
          relationDatas
        })
        this.fieldStore.splice(index, 1, _data)
      } else {
        this.fieldStore.push({
          // group_type: 'relation',
          // group_name: '关联维度',
          visible: true,
          checked: false,
          checkable: true,
          relationDatas,
          ...data
        })
      }
      this.relationData = {}
    },
    addField(data) {
      const {table, columns} = data
      columns.forEach(item => {
        this.fieldStore.push({
          cube_code: table,
          ...this.newFieldData,
          ...item
        })
      })
    },
    editField(row) {
      this.activeEditFieldValue = row.element_id
      this.activeEditField = row
      this.visibleEidtField = true
    },
    editFieldByEditor(row) {
      this.activeEditFieldValue = row.element_id
      this.activeEditField = row
      this.visibleEidtField = true
      this.visibleFieldEditor = true
      this.activeEditFieldCode = this.decrypt(row.sql_content)
      this.editFieldFactVisible = true
    },
    saveFieldEditorCode(code) {
      this.activeEditField.sql_content = code
    },
    changeFieldItem() {
      if (this.visibleFieldEditor) {
        this.visibleFieldEditor = false
        this.visibleEidtField = false
        this.activeEditField.sql_content = this.activeEditFieldCode
      } else {
        const data = this.$refs.fieldForm.getData()
        if (data) {
          this.visibleEidtField = false
          const index = this.fieldStore.findIndex(
            item => item.element_id === this.activeEditFieldValue
          )
          if (index > -1) {
            this.fieldStore.splice(index, 1, data)
          }
        }
      }
    },
    changeActiveField(data) {
      this.activeEditField = data
      if (this.visibleFieldEditor) {
        this.activeEditFieldCode = this.decrypt(data.sql_content)
      }
    },
    tableConfirm() {
      const data = this.$refs.sideComponent.getData()
      if (data) {
        this.sideModelOption.visible = false
        Object.assign(this.tabs[0].data, data, {modified: true})
      }
    },
    async opsConfirm() {
      const data = this.$refs.sideComponent.getData()
      if (data.job_cycle === '周' || data.job_cycle === '月') {
        if (data.choice_date === '' || data.choice_date === null) {
          return this.$message({
            type: 'warning',
            message: '请选择时间'
          })
        }
      }
      // this.loading++
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        this.scheduleEditFetch(data),
        '保存调度配置失败'
      )
      if (res) {
        this.sideModelOption.visible = false
        // Object.assign(this.tabs[1].data, data, {modified: true})
        this.$message({
          message: '保存调度配置成功',
          type: 'success'
        })
      }
      // this.loading--
      this.globalLoading().close()
    },
    async physicalConfirm() {
      const data = this.$refs.sideComponent.getData()
      // this.loading++
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        this.physicalEditFetch(data),
        '保存物理化配置失败'
      )
      if (res) {
        this.sideModelOption.visible = false
        // Object.assign(this.tabs[2].data, data, {modified: true})
        this.$message({
          message: '保存物理化配置成功',
          type: 'success'
        })
      }
      // this.loading--
      this.globalLoading().close()
    },
    getSaveParams() {},
    getSubmitParams() {},
    // 保存
    async handleSave() {
      // this.loading++
      this.globalLoading('保存')
      const res = await this.$simpleAsyncTo(
        this.saveFetch(this.getSaveParams()),
        '保存失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        this.$root.eventEmitter.emit('refresh')
      }
      // this.loading--
      this.globalLoading().close()
    },
    // 提交
    async handleSubmit() {
      this.$confirm('请确认是否提交？', '提交', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // this.loading++
          this.globalLoading()
          const res = await this.$simpleAsyncTo(
            this.submitFetch(this.getSubmitParams()),
            '提交失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
          // this.loading--
          this.globalLoading().close()
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消提交！'
          })
          // this.loading--
          this.globalLoading().close()
        })
    },
    async getScheduleData() {
      const res = await this.$simpleAsyncTo(
        this.scheduleDataFetch({id: this.data.id}),
        '获取调度数据失败'
      )
      if (res) {
        this.tabs[1].data = res.data
      }
    },
    async getPhysicalData() {
      const res = await this.$simpleAsyncTo(
        this.physicalDataFetch({id: this.data.id}),
        '获取物理化数据失败'
      )
      if (res) {
        this.tabs[2].data = {...res.data, id: this.data.id}
      }
    },
    locationHandle() {}
  }
}

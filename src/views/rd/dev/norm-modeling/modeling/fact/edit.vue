<template>
  <TableEditLayout :tabs="tabs" :buttons="btns" v-loading="!!loading">
    <div class="full">
      <transition name="fadeinright" mode="out-in">
        <component
          :is="component"
          :headerData="headerData"
          :data.sync="tableData"
          :createList="createList"
          :visibleFoot="true"
          :initialData="initialData"
          @changeMode="changeMode"
          @showTableInfo="showTableInfo"
          @refresh="getData"
          @back="backToGraph"
          @create="create"
          @selectChange="selectChange"
          @datapreview="datapreview"
          @editFieldByEditor="editFieldByEditor"
          @editField="editField"
          @editRelation="editRelation"
          @goTableEdit="goTableEdit"
          @remove="handelRemove"
          @batchRemove="batchRemove"
          @showCubeRelMode="showCubeRelMode"
          :isShowCubeMode="true"
        ></component>
      </transition>
    </div>
    <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      :type="sideModelOption.label"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :field-list="editFieldList"
        :data="sideModelOption.data"
      ></component>
    </SideModal>
    <NewFieldFact
      type="fact"
      :visible.sync="visibleAttrDialog"
      :data="initialData"
      :tableData="tableData"
      :title="newFieldTitle"
      parentClass="fact-add-field"
      :factType="factType"
      class="fact-add-field"
    ></NewFieldFact>

    <ModelRelation
      :visible.sync="visibleRelationDialog"
      :title="relationDialogTitle"
      :type="relationDialogType"
      :data="relationData"
      :relationFieldList="tableData"
      @confirm="modifyRelation"
      parentClass="fact-model-relation"
      class="fact-model-relation"
      @close="closeModelRelation"
    ></ModelRelation>
    <!-- <NewFieldFact
      type="fact"
      :visible.sync="visibleAttrDialog"
      :data="initialData"
      :tableData="tableData"
      :title="newFieldTitle"
      parentClass="fact-add-field"
      :factType="factType"
      class="fact-add-field"
    ></NewFieldFact> -->
    <EditFieldFact v-if="editFieldFactVisible" @close="closEditFieldFact" :activeEditField="activeEditField" :data="initialData"></EditFieldFact>
    <SimpleEditDialog
      title="编辑字段"
      :visible.sync="visibleEidtField"
      @confirm="changeFieldItem"
      @close="visibleFieldEditor = false"
      ref="editFieldDialog"
      class="fact-edit-field-dialog"
      parentClass="fact-edit-field-dialog"
    >
      <el-row class="field-edit-row" :gutter="10">
        <el-col :span="6">
          <FilterList
            :data="editFieldList"
            :value.sync="activeEditFieldValue"
            @change="changeActiveField"
          ></FilterList>
        </el-col>
        <el-col :span="18">
          <FieldForm
            ref="fieldForm"
            v-if="!visibleFieldEditor"
            :data="activeEditField"
            type="factnew"
            :source_type="(initialData.info || {}).source_type"
          ></FieldForm>
          <MonacoEditor
            v-else
            :style="{height: `${fieldEditorHeight}px`}"
            has-top-tools
            has-bottom-tools
            show-save-btn
            :code.sync="activeEditFieldCode"
            @save="saveFieldEditorCode"
            @verification="sqlValidate"
          ></MonacoEditor>
        </el-col>
      </el-row>
    </SimpleEditDialog>
    <!-- <CommonComputeLogic
      :visible.sync="visibleCommonComputeLogic"
    ></CommonComputeLogic> -->
    <FactFilter v-if="factFilterVisible" @close="closeFactFilter" :data="initialData"></FactFilter>
    <el-dialog title="来源关系模型" :visible.sync="dialogTableVisible" append-to-body :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
      <Flow
        flag="fact"
        readonly
        :data="list"
        :headerData="headerDataFlow"
        :style="{height: `${dialogBodyHeight + 20}px`}"
      ></Flow>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <PreviewDataTuTu v-if="datapreviewVisible" :previewLoading="previewLoading" @ok="ok" :previewData="previewData"></PreviewDataTuTu>
    <JuHe v-if="juheVisible" @close="closeJuhe" :fact_logic_id="(initialData.info || {}).fact_logic_id"></JuHe>
  </TableEditLayout>
</template>

<script>
import TableInfo from './table-info'
import NewFieldFact from '../new-field-fact'
import ListModeFact from '../list-mode-fact'
import TableFlow from '@c/graph/er/index'
import FactFilter from './filter'
import EditFieldFact from './edit-field-fact.vue'
import dialogHeight from '@/mixins/dialog-height'
import Flow from '@c/graph/er/index'
import PreviewDataTuTu from './preview-data.vue'
import JuHe from './juhe'
import {
  // queryById,
  queryByIdMulti,
  edit,
  submit,
  delElement,
  sqlVerification,
  queryDispatchById,
  dispatchEdit,
  queryNoPhysics,
  physicsEdit,
  factLogicRelDimEdit,
  sourceCubeRelation,
  dataPreview,
  factElementEdit
} from '@/api/rd/fact-table'
import {iconMap, types, factLogicRelationTypesMap} from '@/config/rd-config'
import mixin from '../mixin'
// import ModelRelationFact from './model-relation.vue'
// import data from '../../../../../server/platform-manage/flow-monitor/data'

export default {
  name: 'FactTableEdit',
  mixins: [mixin, dialogHeight],
  inject: ['tabStore'],
  components: {
    NewFieldFact,
    FactFilter,
    EditFieldFact,
    Flow,
    PreviewDataTuTu,
    // ModelRelationFact
    JuHe
  },
  data() {
    const {code, name} = this.data
    return {
      createList: [
        {label: '度量', type: 'measure'},
        {label: '事实属性', type: 'attr'},
        {label: '关联维度', type: 'relation'},
        {label: '聚合', type: 'juhe'},
        {label: '帅选条件', type: 'filter'}
      ],
      relationDialogType: 'fact',
      headerData: {
        title: '事实逻辑表',
        type: types.FACTTABLE,
        visibleSql: true,
        ...iconMap[types.FACTTABLE],
        code,
        name
      },
      saveFetch: edit,
      submitFetch: submit,
      deleteFetch: delElement,
      attrHead: {
        head: true,
        group_type: 'attr',
        element_name: '事实属性',
        visible: true,
        children: []
      },
      measureHead: {
        head: true,
        group_type: 'measure',
        element_name: '度量',
        visible: true,
        children: []
      },
      relationTypeMap: factLogicRelationTypesMap,
      scheduleDataFetch: queryDispatchById,
      scheduleEditFetch: dispatchEdit,
      physicalDataFetch: queryNoPhysics,
      physicalEditFetch: physicsEdit,
      components: [ListModeFact, TableFlow],
      factType: '',
      factFilterVisible: false,
      editFieldFactVisible: false,
      list: [],
      dialogTableVisible: false,
      headerDataFlow: {},
      previewLoading: false,
      previewData: [],
      datapreviewVisible: false,
      btns: [
        // {
        //   icon: 'icon iconfont icon-baocun',
        //   handler: this.handleSave,
        //   disabled: false,
        //   title: '保存'
        // },
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
      juheVisible: false
    }
  },
  created() {
    this.tabs[0].component = TableInfo
    this.tabs[0].title = '事实逻辑表详情'
    this.getData()
  },
  mounted() {
    this.$root.eventEmitter.on(`refreshGetData${this.tabStore.states.active.name}`, () => {
      this.getData()
    })
  },
  methods: {
    async getData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryByIdMulti({fact_logic_id: this.data.id}),
        '查询事实逻辑表信息失败'
      )
      if (res) {
        const data = res.data
        this.initialData = data
        this.initialData.info = {
          ...data.logicFactDatas
          // ...data.logicKeyDatas
        }
        this.readonly = ['0', '6'].includes(data.logicFactDatas.status)
        this.initData()
      }
      this.loading--
    },
    initData() {
      const {
        logicFactDatas = {},
        // logicKeyDatas = {},
        logicAttrMeasureDatas = [],
        logicFactDsDatas = {},
        physical = {},
        // isHasKey = '1',
        partDatas
      } = this.initialData
      this.headerData.list = [
        {label: '业务板块', value: logicFactDatas.business_field_name},
        {label: '所属项目', value: logicFactDatas.project_name},
        {label: '空间类型', value: logicFactDatas.space_type_name},
        {label: '数据域', value: logicFactDatas.data_field_name}
        // {label: '主键', value: logicKeyDatas.pk_name}
      ]
      this.createList = this.createList.filter(d => {
        if (logicFactDatas.source_type === '1') {
          return d.type !== 'filter' && d.type !== 'juhe'
        } else {
          return d
        }
      })
      this.tabs[0].data = {
        ...logicFactDatas,
        ...partDatas
        // ...logicKeyDatas,
        // is_define_key: Number(isHasKey).toString()
      }
      // this.tabs[1].data = this.data
      this.tabs[2].data = physical

      this.primaryGroup = []
      this.systemGroup = []
      // if (logicKeyDatas.pk_name) {
      //   const head = {
      //       head: true,
      //       group_type: 'primarykey',
      //       element_name: '主键',
      //       visible: true,
      //       children: []
      //     },
      //     item = {
      //       element_code: logicKeyDatas.pk_code,
      //       element_name: logicKeyDatas.pk_name,
      //       element_type: logicKeyDatas.pk_type,
      //       disabled: true,
      //       checked: false,
      //       visible: true,
      //       checkable: false,
      //       group_type: 'primarykey',
      //       deleteTip: '系统生成字段不可删除',
      //       editTip: '表信息',
      //       ...logicKeyDatas
      //     }
      //   head.children.push(item)
      //   this.primaryGroup.push(head, item)
      // }
      if (logicFactDsDatas.partition_name) {
        const head = {
            head: true,
            group_type: 'system',
            element_name: '系统',
            visible: true,
            children: []
          },
          item = {
            element_code: logicFactDsDatas.partition_code,
            element_name:
              logicFactDsDatas.partition_name +
              '，' +
              logicFactDsDatas.biz_data_value,
            element_type: logicFactDsDatas.data_type,
            checked: false,
            visible: true,
            checkable: false,
            disabled: true,
            group_type: 'system',
            deleteTip: '系统生成字段不可删除',
            editTip: '系统生成字段不可编辑',
            ...logicFactDsDatas
          }
        head.children.push(item)
        this.systemGroup.push(head, item)
      }
      this.fieldStore = []
      logicAttrMeasureDatas.forEach(item => {
        const itemData = {
          ...this.relationTypeMap[item.relation_type],
          checked: false,
          visible: true,
          checkable: true,
          ...item
        }
        if (item.relation_type === '3') {
          itemData.relationDatas = this.getRelationDatas(item)
        }
        this.fieldStore.push(itemData)
      })
      !this.fieldStore.length && this.processData()
    },
    processFieldByType(item) {
      this.relationGroup = []
      this.attrGroup = []
      this.measureGroup = []
      this.attrHead.children = []
      this.measureHead.children = []
      this.relationHead.children = []
      this.fieldStore.forEach(item => {
        switch (item.relation_type) {
          case '1':
            if (!this.attrGroup.length) {
              this.attrGroup.push(this.attrHead)
            }
            this.attrHead.children.push(item)
            this.attrGroup.push(item)
            break
          case '2':
            if (!this.measureGroup.length) {
              this.measureGroup.push(this.measureHead)
            }
            this.measureHead.children.push(item)
            this.measureGroup.push(item)
            break
          case '3':
            if (!this.relationGroup.length) {
              this.relationGroup.push(this.relationHead)
            }
            this.relationHead.children.push(item)
            this.relationGroup.push(item)
            break
        }
      })
      this.tableData = [
        ...this.primaryGroup,
        ...this.relationGroup,
        ...this.attrGroup,
        ...this.measureGroup,
        ...this.systemGroup
      ]
    },
    create(type) {
      if (type === 'attr') {
        this.visibleAttrDialog = true
        this.newFieldTitle = '新建事实属性'
        // this.newFieldData = {
        //   group_type: 'attr',
        //   group_name: '事实属性',
        //   relation_type: '1',
        //   relation_id: 'no_relation',
        //   checked: false,
        //   visible: true,
        //   checkable: true
        // }
      } else if (type === 'measure') {
        this.visibleAttrDialog = true
        this.newFieldTitle = '新建度量'
        // this.newFieldData = {
        //   group_type: 'measure',
        //   group_name: '度量',
        //   relation_type: '2',
        //   relation_id: 'no_relation',
        //   checked: false,
        //   visible: true,
        //   checkable: true
        // }
      } else if (type === 'relation') {
        this.visibleRelationDialog = true
        this.relationDialogTitle = '新建关联维度'
        this.relationData = {}
        this.handelType = 'add'
      } else if (type === 'juhe') {
        this.juheVisible = true
      } else {
        this.factFilterVisible = true
      }
      this.factType = type
    },
    goTableEdit(row) {
      // this.sideModelOption.visible = true
      Object.assign(this.sideModelOption, this.tabs[0], {visible: true})
    },
    getSaveParams() {
      const logicInfo = this.fieldStore
        .map(item => {
          // return `${item.dim_id}-${item.relation_type}@`
          return item.group_type === 'relation'
            ? `${item.element_id}-${item.rel_dim_id}-${item.relation_type}@`
            : `${item.element_id}-${item.relation_type}@`
        })
        .join('')
      const ops = this.tabs[1].data,
        physical = this.tabs[2].data
      return {
        cube_id: this.initialData.logicFactDatas.cube_id,
        fact_logic_id: this.data.id,
        fields: JSON.stringify(this.fieldStore),
        physical: JSON.stringify(physical),
        ops: JSON.stringify(ops),
        cycle_day: physical.cycle_day,
        logicInfo
      }
    },
    getSubmitParams() {
      return {fact_logic_id: this.data.id}
    },
    handelRemove(row) {
      this.remove({
        id: row.id
      })
    },
    async remove(params) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        this.deleteFetch(params),
        '删除属性失败'
      )
      if (res) {
        // const index = this.fieldStore.findIndex(
        //   item => item.element_id === params.element_id
        // )
        // this.fieldStore.splice(index, 1)
        if (this.initialData.info.status !== '5') {
          this.$root.eventEmitter.emit('refresh')
        }
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getData()
      }
      this.loading--
    },
    async sqlValidate(sql) {
      this.loading++
      this.sqlValidRes = null
      const {cube_code, is_define_key} = this.tabs[0].data
      const res = this.$simpleAsyncTo(
        sqlVerification({
          sql: this.encrypt(sql),
          cube_code: cube_code,
          type: is_define_key,
          project_id: this.project.project_id
        }),
        'SQL校验失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          message: 'SQL校验成功',
          type: 'success'
        })
        this.sqlValidRes = res
      }
      this.loading--
    },
    locationHandle() {
      this.handleLocation(
        this.tabStore.states.activeValue,
        '/rd/dev/modeling/fact-table'
      )
    },
    closeFactFilter() {
      this.factFilterVisible = false
    },
    closEditFieldFact() {
      this.editFieldFactVisible = false
    },
    editFieldByEditor(row) {
      this.editFieldFactVisible = true
      this.activeEditFieldValue = row.element_id
      this.activeEditField = row
    },
    async modifyRelation(data) {
      const params = {
        id: this.handelType === 'edit' ? data.id : data.field[1],
        dim_id: data.relation_type === '3' ? data.info[1] : '',
        attribute_tag: data.relation_type
      }
      const res = await this.$simpleAsyncTo(factLogicRelDimEdit(params), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getData()
      }
    },
    showCubeRelMode() {
      this.dialogTableVisible = true
      this._sourceCubeRelation()
    },
    async _sourceCubeRelation() {
      const res = await this.$simpleAsyncTo(sourceCubeRelation({fact_logic_id: this.data.id}), '获取数据失败')
      if (res) {
        const {sourceTable, factTable} = res.data
        const primaryTable = factTable.table
        const primaryGroup = []
        const head = {
          head: true,
          group_type: 'primarykey',
          element_name: '主键',
          visible: true,
          children: []
        },
        item = {
          element_code: factTable.table,
          element_name: factTable.table,
          // element_type: logicKeyDatas.pk_type,
          disabled: true,
          checked: false,
          visible: true,
          checkable: false,
          group_type: 'primarykey',
          // deleteTip: '系统生成字段不可删除',
          editTip: '表信息',
          ...factTable,
          attrData: factTable.columns,
          element_id: factTable.table
        }
        head.children.push(item)
        primaryGroup.push(head, item)
        const relationData = []
        const relationHead = {
          head: true,
          group_type: 'relation',
          element_name: '关联维度',
          visible: true,
          children: []
        }
        sourceTable.forEach((item, i) => {
          const temp = {
            checked: false,
            visible: true,
            checkable: true,
            ...item,
            relationDatas: this.getRelationDatas(item),
            element_name: factTable.columns[i].element_name,
            element_code: factTable.columns[i].element_code,
            element_id: item.table,
            rel_dim_table: item.table
          }
          temp.relationDatas.relationData = [
            ...item.columns
          ]
          relationHead.children.push(temp)
          relationData.push(relationHead, item)
        })
        this.list = [
          ...primaryGroup,
          ...relationData
        ]
      }
    },
    async datapreview() {
      this.datapreviewVisible = true
      this.previewLoading = true
      const params = {
        // sql: '',
        // source_table: this.filter.cube_code,
        fact_logic_id: this.initialData.info.fact_logic_id,
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(dataPreview(params), '数据获取失败')
      if (res) {
        this.previewData = res.data
      }
      this.previewLoading = false
    },
    ok() {
      this.datapreviewVisible = false
    },
    async changeFieldItem() {
      const data = this.$refs.fieldForm.getData()
      const params = {
        id: this.activeEditField.id,
        element_name: data.element_name,
        element_code: data.element_code,
        col_desc: data.comment,
        sql_context: data.sql_context,
        element_type: data.element_type
      }
      const res = await this.$simpleAsyncTo(factElementEdit(params), '保存失败')
      if (res.flag) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.visibleEidtField = false
        this.getData()
        if (this.initialData.info.status !== '5') {
          this.$root.eventEmitter.emit('refresh')
        }
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },
    closeModelRelation() {
      this.visibleRelationDialog = false
    },
    closeJuhe() {
      this.juheVisible = false
    }
  }
}
</script>

<style lang="scss"></style>

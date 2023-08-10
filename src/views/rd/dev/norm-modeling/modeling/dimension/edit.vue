<template>
  <TableEditLayout :tabs="tabs" :buttons="btns" v-loading="!!loading">
    <div class="full">
      <transition name="fadeinright" mode="out-in">
        <component :is="component" :headerData="headerData" :data.sync="tableData" :createList="createList" :visibleFoot="true" @changeMode="changeMode" @showTableInfo="showTableInfo" @refresh="getData" @back="backToGraph" @create="create" @selectChange="selectChange" @createCommonLogic="visibleCommonComputeLogic = true" @editFieldByEditor="editFieldByEditor" @editField="editField" @editRelation="editRelation" @goTableEdit="goTableEdit" @remove="handelRemove" @batchRemove="batchRemove"></component>
      </transition>
    </div>
    <SideModal :visible.sync="sideModelOption.visible" :title="sideModelOption.title" @confirm="sideModelOption.confirm">
      <component ref="sideComponent" :is="sideModelOption.component" :field-list="editFieldList" :data="sideModelOption.data"></component>
    </SideModal>
    <NewField type="dim" :visible.sync="visibleAttrDialog" :data="initialData" :tableData="tableData" title="新建属性" @confirm="addField" class="dimension-created" parentClass="dimension-created"></NewField>

    <ModelRelation :visible.sync="visibleRelationDialog" :title="relationDialogTitle" :type="relationDialogType" :data="relationData" :relationFieldList="relationFieldList" @confirm="modifyRelation" class="dimension-relation" parentClass="dimension-relation"></ModelRelation>
    <SimpleEditDialog title="编辑字段" :visible.sync="visibleEidtField" @confirm="changeFieldItem" @close="visibleFieldEditor = false" ref="editFieldDialog" class="dimension-edit-dialog" parentClass="dimension-edit-dialog">
      <el-row class="field-edit-row" :gutter="10">
        <el-col :span="6">
          <FilterList :data="editFieldList" :value.sync="activeEditFieldValue" @change="changeActiveField"></FilterList>
        </el-col>
        <el-col :span="18">
          <FieldForm ref="fieldForm" v-if="!visibleFieldEditor" :data="activeEditField" type="dim"></FieldForm>
          <MonacoEditor v-else :style="{height: `${fieldEditorHeight}px`}" has-top-tools has-bottom-tools show-save-btn :code.sync="activeEditFieldCode" @verification="sqlValidate" @save="saveFieldEditorCode"></MonacoEditor>
        </el-col>
      </el-row>
    </SimpleEditDialog>
    <CommonComputeLogic :visible.sync="visibleCommonComputeLogic"></CommonComputeLogic>
  </TableEditLayout>
</template>

<script>
import TableInfo from './table-info'
import {
  queryById,
  save,
  submit,
  delElement,
  queryDispatchById,
  dispatchEdit,
  sqlVerification,
  queryNoPhysics,
  physicsEdit,
  elementEdit
} from '@/api/rd/dimension-table'
// import {sqlVerification} from '@/api/rd/dimension'
import {
  iconMap,
  types,
  dimLogicRelationTypesMap
  // logicPkTypes,
  // logicSystemTypes
} from '@/config/rd-config'

import mixin from '../mixin'

export default {
  name: 'DimensionTableEdit',
  mixins: [mixin],
  data () {
    const { code, name } = this.data
    return {
      createList: [
        { label: '属性', type: 'attr' },
        { label: '关联维度', type: 'relation' }
      ],
      relationDialogType: 'dimension',
      saveFetch: save,
      submitFetch: submit,
      deleteFetch: delElement,
      headerData: {
        title: '维度逻辑表',
        visibleSql: true,
        type: types.DIMENSIONTABLE,
        ...iconMap[types.DIMENSIONTABLE],
        code,
        name
      },
      scheduleDataFetch: queryDispatchById,
      scheduleEditFetch: dispatchEdit,
      physicalDataFetch: queryNoPhysics,
      physicalEditFetch: physicsEdit
    }
  },
  created () {
    this.tabs[0].component = TableInfo
    this.init = true
    this.getData()
  },
  mounted () { },
  methods: {
    async getData () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryById({ dim_id: this.data.id }),
        '查询维度逻辑表信息失败'
      )
      if (res) {
        const data = res.data
        this.initialData = data
        this.initialData.info = { ...data.dimGeneralKeyAttrDatas }
        this.initData()
      }
      this.loading--
    },
    initData () {
      const {
        dimGeneralKeyAttrDatas = {},
        dimensionDatas,
        dimAttrDatas = [],
        dimDsDatas = {},
        ops = {},
        physical = {}
      } = this.initialData
      this.headerData.list = [
        { label: '业务板块', value: dimensionDatas.business_field_name },
        { label: '所属项目', value: dimensionDatas.project_name },
        { label: '空间类型', value: dimensionDatas.space_type_name },
        { label: '数据域', value: dimensionDatas.data_field },
        { label: '主键', value: dimGeneralKeyAttrDatas.pk_name }
      ]
      this.tabs[0].data = dimensionDatas
      this.tabs[1].data = ops
      this.tabs[2].data = physical
      this.primaryGroup = []
      this.systemGroup = []
      if (dimGeneralKeyAttrDatas.pk_name) {
        const head = {
          head: true,
          group_type: 'primarykey',
          element_name: '主键',
          visible: true,
          children: []
        },
          item = {
            element_code: dimGeneralKeyAttrDatas.pk_code,
            element_name: dimGeneralKeyAttrDatas.pk_name,
            element_type: dimGeneralKeyAttrDatas.pk_type,
            disabled: true,
            checked: false,
            visible: true,
            checkable: false,
            group_type: 'primarykey',
            deleteTip: '系统生成字段不可删除',
            editTip: '维度详情',
            ...dimGeneralKeyAttrDatas
          }
        head.children.push(item)
        this.primaryGroup.push(head, item)
      }
      if (dimDsDatas.partition_name) {
        const head = {
          head: true,
          group_type: 'system',
          element_name: '系统',
          visible: true,
          children: []
        },
          item = {
            element_code: dimDsDatas.partition_code,
            element_name:
              dimDsDatas.partition_name + '，' + dimDsDatas.biz_data_value,
            element_type: dimDsDatas.data_type || 'string',
            checked: false,
            visible: true,
            checkable: false,
            disabled: true,
            group_type: 'system',
            deleteTip: '系统生成字段不可删除',
            editTip: '系统生成字段不可编辑',
            ...dimDsDatas
          }
        head.children.push(item)
        this.systemGroup.push(head, item)
      }
      dimAttrDatas.forEach(item => {
        const flag = item.relation_type === '1'
        const itemData = {
          ...dimLogicRelationTypesMap[item.relation_type],
          checked: false,
          visible: true,
          checkable: true,
          ...item
        }
        if (!flag) {
          itemData.relationDatas = this.getRelationDatas(item)
        }

        this.fieldStore.push(itemData)
      })
      !this.fieldStore.length && this.processData()
    },
    processFieldByType () {
      this.relationGroup = []
      this.attrGroup = []
      this.attrHead.children = []
      this.relationHead.children = []
      this.fieldStore.forEach(item => {
        if (item.relation_type === '1') {
          if (!this.attrGroup.length) {
            this.attrGroup.push(this.attrHead)
          }
          this.attrHead.children.push(item)
          this.attrGroup.push(item)
        } else {
          if (!this.relationGroup.length) {
            this.relationGroup.push(this.relationHead)
          }
          this.relationHead.children.push(item)
          this.relationGroup.push(item)
        }
      })
      this.tableData = [
        ...this.primaryGroup,
        ...this.relationGroup,
        ...this.attrGroup,
        ...this.systemGroup
      ]
    },
    create (type) {
      if (type === 'attr') {
        this.visibleAttrDialog = true
        this.newFieldData = {
          group_type: 'attr',
          group_name: '属性',
          relation_type: '1',
          relation_id: 'no_relation',
          checked: false,
          visible: true,
          checkable: true
        }
      } else if (type === 'relation') {
        this.visibleRelationDialog = true
        this.relationDialogTitle = '新建关联维度'
        this.relationData = {}
      }
    },
    goTableEdit (row) {
      const { id, label } = this.data
      this.tabStore.commit('add', {
        label: '编辑维度：' + label,
        tabType: types.DIMENSION,
        name: '编辑' + id,
        component: 'DimensionEdit',
        data: this.data
      })
    },
    getSaveParams () {
      const logicInfo = this.fieldStore
        .map(item => {
          return item.group_type === 'relation'
            ? `${item.element_id}-${item.relation_id}-${item.relation_type}-${item.union_key_tag}@`
            : `${item.element_id}-${item.relation_type}-${item.union_key_tag}@`
        })
        .join('')
      const ops = this.tabs[1].data,
        physical = this.tabs[2].data,
        tableInfo = this.tabs[0].data
      return {
        dim_id: this.data.id,
        dim_type: tableInfo.dim_type,
        dim_desc: tableInfo.dim_desc,
        cube_id: this.initialData.dimGeneralKeyAttrDatas.cube_id,
        fields: JSON.stringify(this.fieldStore),
        physical: JSON.stringify(physical),
        ops: JSON.stringify(ops),
        cycle_day: physical.cycle_day,
        logicInfo
      }
    },
    getSubmitParams () {
      return { dim_id: this.data.id }
    },
    handelRemove (row) {
      this.remove({
        dim_id: this.data.id,
        element_id: row.element_id
      })
    },
    async sqlValidate (sql) {
      this.loading++
      this.sqlValidRes = null
      const res = this.$simpleAsyncTo(
        sqlVerification({
          sql,
          dim_id: this.data.id,
          dim_type: 'general',
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
    locationHandle () {
      this.handleLocation(
        this.tabStore.states.activeValue,
        '/rd/dev/modeling/dimension-table'
      )
    },
    async changeFieldItem () {
      if (this.visibleFieldEditor) {
        this.visibleFieldEditor = false
        this.visibleEidtField = false
        this.activeEditField.sql_content = this.activeEditFieldCode
      } else {
        const data = this.$refs.fieldForm.getData()
        if (data) {
          await this.elementEditSubmit(data)
          const index = this.fieldStore.findIndex(
            item => item.element_id === this.activeEditFieldValue
          )
          if (index > -1) {
            this.fieldStore.splice(index, 1, data)
          }

          this.visibleEidtField = false
        }
      }
    },
    async elementEditSubmit (data) {
      const { logic_id, union_key_tag, element_id, element_name } = data
      const res = await this.$simpleAsyncTo(
        elementEdit({ logic_id, union_key_tag, element_id, element_name }),
        '保存字段失败'
      )
      if (res) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss"></style>

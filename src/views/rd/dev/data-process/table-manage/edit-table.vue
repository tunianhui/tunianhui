<template>
  <section class="limit-atom-edit">
    <div class="edit-content emphasize-class" ref="container">
      <editMeterWorkOrder :data="flag"/>
    </div>
  </section>
</template>

<script>
import {
  del,
  offLine,
  queryAtomicIndexInfo,
  getSourceTableModelInfoDim,
  getSourceTableModelInfoFact
} from '@/api/rd/atom'
import {types} from '@/config/rd-config'

import editMeterWorkOrder from './edit-meter-work-order.vue'


export default {
  name: 'EditTable',
  components: {editMeterWorkOrder},
  props: {
    data: Object,
  },
  data() {
    const creatClick = this.data.creatClick
    return {
      delFetch: del,
      offlineFetch: offLine,
      creatClick,
      flag: {creatClick: true},
    }
  },
  created(){
    if (this.creatClick) {
      this.flag.creatClick = true
    } else {
      this.flag = this.data
    }
  },
  methods: {
    handleEdit(row, title) {
      this.setActiveRdEditDialog({
        title: `${title}原子指标`,
        component: 'AtomEditDialog',
        data: {...row}
      })
    },
    handleCreate() {
      const {fact_logic_base_id, data_field_id, data_field_name} = this.editForm
      this.setActiveRdEditDialog({
        title: `新增原子指标`,
        component: 'AtomEditDialog',
        data: {
          fact_logic_base_id,
          data_field_id,
          data_field_name
        }
      })
    },
    handleSameSource(row) {
      this.tabStore.commit('add', {
        label: '同源原子指标 ' + row.condition_name,
        tabType: types.ATOM,
        name: row.id + '',
        component: 'AtomEdit',
        data: {
          ...row
        }
      })
    },
    handleCreateDerive(row) {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit',
        data: {
          ...row
        }
      })
    },
    // 获取原子指标列表数据
    async getWholeTableData() {
      if (!this.editForm.fact_logic_base_id) return
      this.tableLoading = true
      const res = await this.$simpleAsyncTo(
        queryAtomicIndexInfo({
          project_name: this.editForm.project_name,
          data_field_name: this.editForm.data_field_name,
          fact_logic_base_id: this.editForm.fact_logic_base_id
        }),
        '获取原子指标列表失败'
      )
      if (res) {
        this.wholeData = res.data
      }
      this.tableLoading = false
    },
    async getFactList() {
      const {fact_logic_base_id, data_field_name, project_name} = this.editForm
      this.tableLoading = true
      const res = await this.$simpleAsyncTo(
        getSourceTableModelInfoFact({
          fact_logic_base_id,
          data_field_name,
          project_name,
          atomic_code: this.activeField.element_code
        }),
        fact_logic_base_id,
        data_field_name,
        project_name,
        '获取列表数据失败'
      )
      if (res) {
        this.modalData = res.data
      }
      this.tableLoading = false
    },
    async getDimList() {
      const {fact_logic_base_id, data_field_name, project_name} = this.editForm
      this.tableLoading = true

      const res = await this.$simpleAsyncTo(
        getSourceTableModelInfoDim({
          fact_logic_base_id,
          data_field_name,
          project_name,
          atomic_code: this.activeField.element_code,
          dim_code: this.activeModal.rel_dim_table
        }),
        '获取列表数据失败'
      )
      if (res) {
        this.modalData = res.data
      }
      this.tableLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
 .limit-atom-edit {
  .edit-content.emphasize-class {
    padding-top: 15px;
    padding-bottom: 15px;
  }
 }
</style>
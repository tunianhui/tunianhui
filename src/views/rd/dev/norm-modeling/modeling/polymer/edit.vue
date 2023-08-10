<template>
  <TableEditLayout :tabs="tabs" :buttons="btns">
    <div class="list-mode" style="padding-top: 20px">
      <LogicTableHeader :data="headerData" class="mb-10"></LogicTableHeader>
      <div class="tabs-box">
        <div class="tabs-right">
          <el-input v-model="keyword" placeholder="请输入关键字" clearable>
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
          <el-button
            type="primary"
            v-if="activeTab === 'derive'"
            icon="el-icon-plus"
            class="mr-10"
            @click="createDerive"
            >新建派生指标</el-button
          >
          <el-button
            type="primary"
            v-else
            icon="el-icon-plus"
            class="mr-10"
            @click="createCustom"
            >新建自定义指标</el-button
          >
          <SimpleConfirm
            @confirm="batchRemove"
            content="确认进行批量删除操作吗？"
          >
            <el-button
              type="primary"
              plain
              icon="el-icon-delete"
              :disabled="batchBtnDisabled"
              >批量删除</el-button
            >
          </SimpleConfirm>
          <el-button
            class="ml-10"
            type="primary"
            plain
            icon="el-icon-refresh"
            @click="handleRefresh"
          ></el-button>
        </div>
        <el-tabs class="list-mode-tabs" v-model="activeTab">
          <el-tab-pane name="derive" label="派生指标">
            <DeriveIndexTable
              ref="deriveTable"
              :data="data"
              :keyword="keyword"
              :batch-btn-disabled.sync="deriveBatchBtnDisabled"
            ></DeriveIndexTable>
          </el-tab-pane>
          <el-tab-pane name="custom" label="自定义指标">
            <CustomIndexTable
              ref="customTable"
              :data="data"
              :keyword="keyword"
              :batch-btn-disabled.sync="customBatchBtnDisabled"
            ></CustomIndexTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :data="sideModelOption.data"
      ></component>
    </SideModal>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import LogicTableHeader from '@c/logic-table-header'
import TableInfo from './table-info'
import {iconMap, types} from '@/config/rd-config'
import {loop} from '@/libs/util'
import CustomIndexTable from './custom-index-table'
import DeriveIndexTable from './derive-index-table'
import mixin from '../mixin'

export default {
  name: 'PolymerTableEdit',
  props: {
    data: Object
  },
  mixins: [mixin],
  components: {
    TableEditLayout,
    LogicTableHeader,
    SideModal,
    CustomIndexTable,
    DeriveIndexTable
  },
  inject: ['tabStore'],
  data() {
    const {code, name} = this.data
    return {
      tabs: [
        {
          label: '表信息',
          title: '汇总逻辑表详情',
          handler: this.tabClick,
          confirm: this.tableConfirm,
          component: TableInfo,
          data: {
            ...iconMap[types.POLYMERTABLE]
          }
        }
      ],
      btns: [
        // {
        //   icon: 'icon iconfont icon-baocun',
        //   handler: this.handleSave,
        //   // label: '保存',
        //   disabled: false,
        //   title: '保存'
        // },
        // {
        //   icon: 'icon iconfont icon-fabu',
        //   handler: this.handleSubmit,
        //   disabled: false,
        //   title: '提交'
        // },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      headerData: {
        title: '汇总逻辑表',
        type: types.POLYMERTABLE,
        ...iconMap[types.POLYMERTABLE],
        code,
        name
      },
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      activeTab: 'derive',
      keyword: '',
      deriveBatchBtnDisabled: false,
      customBatchBtnDisabled: false
    }
  },
  computed: {
    batchBtnDisabled() {
      return this[`${this.activeTab}BatchBtnDisabled`]
    }
  },
  mounted() {},
  methods: {
    tabClick(tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }
      Object.assign(this.sideModelOption, tab, {visible: true})
    },
    createDerive() {
      this.tabStore.commit('add', {
        label: '新建派生指标',
        name: `new_derive`,
        tabType: types.DERIVE,
        component: 'DeriveEdit'
      })
    },
    createCustom() {
      this.$refs.customTable.create()
    },
    batchRemove() {
      this.$refs[`${this.activeTab}Table`].batchRemove()
    },
    handleRefresh() {
      this.keyword = ''
      if (this.activeTab === 'derive') {
        this.$refs.deriveTable.getData()
      } else {
        //
      }
    },
    selectionChange(val) {
      // this.
    },
    tableConfirm() {},
    handerSave() {},
    handleSubmit() {},
    locationHandle() {
      // this.$router.push('/rd/dev/modeling/polymer-table')
      this.handleLocation(
        this.tabStore.states.activeValue,
        '/rd/dev/modeling/dimension-table'
      )
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/list-mode.scss';
</style>

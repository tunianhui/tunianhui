<!--
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-04-17 16:31:28
 * @Description:
-->
<template>
  <TableEditLayout :tabs="tabs" :buttons="btns">
    <div class="list-mode">
      <LogicTableHeader :data="headerData" class="mb-10"></LogicTableHeader>
      <div class="tabs-box">
        <div class="tabs-right my-btn">
          <el-button
            type="primary"
            class="mr-10 primary"
            v-if="activeTab === 'manual'"
            @click="addManual"
          >新建手工标签</el-button>
          <el-button
            type="primary"
            plain
            class="mr-10"
            icon="el-icon-refresh-right"
            @click="$refs.FactoryTable._queryFactoryList()"
          ></el-button>
          <el-popover
            ref="tabControlsPopover"
            popper-class="dark-popper no-gutter my-popper"
            trigger="click"
            placement="bottom-end"
            transition="el-zoom-in-top"
            :width="200"
            :visible-arrow="false"
            v-if="activeTab === 'factory'"
          >
            <ul
              class=""
            >
              <li>请选择展现内容：{{checkList.length}}/8</li>
              <el-checkbox-group v-model="checkList" style="color: #000" :max="5" @change="changeFactoryShowField">
                <el-checkbox :label="item.label" v-for="item in filters" :key="item.label">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </ul>
            <el-button
              icon="iconfont icon-sidebar-toggle-copy"
              slot="reference"
              type="primary"
              plain
            ></el-button>
          </el-popover>
        </div>
        <el-tabs
          class="list-mode-tabs object-table-list"
          @tab-click="changeMode"
          v-model="activeTab"
        >
          <el-tab-pane label="工厂标签" name="factory" lazy>
            <FilterFieldCard
              class="mb-10"
              ref="filterFieldCard"
              @confirm="filterFactoryTableData"
              :filterData="factoryFilterData"
              v-loading="!!loading2"
              ></FilterFieldCard>
              <FactoryTable
                :id="data.id"
                :checkField="checkList"
                ref="FactoryTable"
                :filterData="{curFactoryFilter, factoryKeyword}"
                @getFactoryLength="getFactoryLength"></FactoryTable>
          </el-tab-pane>
          <el-tab-pane label="手工标签" name="manual" lazy>
            <FilterFieldCard
              class="mb-10"
              ref="filterFieldCard"
              @confirm="filterManualTableData"
              :filterData="manualFilterData"
              v-loading="!!loading2"
              :isArrow="false"
              ></FilterFieldCard>
              <ManualTable :filterData="{curManualFilter, manualKeyword}" :id="data.id" @getManualLength="getManualLength"></ManualTable>
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
import FilterFieldCard from '@c/filter-card'
import FactoryTable from './factory-table'
import ManualTable from './manual-table'
import {loop} from '@/libs/util'
import {iconMap, types} from '@/config/rd-config'
import {
  queryCategory
} from '@/api/rd/exreact/tag-center'
import {mapMutations, mapGetters} from 'vuex'

export default {
  name: 'TagLogicEdit',
  props: {
    data: Object
  },
  components: {
    SideModal,
    TableEditLayout,
    LogicTableHeader,
    FilterFieldCard,
    FactoryTable,
    ManualTable
  },
  inject: ['tabStore', 'attrStore'],
  data() {
    const {code, name, factoryNum, manualNum} = this.data
    const list = [{
      label: '工厂标签数',
      value: factoryNum
    }, {
      label: '手工标签数',
      value: manualNum
    }]
    return {
      headerData: {
        title: '标签逻辑表',
        type: types.TAGLOGIC,
        visibleSql: false,
        ...iconMap[types.TAGLOGIC],
        code,
        name,
        list
      },
      tabs: [
        {
          label: '表信息',
          title: '表信息',
          handler: this.tabClick,
          confirm: this.tableConfirm,
          component: TableInfo,
          // key: 'ops',
          data: this.data
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      tabList: [
        {
          label: '工厂标签',
          name: 'factory'
        },
        {
          label: '手工标签',
          name: 'manual'
        }
      ],
      loading2: 0,
      activeTab: 'factory',
      checkList: ['开发状态', '类目', '测试运行状态', '更新时间', '最近补数据'],
      filters: [
        {
          label: '开发状态',
          value: true
        },
        {
          label: '类目',
          value: true
        },
        {
          label: '测试运行状态',
          value: true
        },
        {
          label: '更新时间',
          value: true
        },
        {
          label: '最近补数据',
          value: true
        },
        {
          label: '公开状态',
          value: true
        },
        {
          label: '标签结果表',
          value: true
        },
        {
          label: '标签ID',
          value: true
        }
      ],
      factoryFilterData: [],
      manualFilterData: [],
      categoryList: [],
      curFactoryFilter: [],
      factoryKeyword: '',
      curManualFilter: [],
      manualKeyword: ''
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  async created() {
    await this._queryCategory()
    this.factoryFilterData = [
      {
        label: '类目',
        id: '类目',
        options: this.categoryList
      },
      {
        label: '开发状态',
        id: '开发状态',
        options: [
          {
            id: '6',
            label: '已提交'
          },
          {
            id: '7',
            label: '开发中'
          }
        ]
      },
      {
        label: '测试运行状态',
        id: '测试运行状态',
        options: [
          {
            id: '未测试运行',
            label: '未测试运行'
          },
          {
            id: '测试运行中',
            label: '测试运行中'
          },
          {
            id: '测试运行成功',
            label: '测试运行成功'
          },
          {
            id: '测试运行失败',
            label: '测试运行失败'
          }
        ]
      },
      {
        label: '最近补数据状态',
        id: '最近补数据状态',
        options: [
          {
            id: '失败',
            label: '失败'
          },
          {
            id: '成功',
            label: '成功'
          },
          {
            id: '未执行',
            label: '未执行'
          },
          {
            id: '运行中',
            label: '运行中'
          }
        ]
      }
    ]
    this.manualFilterData = [
      {
        label: '类目',
        id: '类目',
        options: this.categoryList
      }
    ]
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async _queryCategory() {
      this.loading2++
      const res = await this.$simpleAsyncTo(queryCategory({project_code: this.project.project_code}))
      if (res) {
        this.categoryList = res.data.map(item => {
          return {
            id: item.category_name,
            label: item.category_name
          }
        })
      }
      this.loading2--
    },
    changeMode(mode) {},
    async tabClick(tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }
      Object.assign(this.sideModelOption, tab, {visible: true})
    },
    tableConfirm() {
      const data = this.$refs.sideComponent.getData()
      if (data) {
        this.sideModelOption.visible = false
        Object.assign(this.tabs[0].data, data, {modified: true})
      }
    },
    locationHandle() {
      this.$router.push('/rd/exreact/tag-center/logic')
    },
    filterFactoryTableData(curFilter = [], keyword = '') {
      this.curFactoryFilter = curFilter
      this.factoryKeyword = keyword
      // this.$refs.FactoryTable._queryFactoryList()
    },
    filterManualTableData(curFilter = [], keyword = '') {
      this.curManualFilter = curFilter
      this.manualKeyword = keyword
    },
    changeFactoryShowField(val) {
    },
    addManual() {
      this.setActiveRdEditDialog({
        title: '新建手工标签',
        component: `AddManual`,
        data: {...this.project, sum_id: this.data.id, sum_code: this.data.label_table_code}
      })
    },
    getManualLength(data) {
      this.headerData.list[1].value = data
    },
    getFactoryLength(data) {
      this.headerData.list[0].value = data
    }
  }
}
</script>

<style lang="scss" scope>
@import '@/assets/css/list-mode.scss';
.list-mode {
  padding-top: 10px;
  padding-bottom: 10px;
}
.my-popper.el-popper {
  background-color: $grey10;
  border-color: $grey10;
  ul {
    border-bottom: none!important;
    padding: 0 15px 20px 15px!important;
  }
  li:hover {
    background-color: $grey10!important;
  }
  .el-checkbox {
    line-height: 30px;
    margin-right: 40px;
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>

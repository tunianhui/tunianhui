<template>
  <section class="pr-15 pb-10 pl-10">
    <div class="subtitle mb-15">
      <span>标签列表</span>
      <div class="fr  my-btn">
        <el-button icon="el-icon-plus" type="primary" plain @click="add">
          新建标签
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
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
        >
          <ul
            class=""
          >
            <li>请选择展现内容：{{checkList.length}}/8</li>
            <el-checkbox-group v-model="checkList" style="color: #000" :max="5">
              <el-checkbox :label="item.label" v-for="item in filters" :key="item.label">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </ul>
          <el-button
            class="ml-5"
            icon="iconfont icon-sidebar-toggle-copy"
            slot="reference"
            type="primary"
            plain
          ></el-button>
        </el-popover>
      </div>
    </div>
    <FilterFieldCard
      ref="filterFieldCard"
      @confirm="filterFactoryTableData"
      :filterData="factoryFilterData"
      v-loading="!!loading2">
    </FilterFieldCard>
    <FactoryTable :checkField="checkList" :filterData="{curFactoryFilter, factoryKeyword}" ref="FactoryTable"></FactoryTable>
  </section>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import FilterFieldCard from '@c/filter-card'
import FactoryTable from './factory-table'
import {
  queryCategory
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'AtomObjectTable',
  components: {
    FilterFieldCard,
    FactoryTable
  },
  data() {
    return {
      tableData: [],
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
      loading2: 0,
      factoryFilterData: [],
      curFactoryFilter: [],
      factoryKeyword: ''
    }
  },
  inject: ['tabStore'],
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
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async _queryCategory() {
      const res = await this.$simpleAsyncTo(queryCategory({project_code: this.project.project_code}))
      if (res) {
        this.categoryList = res.data.map(item => {
          return {
            id: item.category_name,
            label: item.category_name
          }
        })
      }
    },
    filterFactoryTableData(curFilter = [], keyword = '') {
      this.curFactoryFilter = curFilter
      this.factoryKeyword = keyword
    },
    // showAttr(data) {
    //   const attr = {
    //     title: '工厂标签',
    //     attrType: this.types.FACTORY,
    //     name: data.id + '',
    //     label: data.code,
    //     data,
    //     width: '500px'
    //   }
    //   this.attrStore.commit('add', attr)
    // },
    add() {
      this.setActiveRdEditDialog({
        title: '新建工厂标签',
        component: `FactoryEdit`,
        data: {...this.project}
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/filter-group.scss';
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

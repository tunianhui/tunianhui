<template>
  <section class="physical-table-authority monitor-filter table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>物理表权限</div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="apply">申请物理表权限</el-button>
        <span class="new-btn ml-10">
          <i class="el-icon-refresh-right"></i>
        </span>
      </div>
    </div>
    <el-card class="box-card mb-10" ref="card">
      <div slot="header" class="current flex-layout">
        <span class="search">
          <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入关键字" @input.native="searchFilterTable"></el-input>
        </span>
        <div class="list flex-layout">
          <div class="item active" v-for="(item, index) in current" :key="item.value">
            <span>{{item.large_class}}：</span>
            <OverflowTooltip style="max-width:100px">{{item.type}}</OverflowTooltip>
            <div class="close" @click="closeCurrentHandle(index, item)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div class="group flex-layout pt-10 pb-10" v-for="(v) in filterList" :key="v.id" v-show="toggle">
          <div class="label"><span>{{v.des}}</span></div>
          <div class="options">
            <div class="flex-wrap" v-if="v.id!=='dateList'">
              <div :class="['item', {'active':item.is_select}]" v-for="item in v.options" :key="item.value" @click="selectHandle(v,item)">
                <OverflowTooltip style="max-width:100px">{{item.des}}</OverflowTooltip>
                <div class="close" v-if="item.is_select" @click.stop="closeSelect(item)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="toggle" @click="toggle=!toggle">
        <i :class="['icon iconfont', toggle?'icon-shousuoxiajiantou':'icon-shousuoshangjiantou']"></i>
      </div>
    </el-card>
    <PhyTableInfo :tableData="tableData" v-if="tableData.length" @showDetail='showDetail'></PhyTableInfo>
    <NoData v-else title="物理表权限"></NoData>
  </section>
</template>

<script>
import {
  getPhysicsTable
} from '@/api/asset/authority.js'
import PhyTableInfo from '../comps/tableInfo.vue'
import NoData from '@c/no-data'
import OverflowTooltip from '@c/overflow-tooltip'
import safety from '@/mixins/safety'
import { getFilterList } from './data.js'
import { safetyType } from '@/config/safety-config'
export default {
  name: 'PhysicalTableAuthority',
  mixins: [safety],
  inject: ['tabStore', 'components'],
  components: {
    OverflowTooltip,
    PhyTableInfo,
    NoData
  },
  data () {
    return {
      keyword: '',
      tableData: []
    }
  },
  computed: {
    tabs () {
      return JSON.parse(JSON.stringify(this.tabList)) || []
    }
  },
  created () {
    this.getFilterList()
    this.getTableList()
  },
  methods: {
    apply () {
      const name = safetyType.PHYSICEPOWER
      this.tabStore.commit('add', {
        label: `申请物理表权限`,
        name: name,
        component: 'ApplyLogic', // 复用 通过 name 进行区分
        data: { modelKey: 'table_physical_auth_flow', name }
      })
    },

    // 明细
    showDetail (item) {
      const { cube_code, id } = item
      this.tabStore.commit('add', {
        label: cube_code,
        name: 'phyTableDetail',
        component: 'LogicTableDetail',
        data: { cube_code, id, title: '物理表权限', type: 1 }
      })
    },

    async getTableList () {
      const res = await this.$simpleAsyncTo(
        getPhysicsTable({ keyword: this.keyword }),
        '获取列表失败'
      )
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
    },

    searchFilterTable () {
      this.getTableList()
    },

    async getFilterList () {
      const res = await this.$simpleAsyncTo(getFilterList(), '获取过滤条件失败')
      if (res) {
        this.filterList = res.data.map(e => {
          e.options.forEach(v => {
            v.is_select = false
          })
          return e
        })
      }
    },

    selectHandle (v, item) {
      this.currentValue = item.value
      v.options.forEach(e => {
        e.is_select = false
      })
      item.is_select = true
      let index = this.current.findIndex(e => e.large_value === v.id)
      if (index > -1) {
        this.current.splice(index, 1, { large_class: v.des, large_value: v.id, type: item.des, value: item.value })
      } else {
        this.current.push({
          large_class: v.des,
          large_value: v.id,
          type: item.des,
          value: item.value
        })
      }
    },

    closeSelect (v) {
      v.is_select = false
      this.currentValue = ''
      let index = this.current.findIndex(e => {
        return v.value === e.value
      })
      this.current.splice(index, 1)
    },

    closeCurrentHandle (index, item) {
      this.current.splice(index, 1)
      this.filterList.forEach(e => {
        if (e.id === item.large_value) {
          e.options.forEach(v => {
            if (v.value === item.value) {
              v.is_select = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>

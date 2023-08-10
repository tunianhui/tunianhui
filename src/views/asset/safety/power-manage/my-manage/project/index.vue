<template>
  <section class="porject-authority table-authority monitor-filter">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>项目权限管理</div>
      <div>
        <span class="new-btn ml-10">
          <i class="el-icon-refresh-right"></i>
        </span>
      </div>
    </div>
    <el-card class="box-card mb-10" ref="card">
      <div slot="header" class="current flex-layout">
        <span class="search">
          <el-input v-model="searchValue" prefix-icon="el-icon-search" placeholder="请输入关键字" @input.native="searchFilterTable"></el-input>
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
    <porjectTableQuanXian v-if="tableData.length" :tableData="tableData"></porjectTableQuanXian>
    <NoData v-else title="项目权限"></NoData>
  </section>
</template>

<script>
import safety from '@/mixins/safety'
import OverflowTooltip from '@c/overflow-tooltip'
import porjectTableQuanXian from './tabinfo'
import NoData from '@c/no-data'
import { getFilterList } from './data.js'
export default {
  name: 'PorjectAuthority',
  mixins: [safety],
  components: {
    OverflowTooltip,
    porjectTableQuanXian,
    NoData
  },
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getFilterList()
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>

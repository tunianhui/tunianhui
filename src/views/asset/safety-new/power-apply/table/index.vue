<!--
 * @Author: 大炸鹅
 * @Date: 2022-10-24 13:53:09
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-27 11:11:26
-->
<template>
  <div class="table-apply">
    <div v-if="showHome" class="content">
      <Header :tabs="tabs" :active="activeTab" title="表权限" :showCount="true" @tab-click="tab => activeTab = tab.name">
        <div class="actions">
          <el-button type="primary" @click="jumpApply" icon="iconfont icon-shenqingquanxian font-14 mr-5">申请表权限</el-button>
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>

      <Effect v-show="activeTab === '1'" @jumpDetail="jumpDetail" @total="total => tabs[0].total = total" :activeTab="activeTab"></Effect>
      <Invalidate v-show="activeTab === '2'" @jumpDetail="jumpDetail" @total="total => tabs[1].total = total" :activeTab="activeTab"></Invalidate>
      <Record v-show="activeTab === '3'" @total="total => tabs[2].total = total" :activeTab="activeTab"></Record>
    </div>

    <div v-if="showDetail" class="table-detail">
      <detail :info="infoData" @close="jumpHome" :active="activeTab"></detail>
    </div>

    <div v-if="showApply" class="apply">
      <apply @close="jumpHome"></apply>
    </div>
  </div>
</template>

<script>
import mixin from '../../mixins'
import Detail from './detail.vue'
import Apply from './apply.vue'
import Effect from './effect.vue'
import Invalidate from './invalidate.vue'
import Record from './record.vue'

export default {
  name: 'TableApply',
  components: {
    Effect,
    Invalidate,
    Record,
    Detail,
    Apply
  },
  mixins: [mixin],
  data () {
    return {
      activeTab: '1',
      tabs: [
        {
          label: '已生效',
          value: '1',
          total: 0
        },
        {
          label: '已失效',
          value: '2',
          total: 0
        },
        {
          label: '申请记录',
          value: '3',
          total: 0
        }
      ],
      // 显示详情
      showDetail: false,
      // 显示列表
      showHome: true,
      // 显示表权限申请
      showApply: true,
      infoData: {}
    }
  },
  created () {

  },
  methods: {

    jumpApply () {
      this.showDetail = false
      this.showHome = false
      this.showApply = true
    },

    jumpDetail (row) {
      console.log(row)
      this.infoData = row
      this.showDetail = true
      this.showHome = false
      this.showApply = false
    },

    jumpHome () {
      this.showHome = true
      this.showDetail = false
      this.showApply = false
    }
  }
}
</script>

<style lang="less" scoped>
.table-apply {
  height: 100%;
  position: relative;
  background: #ebeaef;
  .content {
    // overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 20px 15px;
  }
  .apply {
    height: 100%;
    overflow-y: overlay;
    padding: 10px 15px 20px 15px;
  }
  .table-detail {
    height: 100%;
    overflow-y: overlay;
    padding: 10px 15px 20px 15px;
  }
}
</style>

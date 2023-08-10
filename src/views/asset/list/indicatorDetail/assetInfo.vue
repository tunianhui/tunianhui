<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-09 09:38:25
 * @Description: 资产信息
-->
<template>
  <div>
    <AssetSetailTitle title="基础信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>原子指标</label>
        <div class="value">{{asset_basic_data.atomic_name}}</div>
      </div>
      <div class="item-detail">
        <label>统计周期</label>
        <div class="value">{{asset_basic_data.cycle_name}}</div>
      </div>
      <div class="item-detail">
        <label>业务限定</label>
        <div class="value">{{asset_basic_data.condition_name}}</div>
      </div>
      <div class="item-detail">
        <label>统计粒度</label>
        <div class="value">{{asset_basic_data.dim_name}}</div>
      </div>
      <div class="item-detail">
        <label>汇总逻辑表</label>
        <div class="value">{{asset_basic_data.sum_name}}</div>
      </div>
      <div class="item-detail">
        <label>所属项目</label>
        <div class="value">{{asset_basic_data.project_name}}</div>
      </div>
      <div class="item-detail">
        <label>操作人</label>
        <div class="value">{{asset_basic_data.oper_user}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOutputInfo } from '@/api/asset/list'
import AssetSetailTitle from '../component/title.vue'

export default {
  name: 'asset-info',
  components: {
    AssetSetailTitle
  },
  props: {
  },
  data () {
    return {
      asset_basic_data: {}
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 指标-产出信息
    async getDetail () {
      const params = {
        id: this.cube_id,
        pageSize: 10,
        pageNo: 1
      }
      const res = await this.$simpleAsyncTo(getOutputInfo(params), '获取基本信息失败')
      if (res) {
        this.asset_basic_data = res.data.basic_data
      }
    }
  }
}
</script>
<style lang="scss">
.conttent-box {
  margin-bottom: 35px;
  .item-detail {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin: 8px 0;
    label {
      width: 120px;
      color: #76797d;
    }
    .value {
      flex: 1;
      color: #121314;
      width: 0;
      word-break: break-all;
    }
  }
}
</style>

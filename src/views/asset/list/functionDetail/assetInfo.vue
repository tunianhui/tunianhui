<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-10 10:08:39
 * @Description: 资产信息
-->
<template>
  <div>
    <AssetSetailTitle title="基础信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>负责人</label>
        <div class="value">{{asset_basic_data.create_user}}</div>
      </div>
      <div class="item-detail">
        <label>创建时间</label>
        <div class="value">{{asset_basic_data.create_time}}</div>
      </div>
    </div>
    <AssetSetailTitle title="变更信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>最新更新</label>
        <div class="value">{{asset_basic_data.modify_time}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import AssetSetailTitle from '../component/title.vue'
export default {
  name: 'asset-info',
  props: {
    asset_basic_data: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    AssetSetailTitle
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
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

<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-03 10:27:01
 * @Description: 资产信息
-->
<template>
  <div class="info-detail">
    <div class="basic">
      <h4 class="">基础信息</h4>
      <template>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.create_time}}</OverflowTooltip>
        </div>
        <div>
          <span>空间类型：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.space_type}}</OverflowTooltip>
        </div>
        <div>
          <span>描述：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.project_desc}}</OverflowTooltip>
        </div>
      </template>
    </div>
    <div class="basic">
      <h4 class="">计算引擎</h4>
      <template>
        <div>
          <span>离线计算引擎：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.offline_engine_name}}</OverflowTooltip>
        </div>
        <div>
          <span>实时计算引擎：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.real_time_engine_name}}</OverflowTooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'asset-info',
  props: {
    asset_basic_data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.info-detail {
  background: $grey10;
  height: calc(100% - 140px);
  padding: 20px;
  .basic {
    padding: 0 10px;
    margin-top: 20px;
    > div {
      margin: 10px 10px;
      font-size: 12px;
      span:first-child {
        color: $grey4;
        text-align: end;
      }
    }
    .basic-info {
      width: calc(100% - 120px);
    }
  }
}
</style>

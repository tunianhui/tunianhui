<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-03 09:19:50
 * @Description: 资产信息
-->
<template>
  <div class="info-detail">

    <div class="basic">
      <h4 class="">基础信息</h4>
      <template>
        <div>
          <span>负责人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_time}}</OverflowTooltip>
        </div>
        <div>
          <span>描述：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.data_source_desc}}</OverflowTooltip>
        </div>
      </template>
    </div>
    <div class="basic">
      <h4 class="">使用信息</h4>
      <template>
        <div>
          <span>读取任务：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
        <div>
          <span>写入任务：</span>
          <OverflowTooltip class="basic-info">1</OverflowTooltip>
        </div>
      </template>
    </div>
    <div class="basic">
      <h4 class="">变更信息</h4>
      <template>
        <div>
          <span>更新时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_time}}</OverflowTooltip>
        </div>
        <div>
          <span>最新时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_time}}</OverflowTooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'asset-info',
  props: {
    tableInfo: {
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
  height: 540px;
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

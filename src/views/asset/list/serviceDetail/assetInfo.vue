<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-09 09:37:13
 * @Description: 资产信息
-->
<template>
  <div>
    <AssetSetailTitle title="基础信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>API_ID</label>
        <div class="value">{{asset_basic_data.api_id}}</div>
      </div>
      <div class="item-detail">
        <label>API_Path</label>
        <div class="value">{{asset_basic_data.api_path}}</div>
      </div>
      <div class="item-detail">
        <label>请求方式</label>
        <div class="value">{{asset_basic_data.api_request_type}}</div>
      </div>
      <div class="item-detail">
        <label>协议</label>
        <div class="value">{{asset_basic_data.api_protocol}}</div>
      </div>
      <div class="item-detail">
        <label>返回类型</label>
        <div class="value">{{asset_basic_data.api_reponse_type}}</div>
      </div>
      <div class="item-detail">
        <label>创建时间</label>
        <div class="value">{{asset_basic_data.publish_time}}</div>
      </div>
      <div class="item-detail">
        <label>负责人</label>
        <div class="value">{{asset_basic_data.publish_person}}</div>
      </div>
      <div class="item-detail">
        <label>描述</label>
        <div class="value">{{asset_basic_data.api_remark}}</div>
      </div>
    </div>
    <AssetSetailTitle title="使用信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>应用数</label>
        <div class="value">{{asset_basic_data.app_num}}</div>
      </div>
      <div class="item-detail">
        <label>调用次数</label>
        <div class="value">{{asset_basic_data.call_num}}</div>
      </div>
    </div>
    <AssetSetailTitle title="变更信息"></AssetSetailTitle>
    <div class="conttent-box">
      <div class="item-detail">
        <label>数据更新时间</label>
        <div class="value">{{asset_basic_data.publish_time}}</div>
      </div>
      <div class="item-detail">
        <label>数据发布时间</label>
        <div class="value">{{asset_basic_data.update_time}}</div>
      </div>
    </div>
    <!-- <div class="basic">
      <h4 class="">基本信息</h4>
      <template>
        <div>
          <span>API_ID：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_id}}</OverflowTooltip>
        </div>
        <div>
          <span>API_Path：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_path}}</OverflowTooltip>
        </div>
        <div>
          <span>请求方式：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_request_type}}</OverflowTooltip>
        </div>
        <div>
          <span>协议：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_protocol}}</OverflowTooltip>
        </div>
        <div>
          <span>返回类型：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_reponse_type}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.publish_time}}</OverflowTooltip>
        </div>
        <div>
          <span>负责人：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.publish_person}}</OverflowTooltip>
        </div>
        <div>
          <span>描述：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.api_remark}}</OverflowTooltip>
        </div>
      </template>
    </div>
    <div class="basic">
      <h4 class="">使用信息</h4>
      <template>
        <div>
          <span>应用数：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.app_num}}</OverflowTooltip>
        </div>
        <div>
          <span>调用次数：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.call_num}}</OverflowTooltip>
        </div>
      </template>
    </div>
    <div class="basic">
      <h4 class="">变更信息</h4>
      <template>
        <div>
          <span>数据更新时间：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.publish_time}}</OverflowTooltip>
        </div>
        <div>
          <span>数据发布时间：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.update_time}}</OverflowTooltip>
        </div>
      </template>
    </div> -->
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
  },
  mounted () {
  }
}
</script>
<style lang="scss">
// .info-detail {
//   background: $grey10;
//   height: calc(100% - 140px);
//   padding: 20px;
//   .basic {
//     padding: 0 10px;
//     margin-top: 20px;
//     > div {
//       margin: 10px 10px;
//       font-size: 12px;
//       span:first-child {
//         color: $grey4;
//         text-align: end;
//       }
//     }
//     .basic-info {
//       width: calc(100% - 120px);
//     }
//   }
// }
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

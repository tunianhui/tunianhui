<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-02-16 17:52:01
 * @Description: 资产信息
-->
<template>
  <div>
    <template>
      <AssetSetailTitle title="基础信息"></AssetSetailTitle>
      <div class="conttent-box">
        <template>
          <div class="item-detail">
            <label>创建时间</label>
            <div class="value">{{tableInfo.create_time}}</div>
          </div>
          <div class="item-detail">
            <label>项目</label>
            <div class="value">{{tableInfo.project_code}}</div>
          </div>
          <div class="item-detail">
            <label>创建人</label>
            <div class="value">{{tableInfo.oper_user}}</div>
          </div>
          <div class="item-detail">
            <label>表类型</label>
            <div class="value">{{tableInfo.object_type | turnTableType}}</div>
          </div>
          <div class="item-detail">
            <label>产出任务</label>
            <div class="value">查看代码</div>
          </div>
        </template>
      </div>
    </template>
    <template>
      <AssetSetailTitle title="物理信息"></AssetSetailTitle>
      <div class="conttent-box">
        <template>
          <div class="item-detail">
            <label>存储量</label>
            <div class="value">{{tableInfo.phyInfo && tableInfo.phyInfo.storage_size}}</div>
          </div>
          <div class="item-detail">
            <label>生命周期</label>
            <div class="value">{{tableInfo.phyInfo && tableInfo.phyInfo.life_cycle}}</div>
          </div>
          <div class="item-detail">
            <label>存储类型</label>
            <div class="value">{{tableInfo.phyInfo && tableInfo.phyInfo.storage_type}}</div>
          </div>
        </template>
      </div>
    </template>

    <template>
      <AssetSetailTitle title="使用信息"></AssetSetailTitle>
      <div class="conttent-box">
        <template>
          <div class="item-detail">
            <label>收藏次数</label>
            <div class="value">{{tableInfo.useInfo && tableInfo.useInfo.collect_count}}</div>
          </div>
          <div class="item-detail">
            <label>浏览次数</label>
            <div class="value">{{tableInfo.useInfo && tableInfo.useInfo.browse_count}}</div>
          </div>
          <div class="item-detail">
            <label>访问次数</label>
            <div class="value">{{tableInfo.useInfo && tableInfo.useInfo.visit_count}}</div>
          </div>
        </template>
      </div>
    </template>

    <template>
      <AssetSetailTitle title="变更信息"></AssetSetailTitle>
      <div class="conttent-box">
        <template>
          <div class="item-detail">
            <label>DDL变更</label>
            <div class="value">{{tableInfo.changeInfo && tableInfo.changeInfo.ddl_change}}</div>
          </div>
          <div class="item-detail">
            <label>数据变更</label>
            <div class="value">{{tableInfo.changeInfo && tableInfo.changeInfo.data_change}}</div>
          </div>
          <div class="item-detail">
            <label>最近访问</label>
            <div class="value">{{tableInfo.changeInfo && tableInfo.changeInfo.lately_visit}}</div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import AssetSetailTitle from '../component/title.vue'
export default {
  name: 'asset-info',
  components: {
    AssetSetailTitle
  },
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
  filters: {
    turnTableType (v) {
      let a = {
        100: '物理表',
        11: '物理表',
        50: '物理表',
        10: '维度逻辑表',
        16: '维度逻辑表',
        17: '事实逻辑表',
        18: '汇总逻辑表',
        19: '元表',
        20: '镜像表',
        21: '字段',
        22: '函数',
        23: '项目',
        24: '数据源',
        25: '数据服务',
        26: '指标'
      }
      return a[v]
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

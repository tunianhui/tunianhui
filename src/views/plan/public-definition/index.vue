<template>
  <div class="public-definition">
    <div class="page-title">公共定义</div>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane label="公共字段" name="1"></el-tab-pane>
        <el-tab-pane label="仓库层级" name="2"></el-tab-pane>
        <el-tab-pane label="统计周期" name="3"></el-tab-pane>
      </el-tabs>
        <component :is="tabCurrentComponent"></component>
    </el-card>
  </div>
</template>

<script>
import publicFields from './public-fields'
import statisticalPeriod from './statistical-period'
import warehouseLevel from './warehouse-level'
export default {
  name: 'PublicDefinition',
  components: { publicFields, statisticalPeriod, warehouseLevel },
  data() {
    return {
      activeName: '1',
      tabCurrentComponent: 'publicFields'
    }
  },
  methods: {
    handleClick(activeName) {
      if (activeName === '1') {
        this.tabCurrentComponent = 'publicFields'
      } else if (activeName === '2') {
        this.tabCurrentComponent = 'warehouseLevel'
      } else {
        this.tabCurrentComponent = 'statisticalPeriod'
      }
    }
  }
}
</script>

<style lang="scss">
  .public-definition {
    .tab-title {
      font-size: 12px;
      h3 {
        background: $tabTitleColor;
        color: #fff;
        // display: inline-block;
        position: relative;
        width: 80px;
        text-align: center;
        height: 26px;
        line-height: 26px;
        padding: 0 20px 0 10px;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          top: 6px;
          right: -7px;
          height: 0;
          border-width: 0 13px 13px;
          border-style: solid;
          border-color: transparent transparent #fff;
          transform: rotate(270deg);
        }
      }
    }
  }
</style>

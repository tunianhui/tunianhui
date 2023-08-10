<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-29 09:18:13
 * @LastEditTime: 2022-08-29 13:39:24
 * @Description:
-->
<template>
  <section class="security-overview">
    <header class="security-header">
      <div>
        <span class="security-title">安全概览</span>
        <span class="font-14 mr-20 ml-20"
              style="color:rgba(0,0,0,.6)">数据日期：2021-08-09</span>
      </div>
      <div class="security-extra">
        <el-button icon="el-icon-refresh"
                   type="primary"
                   plain></el-button>
      </div>
    </header>

    <el-row :gutter="10"
            class="overview-container">
      <el-col :span="24">
        <div class="security-rule-error">
          <el-row :gutter="10">
            <el-col :span="6"
                    v-for="item in totalData"
                    :key="item.title">
              <div>
                <ErrorCard :total="item"></ErrorCard>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-card class="rule-trend-card mt-10">
      <div class="rule-trend-main">
        <el-tabs v-model="activeName"
                 @tab-click="tabHandleClick">
          <el-tab-pane :label="item.label"
                       :name="item.name"
                       lazy
                       v-for="item in tabs"
                       :key="item.name">
            <TrendContent :type="activeName"></TrendContent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <el-row :gutter="10"
            class="mt-10">
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="12"
                  v-for="total in totalData2"
                  :key="total.title">
            <el-card>
              <div class="flex-container">
                <div>
                  <div class="title">{{total.title}}</div>
                  <el-button type="text">{{total.des}}></el-button>
                </div>
                <div>
                  <div class="title">{{total.title2}}</div>
                  <el-button type="text">{{total.des2}}></el-button>
                </div>
                <div>
                  <div class="title">{{total.title3}}</div>
                  <el-button type="text">{{total.des3}}></el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import ErrorCard from './error-card'
import TrendContent from './trend-content'
export default {
  name: 'QualityOverview',
  components: {
    ErrorCard,
    TrendContent
  },
  data () {
    return {
      totalData: [
        { title: '识别字段数', value1: '1004', value2: '0.20%', value3: '6.47%', des: '查看识别记录' },
        { title: '识别字段比例', value1: '2.13%', value2: '0', value3: '2.90%', des: '管理识别规则' },
        { title: '生成数据分类数', value1: '3', value2: '0', value3: '0', des: '管理数据分类' },
        { title: '生成数据分级数', value1: '3', value2: '0', value3: '0', des: '管理数据分级' }
      ],
      totalData2: [
        { title: '-类数据分级分布', des: '管理数据分级', title2: '数据分类分布', des2: '管理数据分类', title3: '-类数据脱敏占比', des3: '管理脱敏规则' },
        { title: '-类数据分类分布', des: '管理数据分级', title2: '数据分级分布', des2: '管理数据分级', title3: '-类数据脱敏占比', des3: '管理脱敏规则' }
      ],
      tabs: [{
        label: '识别字段数',
        name: 'table'
      },
      {
        label: '识别字段比例',
        name: 'datasource'
      },
      {
        label: '生成数据分类数',
        name: 'realtime'
      },
      {
        label: '生成数据分级数',
        name: 'realtime2'
      }
      ],
      activeName: 'table'
    }
  },
  created () {
  },
  methods: {
    tabHandleClick (val) {

    }
  }
}
</script>

<style lang="scss">
.security-overview {
  $padding: 8px 20px;
  $noPadingTop: 0 20px 20px 20px;
  $height: 28px;
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;
  .head-wrapper {
    display: flex;
    align-items: center;
    .head-wrapper-title {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
      line-height: $height;
    }
  }
  .security-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 20px 0 12px;
    .security-title {
      font-size: 16px;
      font-weight: 500;
    }
    .security-extra {
      .el-button {
        border-radius: 0;
        border-color: $grey6;
        background-color: $grey10;
        color: $grey5;
        padding: 7px 10px;
        &:hover {
          border-color: $grey6;
          background-color: rgba($grey10, 1);
        }
      }
    }
  }
  .overview-container {
    height: 175px;
    > .el-col {
      height: 100%;
      > div {
        background-color: $grey9;
      }
      .security-rule-error {
        height: 100%;
      }
    }
  }
  .rule-trend-card {
    border-radius: 0;
    box-shadow: none;
    border: none;
    background: $grey9;
    .el-card__body {
      padding-top: 0;
    }
    .rule-trend-main {
      position: relative;
      .info-title {
        position: absolute;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
      .el-tabs__nav-scroll {
        margin-left: 60px;
      }
    }
  }
  .flex-container {
    display: flex;
    & > div {
      flex: 1;
    }
  }
}
.security-select {
  &.el-popper {
    margin-top: 0;
  }
  &.el-select-dropdown {
    border-radius: 0;
    // box-shadow: none;
  }
  .popper__arrow {
    border-width: 0;
    &::after {
      border-width: 0;
    }
  }
}
</style>

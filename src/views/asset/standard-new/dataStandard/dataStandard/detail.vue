<template>
  <div class="public-detail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item @click.native="backHand">标签资产</el-breadcrumb-item>
      <el-breadcrumb-item>标签详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-header">
      <div class="side-wrapper">
        <i class="iconfont icon-APIquanxian"></i>
        <span>离线标签</span>
        <span>(规则组合)</span>
      </div>
      <div class="detail-info">
        <div class="info-title">
          <span>长投偏好分层_高学历_用户</span>
          <span>derivative_code</span>
        </div>
        <div class="info-0">
          <div class="left">
            <div style="display: flex">
              <span class="label">负责人</span>
              <OverflowTooltip class="value">abggjak</OverflowTooltip>
            </div>
            <div style="display: flex">
              <span class="label">所属项目</span>
              <OverflowTooltip class="value">标签平台1111111111111111111</OverflowTooltip>
            </div>
            <div style="display: flex">
              <span class="label">上架时间</span>
              <OverflowTooltip class="value">2023-01-01 12:21:12</OverflowTooltip>
            </div>
          </div>
          <el-divider direction="vertical" class="divider"></el-divider>
          <div class="right">
            <div>
              <div style="display: flex">
                <span class="label">关联实体</span>
                <OverflowTooltip class="value">用户</OverflowTooltip>
              </div>
              <el-divider direction="vertical" class="divider-width"></el-divider>
              <div style="display: flex">
                <span class="label">所属类目</span>
                <OverflowTooltip class="value">证券/客户/信息</OverflowTooltip>
              </div>
              <el-divider direction="vertical" class="divider-width"></el-divider>
              <div style="display: flex">
                <span class="label">服务类型</span>
                <OverflowTooltip class="value">在线服务、离线服务</OverflowTooltip>
              </div>
            </div>
            <div>
              <div style="display: flex">
                <span class="label">标签值类型</span>
                <OverflowTooltip class="value">字符串</OverflowTooltip>
              </div>
              <el-divider direction="vertical" class="divider-width"></el-divider>
              <div style="display: flex">
                <span class="label">更新方式</span>
                <OverflowTooltip class="value">每天 00:00</OverflowTooltip>
              </div>
              <el-divider direction="vertical" class="divider-width"></el-divider>
              <div style="display: flex">
                <span class="label">数据更新时间</span>
                <OverflowTooltip class="value">2023-01-01 12:21:12</OverflowTooltip>
              </div>
            </div>
            <div>
              <div style="display: flex">
                <span class="label">描述</span>
                <OverflowTooltip class="value">-</OverflowTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="标签分布" name="1">
        <div style='position: relative;'>
          <el-tabs v-model="subActiveName" class="sub-tab">
            <el-tab-pane label="标签统计" name="1">
              <span class="text">总数 2000</span>
              <Bar></Bar>
              <el-table
                :data="[]"
                style="width: 100%">
                <el-table-column prop="date" label="统计指标"></el-table-column>
                <el-table-column prop="name" label="平衡型"></el-table-column>
                <el-table-column prop="address" label="激进型"></el-table-column>
                <el-table-column prop="address" label="稳健型"></el-table-column>
                <el-table-column prop="address" label="谨慎型"></el-table-column>
                <el-table-column prop="address" label="进取型"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="标签历史详情" name="2">
            </el-tab-pane>
          </el-tabs>
          <div style='position: absolute;right:10px;top:5px;'>
            <el-radio-group v-model="radio1">
              <el-radio-button size='mini' label="1"><i class="iconfont icon-bar"></i></el-radio-button>
              <el-radio-button size='mini' label="2"><i class="iconfont icon-bar rotate"></i></el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="使用统计" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="加工逻辑" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="标签测试" name="fourth">定时任务补偿</el-tab-pane>
      <el-tab-pane label="标签血缘" name="fourth1">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Bar from '../bar'
export default {
  name: 'PublicDetail',
  components: {
    Bar
  },
  data() {
    return {
      activeName: '1',
      subActiveName: '1',
      radio1: '1',
      chart: null
    }
  },
  mounted() {
  },
  methods: {
    backHand() {
      this.$emit('backHand')
    }
  }
}
</script>

<style lang="scss" scoped>
.public-detail {
  ::v-deep .el-breadcrumb {
    margin-bottom: 10px;
  }
  ::v-deep .el-breadcrumb__item:first-child {
    .el-breadcrumb__inner {
      font-weight: 600;
      cursor: pointer;
    }
  }
  .detail-header {
    height: 130px;
    background: #fff;
    display: flex;
    .side-wrapper {
      width: 100px;
      display: flex;
      align-items: center;
      background: #58b4b6;
      justify-content: center;
      flex-direction: column;
      > i {
        color: #fff;
        font-size: 22px;
        margin-bottom: 8px;
      }
      > span {
        font-size: 12px;
        color: #fff;
        &:last-child {
          opacity: 0.8;
        }
      }
    }
    .detail-info {
      width: 0;
      flex: 1;
      display: flex;
      padding: 15px;
      font-size: 14px;
      flex-direction: column;
      .info-title {
        height: 28px;
        >span:first-child {
          font-weight: 600;
        }
        >span:last-child {
          margin-left: 10px;
          font-size: 12px;
          opacity: 0.7;
        }
      }
      .info-0 {
        display: flex;
        height: 0;
        flex: 1;
        .divider {
          height: 100%;
        }
        .left {
          width: 165px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .right {
          width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          >div {
            display: flex;
            align-items: center;
            >div {
              width: 205px;
              margin-right: 10px;
            }
          }
        }
        .label {
          font-size: 12px;
          opacity: 0.8;
          margin-right: 8px;
        }
        .value {
          font-size: 12px;
          color: #000;
          flex: 1;
          opacity: .9;
        }
        .divider-width {
          width: 1px!important;
        }
      }
    }
  }
  ::v-deep .el-tabs__content {
    background: #fff;
  }
  .sub-tab {
    ::v-deep .el-tabs__nav-scroll {
      padding: 0 20px;
    }
    ::v-deep .el-tab-pane {
      padding: 0 20px;
    }
  }
  .rotate::before {
    display: inline-block;
    transform: rotate(90deg);
  }
  .text {
    font-weight: 500;
    font-size: 14px;
  } 
}
</style>
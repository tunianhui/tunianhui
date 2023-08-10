<template>
  <el-card class="error-card">
    <div slot="header" class="clearfix erro-card-title">
      <span>{{total.title}}</span>
      <el-tooltip class="item" effect="dark" content="规则校验详情" placement="top">
        <i class="iconfont icon-guizepeizhi rule-icon" style="float: right; padding: 3px 0"></i>
      </el-tooltip>
    </div>
    <div class="error-main">
      <div class="error-main-letf">
        <div class="error-count">{{total.value}}</div>
        <div :class="['error-trend', total.type]">
          <i :class="['iconfont', icons[total.type]]"></i>
          日环比
        </div>
      </div>
      <div class="error-divider1"></div>
      <div class="error-card-right">
        <div class="error-trend-strong font-12">
          <i class="iconfont icon-jinggao1 font-18 mr-5 color-e"></i>
          <span>强规则异常：<span>{{total.strong}}</span></span>
        </div>
        <div class="error-trend-weak font-12">
          <i class="iconfont icon-jinggao1 font-18 mr-5 color-y"></i>
          <span>弱规则异常：<span>{{total.weak}}</span></span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ErrorCard',
  props: {
    total: {
      type: Object,
      default: () => {
        return {
          title: '',
          value: '',
          type: '',
          strong: '',
          weak: ''
        }
      }
    }
  },
  data() {
    return {
      icons: {
        up: 'icon-zengjia font-16',
        eq: 'icon-chiping',
        down: 'icon-jianshao font-16'
      }
    }
  }
}
</script>

<style lang="scss">
.error-card {
  $padding: 8px 20px;
  $height: 28px;
  // box-shadow: none;
  border: none;
  border-radius: 0;
  &.el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card__header {
    padding: $padding;
    border: none;
    .erro-card-title {
      line-height: $height;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0,0,0,.5);
      .rule-icon {
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }
  .el-card__body {
    padding: 0 20px 20px 20px;
    .error-main {
      display: flex;
      .error-main-letf {
        flex: 2;
        .error-count {
          font-size: 26px;
        }
        .error-trend {
          font-size: 12px;
          // color: rgba(0,0,0,.5);
        }
        .up {
          color: #ff1461;
        }
        .eq {
          color: #949494;
        }
        .down {
          color: $success;
        }
      }
      .error-divider1 {
        position: static;
        height: auto;
        margin: 0 20px;
        background-color: #e8e8e8;
        top: -.06em;
        display: inline-block;
        width: 1px;
        vertical-align: middle;
        line-height: 1.5;
      }
      .error-card-right {
        flex: 3;
        .error-trend-strong,.error-trend-weak {
          display: flex;
          height: 24px;
          align-items: center;
          >span {
            color: rgba(0,0,0,.5);
          }
          .color-y {
            color: #f33;
          }
          .color-e {
            color: #ffc20f;
          }
        }
      }
    }
  }
}
</style>

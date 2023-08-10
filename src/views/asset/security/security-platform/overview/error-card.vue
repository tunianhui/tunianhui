<template>
  <el-card class="error-card">
    <div slot="header" class="clearfix erro-card-title">
      <div class="title">{{total.title}}</div>
    </div>
    <div class="error-main">
      <div class="error-main-letf">
        <div class="value">{{total.value1}}</div>
        <div class="error-count">日环比：{{total.value2}}</div>
        <div class="error-count">月同比：{{total.value3}}</div>
        <el-button type="text">{{total.des}}></el-button>
      </div>
      <div class="error-divider1"></div>
      <div class="error-card-right">
        <div class="error-trend-strong">
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
  data () {
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
      .title {
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
  .el-card__body {
    padding: 0 20px 20px 20px;
    .error-main {
      display: flex;
      .error-main-letf {
        flex: 2;
        .value {
          font-size: 18px;
          font-weight: 600;
          color: rgba(0, 0, 0, .5);
        }
        .error-count {
          font-size: 12px;
        }
        .error-trend {
          font-size: 12px;
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
        top: -.06em;
        display: inline-block;
        width: 1px;
        vertical-align: middle;
        line-height: 1.5;
      }
      .error-card-right {
        flex: 3;
        .error-trend-strong {
          height: 100%;
          border-top: 2px solid #578af6;
          background: linear-gradient(#9cbaf9, #fff);
        }
      }
    }
  }
}

</style>

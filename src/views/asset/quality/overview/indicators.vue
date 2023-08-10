<template>
  <section class="indicators">
    <div class="quality-left">
      <div class="quality-card">
        <div class="card-content">
          <div class="card-head">
            规则校验表数
            <el-tooltip class="item" effect="dark" content="今日质量规则校验覆盖数据表数" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="card-body">
            <div class="card-count">{{indicatorsData.tableCount}}</div>
            <div class="card-trend color1">
              <i class="iconfont icon-jianshao font-icon"></i>
              较昨日减少 {{indicatorsData.tableCountChange}}
            </div>
          </div>
        </div>
      </div>
      <div class="quality-card">
        <div class="card-content">
          <div class="card-head">
            强规则异常表数
            <el-tooltip class="item" effect="dark" content="今日强规则异常覆盖数据表数" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="card-body">
            <div class="card-count">{{indicatorsData.strongErrorCount}}</div>
            <div class="card-trend color2">
              <i class="iconfont icon-zengjia font-icon"></i>
              较昨日减少 {{indicatorsData.strongErrorCountChange}}
            </div>
          </div>
        </div>
      </div>
      <div class="quality-card">
        <div class="card-content">
          <div class="card-head">
            弱规则异常表数
            <el-tooltip class="item" effect="dark" content="今日弱规则异常覆盖数据表数" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="card-body">
            <div class="card-count">{{indicatorsData.strongErrorCount}}</div>
            <div class="card-trend color3">
              <i class="iconfont icon-zengjia font-icon"></i>
              较昨日减少 {{indicatorsData.strongErrorCountChange}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-link class="right" tag="a" to="">
      <i class="iconfont icon-xiangmu mb-10"></i>
      规则校验记录
      <i class="el-icon-arrow-right mt-10"></i>
    </router-link>
  </section>
</template>

<script>
import { getIndicatorsData } from '@/api/asset/quality'
export default {
  name: 'Indicators',
  data() {
    return {
      indicatorsData: {}
    }
  },
  filters: {
    dataFormat(data) {
      const str = data + ''
      if (str === 'Infinity') {
        return '--'
      }
      if (str.substring(0, 1) === '-') {
        return str.substring(1) + '%'
      } else {
        return str
      }
    }
  },
  mounted() {
    this._getIndicatorsData()
  },
  methods: {
    async _getIndicatorsData() {
      const res = await this.$simpleAsyncTo(getIndicatorsData(), '获取数据失败')
      if (res) {
        this.indicatorsData = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.indicators {
    display: flex;
    justify-content: space-between;
    .quality-left {
      display: flex;
      flex: 1;
      margin-right: 12px;
      background-color: $grey8;
      .quality-card {
        flex: 1;
        position: relative;
        ::after {
          position: absolute;
          content: "";
          top: 20px;
          bottom: 20px;
          right: 0;
          width: 1px;
          background-color: #e8e8e8;
        }
        .card-content {
          text-align: center;
          background-color: $grey8;
          .card-head {
            padding: 12px 20px 10px 20px;
            font-size: 14px;
          }
          .card-body {
            padding: 0px 20px 20px 20px;
            .card-count {
              font-size: 28px;
              line-height: 34px;
              padding: 5px 0;
              font-weight: 500;
            }
            .card-trend {
              .font-icon {
                font-size: 14px;
              }
              font-size: 12px;
              &.color1 {
                color: $grey4;
              }
              &.color2 {
                color: $success;
              }
              &.color3 {
                color: $error;
              }
            }
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 40px;
      background-color: #f8f8f8;
      color: rgba(0,0,0,.5);
      &:hover{
        color: $--color-primary;
      }
    }
}
</style>

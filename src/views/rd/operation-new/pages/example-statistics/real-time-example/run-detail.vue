<template>
  <div class="run-detail-real-time">
    <div class="body-title">
      <span>运行详情</span>
      <span>
        <i class="iconfont icon-shishishili"></i>
        <span>实例总数</span>
        <span>1</span>
      </span>
    </div>
    <div class="run-detail-wrapper">
      <div class="item-box" v-for="item in detailList" :key="item.type">
        <div class="top">
          <div class="top-left">
            <div class="type-text">
              <i :class="['iconfont', item.icon]" :style="{color: item.color}"></i>
              <span>{{item.text}}</span>
            </div>
            <div class="count">{{item.count ? item.count : '暂无'}}</div>
            <div class="percent">
              <span>占实例总数：</span>
              <span>{{item.percent ? item.percent : '暂无'}}</span>
            </div>
          </div>
          <div class="top-right">
            <el-progress
              type="circle"
              :show-text="false"
              :percentage="item.percent || 0"
              :width="80" :stroke-width="10"
              color="#598AE8"
              stroke-linecap="butt"
            ></el-progress>
          </div>
        </div>
        <div class="bottom">
          <div>
            <i class="iconfont icon-shuangxiangjiantou4"></i>
            <span>FLINK_SQL</span>
          </div>
          <div>1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RunDetailRealTime',
  data() {
    return {
      detailList: [
        {
          type: 'runLoading',
          text: '运行中',
          icon: 'icon-wait',
          color: '#6089D9',
          percent: 0,
          count: null
        },
        {
          type: 'suspend',
          text: '暂停',
          icon: 'icon-execute-',
          color: '#CEAE4D',
          percent: 0,
          count: null
        },
        {
          type: 'stop',
          text: '停止',
          icon: 'icon-zhongzhi',
          color: '#B14861',
          percent: 100,
          count: 1
        },
        {
          type: 'other',
          text: '其他',
          icon: 'icon-dengyu',
          color: '#7A777F',
          percent: 0,
          count: null
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.run-detail-real-time {
  .body-title {
    display: flex;
    align-items: center;
    height: 30px;
    >span {
      &:nth-child(1) {
        font-size: 16px;
        color: rgba($color: #000000, $alpha: 0.85);
        font-weight: 600;
        margin-right: 10px;
      }
      &:nth-child(2) {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        background: #E4E6F6;
        border-radius: 15px;
        i {
          font-size: 14px;
          color: #409EFF;
          margin-right: 5px;
        }
        span {
          font-size: 12px;
          color: #909399;
          margin-right: 5px;
          &:nth-child(3) {
            font-size: 14px;
            color: #606266;
            font-weight: 600;
          }
        }
      }
    }
  }
  .run-detail-wrapper {
    display: flex;
    justify-content: space-between;
    
    margin-top: 15px;
    .item-box {
      flex: 1;
      margin-right: 10px;
      background: #fff;
      padding: 15px 15px 0 15px;
      &:last-child {
        margin-right: 0;
      }
      .top {
        display: flex;
        border-bottom: 1px solid #E4E6F6;
        padding-bottom: 15px;
        &-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          color: #909399;
          >div:nth-child(2) {
            font-size: 20px;
            font-weight: 700px;
            color: rgba($color: #000000, $alpha: 0.85);
          }
          >div:nth-child(1) {
            > i {
              font-size: 14px;
              margin-right: 5px;
            }
          }
        }
        &-right {
          width: 80px;
        }
      }
      .bottom {
        height: 40px;
        line-height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div:first-child {
          > i {
            font-size: 14px;
            margin-right: 5px;
          }
          > span {
            font-size: 12px;
            color: #909399;
          }
        }
        > div:last-child {
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.85);
        }
      }
    }
  }
}
</style>
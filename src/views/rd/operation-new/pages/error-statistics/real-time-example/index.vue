<template>
  <div class="error-real-time-example">
    <div class="offline-stat mt-10 mb-10">
      <span>实时实例排行</span>
      <span>
        统计时间 <span class="ml-5">{{time}}</span>
      </span>
    </div>
     <div class="run-statistics-wrapper">
      <div class="run-statistics-left">
        <div
          :class="['item-wrapper', activeRunStatusTab === item.value ? 'active' : '']"
          v-for="item in runStatusList"
          :key="item.value"
          @click="selectRunStatus(item.value)"
        >
          <div class="item">
            <div>
              <i :class="['iconfont', item.icon]"></i>
              <span>{{item.label}}</span>
            </div>
            <div>
              {{item.desc}}
            </div>
          </div>
        </div>
        <div class="line" :style="{top: activeRunStatusTab === '1' ? '0' : 'calc((100% + 10px) / 2)'}"></div>
      </div>
      <div class="run-statistics-right">
        <div class="right-top-radio">
          <div class="">
            <span>排行列表</span>
          </div>
          <div>
            <el-button
              type="default"
              size="mini"
              class="ml-10">
                <i class="iconfont icon-biaodanliebiao"></i>
                查看注释
              </el-button>
              <el-button type="default" size="mini"> <i class="el-icon-download"></i> 下载csv</el-button>
          </div>
        </div>
        <div class="ranking-table">
          <RankingTable :tableDataList="tableDataList1" v-if="tableDataList1.length" :columns="columns"></RankingTable>
          <!-- <div class="tips" v-if="tableDataList1.length">
            <i class="iconfont icon-tip"></i>
            <span>仅所有taskrun状态为运行成功的节点纳入统计范围</span>
          </div> -->
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:100px" :image-size="300"></el-empty>
        </div>
      </div>
    </div>
    <div class="offline-stat mt-20 mb-20">
      <span>报警排行</span>
      <span>
        <el-button slot="reference">
          <i class="iconfont icon-biaodanliebiao"></i>
          查看注释
        </el-button>
        <el-button slot="reference">
          告警中心
        </el-button>
      </span>
    </div>
    <div class="wrapper mb-15">
      <div class="">
        <div class="title">业务延时过高报警</div>
        <div class="table-body">
          <RankingTable :tableDataList="tableDataList" v-if="tableDataList.length"></RankingTable>
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:100px" :image-size="300"></el-empty>
        </div>
      </div>
      <div class="">
        <div class="title">TPS超过范围报警</div>
        <div class="table-body">
          <RankingTable :tableDataList="tableDataList" v-if="tableDataList.length"></RankingTable>
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:100px" :image-size="300"></el-empty>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="">
        <div class="title">失败频率超过设置报警</div>
        <div class="table-body">
          <RankingTable :tableDataList="tableDataList" v-if="tableDataList.length"></RankingTable>
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:100px" :image-size="300"></el-empty>
        </div>
      </div>
      <div class="">
        <div class="title">数据滞留超过设置报警</div>
        <div class="table-body">
          <RankingTable :tableDataList="tableDataList" v-if="tableDataList.length"></RankingTable>
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:100px" :image-size="300"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RankingTable from '../tables.vue'
export default {
  name: 'RealTimeExample',
  components: {
    RankingTable
  },
  data() {
    return {
      time: '2020-01-01',
      runStatusList: [
        {
          icon: 'icon-shishijiankong',
          label: '失败次数统计',
          desc: '对于失败次数过高的节点，建议您检查对应任务配置，避免影响数据正常产出',
          value: '1'
        },
        {
          icon: 'icon-yunhangshichang',
          label: '延时时长统计',
          desc: '对于延时过长的节点，建议您检查对应任务配置，避免数据延时产出',
          value: '2'
        }
      ],
      activeRunStatusTab: '1',
      tableDataList1: [
        {
          index: 1,
          nodeName: '节点名称',
          runFailCount: 100,
          customValue: 100,
          resourceGroup: '当前负责人',
          priority: '最近操作人',
          currentOwner: '最近操作时间',
          id: 1
        }
      ],
      columns: [
         {
          label: '排名',
          prop: 'index',
          width: 60,
          type: 'index',
          slot: 'index'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          slot: 'nodeName'
        },
        {
          label: '实例失败次数',
          prop: 'runFailCount',
          width: 130,
          align: 'right'
        },
        {
          label: '当前负责人',
          prop: 'resourceGroup',
          width: 130,
        },
        {
          label: '最近操作人',
          prop: 'priority',
          width: 130
        },
        {
          label: '最近操作时间',
          prop: 'currentOwner',
          width: 130,
          align: 'right'
        }
      ],
      tableDataList: []
    }
  },
  methods: {
    selectRunStatus(value) {
      this.activeRunStatusTab = value
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss.scss';
.error-real-time-example {
  .offline-stat {
    >span:last-child {
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.7);
    }
  }
  .wrapper {
    display: flex;
    justify-content: space-between;
    >div {
      flex: 1;
      margin-right: 10px;
      padding: 10px 15px 15px 15px;
      background: #fff;
      &:last-child {
        margin-right: 0;
      }
      .title {
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.7);
        font-weight: 600;
        margin-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
        height: 40px;
        line-height: 40px;
      }
      .table-body {
        min-height: 420px;
      }
    }
  }
}
</style>
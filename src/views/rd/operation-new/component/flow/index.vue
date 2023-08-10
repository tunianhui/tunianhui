<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-08 18:15:25
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 16:49:08
 * @FilePath: \智能数据构建\src\views\rd\operation-new\component\flow\index.vue
-->
<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-08 18:15:25
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-16 11:11:39
 * @FilePath: \dataphin\src\views\rd\operation-new\component\flow\index.vue
-->
<template>
  <div class="flow-wrapper" v-loading="loading">
    <div class="bg-text">生产数据运维，请谨慎操作</div>
    <div class="flow" ref="flow"></div>
    <div class="search-node">
      <div class="expand mr-10">
        <span class="mr-5">展开次数</span>
        <span>
          <el-select v-model="expandNum" placeholder="请选择" style="width: 60px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="mr-10">
        <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="请搜索节点ID或名称"></el-input>
      </div>
      <div>
        <el-button @click="refreshHandle">
          <i class="el-icon-refresh-right"></i>
        </el-button>
      </div>
    </div>
    <div class="bottom-node-info" v-if="currentNode">
      <div class="left-info">
        <div class="ont">
          <div class="top">
            <span>节点名称</span>
            <OverflowTooltip style="width: calc(100% - 90px)">{{currentNode.name}}</OverflowTooltip>
            <i class="iconfont icon-ziyuan2" style="color:#3964D8"></i>
          </div>
          <div class="bottom">
            <span>节点ID</span>
            <OverflowTooltip style="width: calc(100% - 90px)">{{currentNode.id}}</OverflowTooltip>
            <i class="iconfont icon-ziyuan2" style="color:#3964D8"></i>
          </div>
        </div>
        <el-divider direction="vertical" class="divider"></el-divider>
        <div class="two">
          <div class="top">
            <span>所属项目</span>
            <!-- <span class="tag mr-5">PROD</span> -->
            <OverflowTooltip style="width: calc(100% - 130px)">{{currentNode.project}}</OverflowTooltip>
          </div>
          <div class="bottom">
            <span>负责人</span>
            <OverflowTooltip style="width: calc(100% - 70px)">{{currentNode.user_name}}</OverflowTooltip>
          </div>
        </div>
        <el-divider direction="vertical" class="divider"></el-divider>
        <div class="three">
          <div class="top">
            <template v-if="pageType === 'cycle' || pageType === 'manual'">
              <span style="width:110px">最近更新时间</span>
              <OverflowTooltip style="width: calc(100% - 70px)">
                {{currentNode.update_time}}
              </OverflowTooltip>
            </template>
            <template v-if="pageType === 'cycleInstance' || pageType === 'manualInstance'">
              <span>运行时间</span>
              <span class="mr-20">{{currentNode.duration}}</span>
              <span class="mr-10">运行状态</span>
              <span>
                <i :class="[nodeStatusIcon[currentNode.state]]" :style="{color: nodeStatusColors[currentNode.state]}"></i>
                {{nodeStatus[currentNode.state]}}
              </span>
            </template>
            
          </div>
          <div class="bottom">
            <!-- <span>优先级</span>
            <span>高</span> -->
            <!-- <span class="mr-15">运行状态</span> -->
            <span></span>
          </div>
        </div>
      </div>
      <div class="right-btn">
        <el-button @click="viewNodeDetail">
          查看节点详情
        </el-button>
      </div>
    </div>
    <div class="bottom-menu">
      <div class="graph-zoom pr-5">
        <span>{{zoom}}</span>
        <span>%</span>
      </div>
      <div class="el-icon-zoom-in pr-5 pl-5" @click="zoomIn"></div>
      <div class="el-icon-zoom-out pr-5 pl-5" @click="zoomOut"></div>
      <div class="iconfont icon-shiyinghuabu pl-5 pr-5" @click="fitView"></div>
    </div>
    <NodeDetaillayout v-if="showDetail" @close="showDetail = false" :tabs="tabs">
      <NodeDetail slot="detail" :pageType="pageType" :currentNode="currentNode"></NodeDetail>
      <RunLog slot="runLog"></RunLog>
    </NodeDetaillayout>
  </div>
</template>

<script>
import flow from './flow'
import OverflowTooltip from '@c/overflow-tooltip'
import NodeDetaillayout from './node-detail-layout.vue'
import NodeDetail from './node-detail.vue'
import RunLog from './run-log.vue'
import { nodeStatus, nodeStatusIcon, nodeStatusColors } from './config'
export default {
  name: 'FlowWrapper',
  mixins: [flow],
  components: {
    OverflowTooltip,
    NodeDetaillayout,
    NodeDetail,
    RunLog
  },
  data() {
    return {
      nodeStatus,
      nodeStatusIcon,
      nodeStatusColors,
      expandNum: 1,
      options: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 4 },
      ],
      keyword: '',
      showDetail: false,
      tabs: [
        { label: '节点详情', value: 'detail' },
        { label: '运行日志', value: 'runLog' },
        { label: '操作日志', value: 'handLog' },
        { label: '物化代码', value: 'code' },
      ]
    }
  },
  mounted() {
  },
  methods: {
    refreshHandle() {},
    zoomIn() {},
    zoomOut() {},
    fitView() {},
    viewNodeDetail() {
      this.showDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
  display: flex;
  background: #F9F9F9;
  .bg-text {
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 60px;
    transform: translateX(-50%);
    color: $grey5;
  }
  .flow {
    width: 100%;
    height: 100%;
    flex: 1;
  }
  .search-node {
    position: absolute;
    top: 0px;
    right: 0;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 10px 20px;
    background: #fff;
    .expand {
      > span {
        color: rgba($color: #000000, $alpha: 0.7);
      }
    }
    ::v-deep {
      .el-input__inner {
        border-radius: 0;
        border: none;background: #F8F8FA;
      }
      .el-button {
        border-color: #3964D8;
        background: #fff;
        border-radius: 0;
        padding: 6px 10px;
        font-size: 14px;
        color: #3964D8;
        &:hover {
          background: rgba($color: #3964D8, $alpha: 0.09);
        }
      }
    }
  }
  .bottom-menu {
    position: absolute;
    height: 40px;
    border-top: 1px solid #DBDBDB;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.7);
    background: #F9F9F9;
    > div:not(:first-child) {
      cursor: pointer;
    }
  }
  .bottom-node-info {
    position: absolute;
    bottom: 40px;
    background: #fff;
    width: 100%;
    // height: 100px;
    left: 0;
    box-shadow: -10px 0 10px transparent,0 -5px 13px rgba(0,0,0,0.15),10px 0 10px transparent,0 10px 10px transparent;
    display: flex;
    .right-btn {
      width: 150px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      ::v-deep {
        .el-button {
          border-radius: 0;
          color: #fff;
          background: #3964D8;
          border-color: #3964D8;
        }
      }
    }
    .left-info {
      flex: 1;
      width: 0;
      display: flex;
      > div:not(.divider) {
        flex: 1;
        width: 0;
        font-size: 13px;
        color: rgba($color: #000000, $alpha: 0.9);
        .top, .bottom {
          padding: 10px;
          display: flex;
          align-items: center;
          > span:first-child {
            display: inline-block;
            width: 80px;
            text-align: left;
          }
          > i {
            font-size: 14px;
            cursor: pointer;
          }
          .tag {
            display: inline-block;
            text-align: center;
            padding: 3px 0px;
            background: #F5F1FF;
            border: 1px solid #9772FF;
            font-size: 12px;
            color: #9772FF;
            width: 55px;
          }
        }
        
      }
      ::v-deep {
        .divider {
          height: calc(100% - 20px);
          margin: 10px 8px;
        }
      }
    }
  }
}
</style>
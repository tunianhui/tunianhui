<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-11 11:20:25
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-11 14:00:34
 * @FilePath: \数据智能构建\src\views\asset\standard-new\assess\rule\log.vue
-->
<template>
  <div class="rule-log">
    <el-breadcrumb separator-class="el-icon-arrow-right" ref="breadcrumb" class="mb-15" style="height:15px">
      <el-breadcrumb-item @click.native="black"><a href="javascripr:;" style="font-weight:600;color:#66b1ff" >落标映射规则</a></el-breadcrumb-item>
      <el-breadcrumb-item>运行日志</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="rule-info-title">
      <div class="rule-info-title-left">
        <div class="rule-info-title-left-icon">
          <i class="iconfont icon-gongnengquanxianguanli"></i>
          <p>落标映射规则</p>
        </div>
      </div>
      <div class="rule-info-title-right">
        <div class="title">规则映射1</div>
        <div>
          <div class="form-item">
            <div class="form-item-label">标准集</div>
            <div class="form-item-content">数据标准1</div>
          </div>
          <div class="form-item">
            <div class="form-item-label">执行方式</div>
            <div class="form-item-content">定时 每日 11:24</div>
          </div>
          <div class="form-item">
            <div class="form-item-label">负责人</div>
            <div class="form-item-content">1356665588</div>
        </div>
        </div>
      </div>
    </div>
    <div class="detail-info">
      <div class="left">
        <div :class="['item', activeIndex === index ? 'active' : '']" v-for="(item, index) in listLog" :key="item.id" @click="handleClick(item, index)">
          <div class="item-top">
            <div>
              <i class="iconfont icon-yuanxingxuanzhong-fill-copy"></i>
              <span>成功</span>
            </div>
            <div>
              <i class="iconfont icon-gengxin"></i>
              <span>刷新</span>
            </div>
          </div>
          <div>
            {{item.starttime}} ~
          </div>
          <div>
            {{item.endtime}}
          </div>
          <div>
            运行时长 {{item.runtime}}
          </div>
        </div>
      </div>
      <div class="right">
        <MonacoEditor
          :has-bottom-tools="true"
          :minimap="false"
          :readonly="true"
          :code.sync="curCode"
          theme="light"
          ref="monacoEditor"
        ></MonacoEditor>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleLog',
  props: {
    title: String
  },
  data () {
    return {
      activeIndex: 0,
      listLog: [
        {
          id: 1,
          starttime: '2023-02-05 11:25:16',
          endtime: '2023-02-05 11:25:16',
          runtime: '0.00s',
        },
        {
          id: 2,
          starttime: '2023-02-05 11:25:16',
          endtime: '2023-02-05 11:25:16',
          runtime: '0.00s',
        }
      ],
      curCode: `2017-12-18T14:02:40.623+0800 I NETWORK  [conn7] received client metadata from 127.0.0.1:4316 conn7: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:19:01.126+0800 I NETWORK  [conn8] received client metadata from 127.0.0.1:5160 conn8: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:36:28.502+0800 I NETWORK  [conn14] received client metadata from 127.0.0.1:7607 conn14: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:37:52.415+0800 I COMMAND  [conn6] command movie.movies appName: "MongoDB Shell" command: insert { insert: "movies", documents: [ { _id: ObjectId('5a376240a682ad26b066c0cf'), name: "movie" } ], ordered: true } ninserted:1 keysInserted:1 numYields:0 reslen:29 locks:{ Global: { acquireCount: { r: 3, w: 3 } }, Database: { acquireCount: { w: 2, W: 1 } }, Collection: { acquireCount: { w: 2 } } } protocol:op_command 206ms
2017-12-18T14:40:50.086+0800 I NETWORK  [conn15] received client metadata from 127.0.0.1:8196 conn15: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:42:00.328+0800 I NETWORK  [conn16] received client metadata from 127.0.0.1:8362 conn16: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:42:31.401+0800 I NETWORK  [conn17] received client metadata from 127.0.0.1:8445 conn17: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }
2017-12-18T14:45:06.681+0800 I NETWORK  [conn18] received client metadata from 127.0.0.1:8788 conn18: { driver: { name: "nodejs", version: "2.2.33" }, os: { type: "Windows_NT", name: "win32", architecture: "x64", version: "10.0.16299" }, platform: "Node.js v8.9.0, LE, mongodb-core: 2.1.17" }`
    }
  },
  methods: {
    handleClick (item, index) {
      this.activeIndex = index
    },
    black () {
      this.$router.push({ path: '/asset/standard-new/assess/rule' })
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-log {
  padding: 15px;
  width: 100%;
  height: 100%;
  background: #F7FAF9;
  .rule-info-title {
    width: 100%;
    height: 110px;
    background: #fff;
    border-radius: 0px;
    // box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
    // padding: 10px 15px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .rule-info-title-left {
      display: flex;
      align-items: center;
      .rule-info-title-left-icon {
        width: 100px;
        height: 110px;
        background: #66b1ff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        i {
          color: #fff;
          font-size: 22px;
        }
        p {
          font-size: 14px;
          color: #F7FAF9;
          margin-top: 8px;
        }
      }
    }
    .rule-info-title-right {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 10px;
      }
      >div:last-child {
        display: flex;
        .form-item {
          display: flex;
          font-size: 14px;
          margin-right: 15px;
          .form-item-label {
            margin-right: 10px;
            color: rgba($color: #000000, $alpha: 0.5);
          }
          .form-item-content {
            color: rgba($color: #000000, $alpha: 0.8);
          }
        }
      }
    }
  }
  .detail-info {
    height: calc(100% - 155px);
    display: flex;
    .left {
      height: 100%;
      overflow: overlay;
      width: 180px;
      .item {
        padding: 5px 8px;
        position: relative;
        background: #fff;
        margin-bottom: 5px;
        cursor: pointer;
        &.active::before {
          position: absolute;
          width: 3px;
          height: 100%;
          background: #66b1ff;
          content: '';
          left: 0;
          top: 0;
        }
        .item-top {
          display: flex;
          align-items: center;
          height: 22px;
          justify-content: space-between;
          font-size: 12px;
          i {
            font-size: 14px;
            margin-right: 3px;
          }
          > div:first-child {
            cursor: pointer;
            i {
              color: chartreuse;
            }
          }
          >div:last-child {
            cursor: pointer;
            i {
              color: #66b1ff;
            }
          }
        }
        > div:nth-child(2), > div:nth-child(3), > div:nth-child(4) {
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.7);
          margin-bottom: 2px;
        }
      }
    }
    .right {
      flex: 1;
      width: 0;
    }
  }
}

</style>
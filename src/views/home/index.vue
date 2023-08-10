<template>
  <el-row class="home" :gutter="10" v-loading="!!loading">
    <el-col :md="10" :sm="24" :xs="24">
      <img src="@/assets/images/home/home-proc.gif" width="100%" height="100%" alt />
    </el-col>
    <el-col :md="8" :sm="12" :xs="24">
      <List></List>
    </el-col>
    <el-col :md="6" :sm="12" :xs="24">
      <div class="briefs flex-column">
        <div class="ops h-brief">
          <h4 class="clearfix">
            <span class="fl">调度运维</span>
            <router-link class="fr" to="/rd/ops">
              进入
              <i class="el-icon-d-arrow-right"></i>
            </router-link>
          </h4>
          <div class="ops-list">
            <div class="ops-item" v-for="item in opsList" :key="item.key">
              <p class="text-ellipsis">
                <i :class="taskRunningStatusIcon[item.key]" :style="{color: item.color}"></i>
                {{item.name}}
              </p>
              <p>
                <a href="javascript:;" @click="toOps(item)">
                  <strong>{{item.count}}</strong>
                </a>
              </p>
              <!-- <p>全局设置</p> -->
              <p>全局:{{item.wholeCount}}</p>
            </div>
          </div>
        </div>
        <div class="project h-brief">
          <h4>项目空间</h4>
          <div class="h-p-list">
            <div
              class="h-p-item"
              v-for="p in projectList"
              :key="p.project_id"
              @click.stop="toDev(p)"
            >
              <p class="clearfix">
                <a class="fl" href="javascript:;">
                  <strong>{{p.project_name}}</strong>
                </a>
                <!-- query -->
                <a class="fr" href="javascript:;" @click.stop="toProManage(p)">
                  <i class="el-icon-setting"></i>
                </a>
              </p>
              <p>描述：{{p.project_descr}}</p>
              <p class="clearfix">
                <span class="fl">
                  <i class="iconfont icon-chakan1"></i>
                  {{p.project_user_count}}人
                </span>
                <span class="fr">
                  <i class="iconfont icon-guanliyuan" :style="{color: $styleVars.user}"></i>
                  <OverflowTooltip :width="80">{{p.created_by}}</OverflowTooltip>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="quick-start h-brief" ref="quickStart">
          <h4 ref="quickStartH">快速入门</h4>
          <video ref="quickStartVideo" src="@/assets/videos/quick-start.mp4" controls></video>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import List from './list'
import {taskRunningStatusIcon} from '@/config/dics'
import {on, off} from '@/libs/dom'
import {listJobCount} from '@/api/home'
// import {getTableList} from '@/api/plan/project-manage'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'

export default {
  name: 'Home',
  components: {
    List,
    OverflowTooltip
  },
  data() {
    return {
      // accountTypesIcon,
      // accountTypes,
      taskRunningStatusIcon,
      opsList: [
        {
          key: 'waitRun',
          count: 0,
          wholeCount: 0,
          name: '未运行',
          color: this.$styleVars.waitRun
        },
        {
          key: 'running',
          count: 0,
          wholeCount: 0,
          name: '运行中',
          color: this.$styleVars.running
        },
        {
          key: 'fail',
          count: 0,
          wholeCount: 0,
          name: '失败',
          color: this.$styleVars.error
        },
        {
          key: 'success',
          count: 0,
          wholeCount: 0,
          name: '成功',
          color: this.$styleVars.success
        }
      ],
      loading: 0
    }
  },
  computed: {
    ...mapGetters(['projectList'])
  },
  mounted() {
    this.getOptData()
    this.getProjectList()
    on(window, 'resize', this.setLayout)
  },
  beforeDestroy() {
    off(window, 'resize', this.setLayout)
  },
  methods: {
    ...mapMutations({
      setProject: 'SET_PROJECT'
    }),
    ...mapActions(['getProjectList']),
    setLayout() {
      this.$refs.quickStartVideo.style.height =
        this.$refs.quickStart.clientHeight -
        this.$refs.quickStartH.clientHeight -
        25 +
        'px'
    },
    toOps(data) {
      this.$router.push({path: '/rd/ops/instance/period'})
    },
    toDev(data) {
      this.$router.push({path: '/rd/dev'})
      this.setProject(data)
    },
    toProManage(data) {
      this.$router.push({
        name: 'project-manage',
        params: data
      })
    },
    async getOptData() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        listJobCount(),
        '获取调度运维数据失败'
      )
      if (res && res.data) {
        this.opsList.forEach(item => {
          item.count = res.data[item.key]
          item.wholeCount = res.data[`${item.key}_qj`]
        })
      }
      this.loading--
    }
    // async getProData() {
    //   this.loading++
    //   const res = await this.$simpleAsyncTo(
    //     getTableList({
    //       pageNo: 1,
    //       pageSize: 3
    //     }),
    //     '获取项目数据失败'
    //   )
    //   if (res) {
    //     this.proList = res.data
    //     await this.$sleep(30)
    //     this.setLayout()
    //   }
    //   this.loading--
    // }
  }
}
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  padding: 10px;
  // min-height: 520px;
  overflow: auto;
  background-color: $grey7;
  margin: 0 !important;

  .el-col {
    // height: 714px;
    height: 100%;
    min-height: 714px;
  }

  .briefs {
    height: 100%;
    .quick-start {
      flex: 1;

      video {
        width: 100%;
        height: 172px;
      }
    }
  }

  .h-brief {
    padding: 10px;
    background-color: $grey10;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 8px;
      color: $grey2;
    }
  }
  .ops {
    h4 {
      .fr {
        font-size: 12px;
        color: $grey4;
        &:hover {
          color: $grey2;
        }
      }
    }
    &-list {
      display: flex;

      .ops-item {
        flex: 1;
        text-align: center;

        p {
          font-size: 12px;
          color: $grey4;
          strong {
            font-size: 24px;
            line-height: 5.5vh;
            color: $grey3;
          }
          &:first-child {
            font-size: 13px;
            color: $grey3;
            margin-top: 5px;
          }
          &:last-child {
            font-size: 14px;
          }
        }
      }
    }
  }

  .project {
    min-height: 245px;
    .h-p-list {
      height: calc(100% - 39px);
      overflow: auto;
    }
    .h-p-item {
      background-color: $grey8;
      padding: 10px;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 10px;
      }

      p {
        font-size: 12px;
        color: $grey4;

        strong {
          color: $grey2;
          font-size: 14px;
          line-height: 24px;
        }

        &:first-child {
          .fr {
            color: $grey4;

            &:hover {
              color: $grey2;
            }
          }
        }
        &:nth-child(2) {
          color: $grey4;
          height: 32px;
          @include lineClamp(2);
        }
        &:last-child {
          margin-top: 3px;

          i.iconfont {
            font-size: 14px;
          }
          .fl {
            i {
              vertical-align: baseline;
            }
          }
          .fr {
            width: 100px;
          }
        }
      }
    }
  }
}
</style>

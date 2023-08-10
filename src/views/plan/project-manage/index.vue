<template>
  <div class="project-manage">
    <div class="project-manage-top mb-20">
      <div class="mb-20">
        <h2>项目管理</h2>
        <!-- <el-tabs v-model="activeName">
          <el-tab-pane :label="'已加入('+ num+')'" name="0">
          </el-tab-pane>
          <el-tab-pane :label="'全部('+proiect_total+')'" name="1"></el-tab-pane>
        </el-tabs>-->
      </div>
      <div class="header-list space-between">
        <div class="hl">
          <span>
            当前计算引擎：
            <i class="mr-10">MaxCompute</i>
            <a href="javascript:;">修改</a>
          </span>
        </div>
        <div class="hr flex-layout">
          <div class="flex-layout mr-20">
            <!-- <el-select v-model="ProiectType" placeholder="请选择" class="mr-10" @change="filterChange">
              <el-option
                v-for="item in ProiectTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
            <el-input
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
              class="mr-10"
              v-model="searchKeyword"
              @input="filterChange"
            ></el-input>
            <el-button @click="newBuildProject('add')">
              <i class="icon iconfont icon-jiahao"></i>&nbsp;新建项目
            </el-button>
          </div>
          <div class="mr-10 flex-layout">
            <div class="sort">排序：</div>
            <div class="sort-type flex-layout">
              <div
                :class="['info-item', 'text-center', 'mr-10', sort_value===index?'active':'']"
                v-for="(item, index) in sortType"
                :key="item.value"
                @click="sortHandle(item.value)"
              >
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已加入项目 -->
    <div class="content">
      <!-- <div class="join pl-20">已加入项目
        <span class="mr-20">(2)</span>
        <i :class="is_show_join?'el-icon-arrow-up':'el-icon-arrow-down'" @click="is_show_join=!is_show_join"></i>
      </div>-->
      <div class="content-list pt-20" v-if="is_show_join">
        <el-row class="content flex-layout" v-loading="!!loading">
          <el-col :span="6" v-for="item in ProjectList" :key="item.id" class="content-item mb-15">
            <div class="grid-content bg-purple">
              <div class="main">
                <!-- <div class="tag">
                <span class="mr-10">测试</span>
                </div>-->
                <div class="name clearfix">
                  <div class="fl width">
                    <OverflowTooltip class="width">
                      {{ item.project_name }}
                    </OverflowTooltip>
                  </div>
                  <div class="fr" style=" cursor: pointer;" @click="deleteProjectHandle(item.id)">
                    <i
                      class="el-icon-delete font-14"
                      style="font-size:0.1vh;margin-right:5px;"
                    ></i>
                  </div>
                </div>
                <div class="unit">
                  <label>业务板块：</label>
                  <a
                    href="#"
                    @click="$router.push({ name: 'business', params: { project_id: item.id } })"
                  >
                    <OverflowTooltip class="width">
                      {{ item.busin_name }}
                    </OverflowTooltip>
                  </a>
                </div>
                <div class="member clearfix">
                  <!-- <span class="mr-15 fl">{{ item.liable_info }}</span> -->
                  <OverflowTooltip class="width">
                    {{ item.liable_info }}
                  </OverflowTooltip>
                  <span class="fr">
                    <!-- <span>等</span>
                  <a href="#" class="mr-10 ml-10" @click="memberManageClick(item.id)">{{item.member_num}}</a>
                    <span>人</span>-->
                  </span>
                </div>
                <div class="engine">
                  <label>计算引擎：</label>
                  <OverflowTooltip class="width">
                    {{ item.engine_name }}
                  </OverflowTooltip>
                </div>
                <div class="creation-time">
                  <label>创建时间：</label>
                  <OverflowTooltip class="width">
                    {{ item.create_time }}
                  </OverflowTooltip>
                  <span></span>
                </div>
                <div class="update-time">
                  <label>更新时间：</label>
                  <OverflowTooltip class="width">
                    {{ item.create_time }}
                  </OverflowTooltip>
                </div>
                <div class="btn">
                  <el-button plain @click="newBuildProject('edit', item)">信息设置</el-button>
                  <el-button plain @click="memberManageClick(item)">成员管理</el-button>
                </div>
                <el-button plain @click="workarea(item)" class="mt-5 enter-btn">进入工作区</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 成员管理 -->
    <MemberManage v-if="is_member_manage" @closeMemberManage="closeMemberManage" :project="projectInfo"></MemberManage>
    <!-- 新建项目/信息设置 -->
    <AddEditDialog v-if="is_display" @close="close" :projectData="projectData"></AddEditDialog>
  </div>
</template>

<script>
import MemberManage from './member-manage'
import AddEditDialog from './add-edit-dialog'
import {getTableList, deleteProject} from '@/api/plan/project-manage'
import {types} from '@/config/rd-config'
import pager from '@/mixins/pager'
import {mapMutations, mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'ProjectManage',
  components: {
    MemberManage,
    AddEditDialog,
    OverflowTooltip
  },
  mixins: [pager],
  data() {
    return {
      activeName: '0',
      num: 2,
      proiect_total: null,
      AlreadyAdd: [],
      is_display: false,
      is_member_manage: false,
      projectData: {},
      ProjectList: [],
      loading: 0,
      is_show_join: true,
      ProiectType: null, // 选中的项目类型
      searchKeyword: null, // 搜索关键字
      ProiectTypeOptions: [], // 项目类型
      projectInfo: {}, // 项目id/名称
      sortType: [
        {value: 0, label: '添加日期'},
        {value: 1, label: '名称'},
        {value: 2, label: '英文名'}
      ],
      sort_value: 0
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this.searchKeyword = this.$route.params.project_name || ''
    this.getTableList()
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setProject: 'SET_PROJECT'
    }),
    // 项目列表
    async getTableList() {
      this.loading++
      const params = {project_name: this.searchKeyword}
      const res = await this.$simpleAsyncTo(
        getTableList(params),
        '获取项目列表失败'
      )
      if (res) {
        this.proiect_total = res.totalRecords
        this.total = res.totalRecords
        this.ProjectList = res.data
        this.ProjectList.sort(function(a, b) {
          return Date.parse(b.created_date) - Date.parse(a.created_date)
        })
        this.loading--
      }
    },
    // 搜索项目
    filterChange(val) {
      this.searchKeyword = val
      this.getTableList()
    },
    // 区分新增/编辑项目
    newBuildProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_display = true
        this.projectData = v
      } else {
        this.is_display = true
        this.projectData = v
      }
    },
    // 成员管理
    memberManageClick(item) {
      this.is_member_manage = true
      this.projectInfo = {project_id: item.id, project_name: item.project_name}
    },
    workarea(item) {
      this.setProject(item.id)
      // this.$router.push()
      this.$router.push({name: types.DIMENSION, params: {project_id: item.id}})
    },
    // 排序
    sortHandle(index) {
      this.sort_value = index
    },
    // 关闭新增与编辑弹窗
    close(fn) {
      this.is_display = false
      if (fn && fn === 'refresh') {
        this.getTableList()
      }
    },
    // 关闭成员管理弹窗
    closeMemberManage(fn) {
      this.is_member_manage = false
      if (fn && fn === 'refresh') {
        this.getTableList()
      }
    },
    // 删除项目
    deleteProjectHandle(id) {
      this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.globalLoading()
        const res = await this.$simpleAsyncTo(deleteProject({id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableList()
        }
        this.globalLoading().close()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.globalLoading().close()
      })
    }
  }
}
</script>

<style lang="scss">
.project-manage {
  overflow-x: auto;
  height: 100%;
  min-width: 1100px;
  .project-manage-top {
    .header-list {
      line-height: 28px;
      font-size: 12px;
      .hr {
        .sort-type {
          .info-item {
            color: $grey4;
            cursor: pointer;
            &.active {
              color: $grey2;
            }
          }
          div:nth-child(2) {
            span {
              padding: 0 10px;
              position: relative;
              &::before,
              &::after {
                content: '';
                border-right: 1px solid $grey4;
                position: absolute;
                top: 50%;
                margin-top: -6px;
                width: 0px;
                height: 12px;
              }
              &::after {
                right: 0;
              }
              &::before {
                left: 0;
              }
            }
          }
        }
      }
    }
  }
  .content {
    .join {
      width: 100%;
      height: 60px;
      background-color: $grey8;
      line-height: 60px;
    }
  }
}
.project-manage {
  .content {
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: $grey8;
    // padding: 0 10px;
    box-sizing: border-box;
    .content-item {
      /* width: 33.333333333%; */
      padding: 0 10px;
      box-sizing: border-box;
      .bg-purple {
        background: $grey10;
      }
      .main {
        padding: 10px 10px;
        font-size: 12px;
        box-sizing: border-box;
        > div {
          padding: 6px 0;
          label {
            color: rgba(0, 0, 0, 0.5);
          }
          .width {
            width: calc(100% - 60px);
          }
        }
        .tag {
          width: 100%;
          height: 40px;
          line-height: 40px;
          span {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            border: 1px solid $waitRun;
            border-right: none;
            color: $waitRun;
            background: $grey10;
            padding-left: 5px;
            box-sizing: border-box;
            overflow: hidden;
            &::before {
              content: '';
              position: absolute;
              top: 0;
              right: -15px;
              height: 21px;
              width: 21px;
              border: 1px solid $waitRun;
              border-color: transparent transparent $waitRun $waitRun;
              transform: rotate(45deg);
              background: $grey10;
            }
          }
        }
        .btn {
          display: flex;
          justify-content: space-between;
          .el-button {
            border-color: $--color-primary;
            color: $--color-primary;
            border-radius: 0;
            flex: 1;
          }
        }
        .enter-btn {
          background: $--color-primary;
          color: $grey10;
          border-radius: 0;
          width: 100%;
        }
      }
    }
  }
}
</style>

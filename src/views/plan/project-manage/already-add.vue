<template>
  <div class="already-add no-hover">
      <el-row :gutter="20" class="content flex-layout">
        <el-col :span="6" v-for="item in ProjectList" :key="item.id" class="content-item mb-15">
          <div class="grid-content bg-purple">
            <div class="main">
              <div class="tag">
                <span class="mr-10">测试</span>
              </div>
              <div class="name">{{ item.project_name }}</div>
              <div class="unit">
                <label>业务模块：</label>
                <span>尚未绑定，</span><a href="#">点击绑定</a>
              </div>
              <div class="member">
                <label>项目成员：</label>
                <span class="mr-15">{{ item.project_role_list[0] }}</span>
                <span>
                  <span>等</span>
                  <a href="#" class="mr-10 ml-10">{{ item.project_role_list.length }}</a>
                  <span>人</span>
                </span>
              </div>
              <div class="engine">
                <label>计算引擎：</label>
                <span>{{ item.engine_name }}</span>
              </div>
              <div class="creation-time">
                <label>创建时间：</label>
                <span>{{ item.created_date }}</span>
              </div>
              <div class="update-time">
                <label>更新时间：</label>
                <span>{{ item.updated_date }}</span>
              </div>
              <div class="btn">
                <el-button plain @click="editProiectInfo('edit', item)">信息设置</el-button>
                <el-button plain @click="MemberManageVisible=true">成员管理</el-button>
              </div>
            </div>
            <div class="line mt-10"></div>
            <div class="link">
              <span class="fl ml-10"><i></i><a href="">超级管理员</a></span>
              <span class="fr mr-15"><a href="">进入工作区 》</a></span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageFilters.pageNo"
            :page-sizes="pageSizes"
            :page-size="pageFilters.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    <!-- 成员管理 -->
    <el-dialog  :visible.sync="MemberManageVisible">
      <div slot="title" class="header flex-layout">
        <div class="title flex-1">
          <span class="mr-15">成员管理：</span>
          <span>cus_test_003(cus_test_003)</span>
        </div>
        <div class="search-add flex-1">
          <el-input prefix-icon="el-icon-search" placeholder="请输入成员名" class="mr-15" style="width:50%" v-model="member_name"></el-input>
          <el-button icon="el-icon-plus">添加成员</el-button>
        </div>
      </div>
      <el-table :data="MemberData">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="name" label="成员名" width="120" sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column property="role" label="角色" width="150">
          <template slot="header">
            <span>角色<i class="el-icon-info ml-10"></i></span>
          </template>
          <!-- <template slot-scope="scope">
            {{scope.row.role}}
          </template> -->
        </el-table-column>
        <el-table-column property="add_people" label="添加人" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column property="add_date" label="添加日期" width="200" sortable></el-table-column>
        <el-table-column property="update_date" label="修改日期" width="200" sortable></el-table-column>
        <el-table-column
          label="操作"
          width="60">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, tableData)" style="font-size:16px;"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <el-checkbox class="mr-15 ml-15">全选</el-checkbox>
        <span class="del"><i class="el-icon-delete"></i><span>批量删除</span></span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="MemberManageVisible = false">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'AlreadyAdd',
  props: {
    AlreadyAdd: {
      type: Array
    }
  },
  mixins: [pager],
  data() {
    return {
      ProjectList: [], // 已加入项目列表
      MemberManageVisible: false,
      member_name: '',
      total: 0,
      MemberData: [// 成员管理
        {
          name: 'cus_test_003@dataphin',
          role: '开发',
          add_people: 'hdl_super_user@dataphin',
          add_date: '2019-06-10 20:00:03',
          update_date: '2019-06-10 20:00:03'
        },
        {
          name: 'cus_test_003@dataphin',
          role: '开发',
          add_people: 'hdl_super_user@dataphin',
          add_date: '2019-06-10 20:00:03',
          update_date: '2019-06-10 20:00:03'
        }
      ]
    }
  },
  watch: {
    AlreadyAdd(v) {
      this.ProjectList = v
    }
  },
  methods: {
    deleteRow() {},
    editProiectInfo(flag, v) {
      this.$parent.newBuildProject(flag, v)
    }
  }
}
</script>
<style lang="scss">
.already-add{
  .content {
    flex-wrap: wrap;
    justify-content: flex-start;
    .content-item{
      width: 20%;
      .bg-purple {
        background: $grey8;
      }
      .main{
        padding: 0 10px;
        >div {
          padding: 6px 0;
          font-size: 14px;
          label{
            color: rgba(0,0,0,.5);
          }
        }
        .tag {
          width: 100%;
          height: 40px;
          line-height: 40px;
          span{
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
            &::before{
              content: "";
              position: absolute;
              top: 0;
              right: -15px;
              height: 21px;
              width: 21px;
              border: 1px solid $waitRun;
              border-color: transparent transparent $waitRun $waitRun;
              transform: rotate(45deg);
              background: $grey8;
            }
          }
        }
        .btn {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .el-button{
            border-color:$--color-primary;
            color: $--color-primary;
            border-radius: 0;
            flex: 1;
          }
        }
      }
      .line {
        width: 100%;
        height: 0;
        border-top: 1px solid #d9d9d9;
      }
      .link {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        a {
          color: rgba(0,0,0,.5);
        }
      }
    }
  }
  .operation {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-top: 2px;
    background-color: $grey10;
    box-shadow: 0 -1px 2px $grey6;
    .del{
      cursor: pointer;
      >span{
        margin-left: 5px;
      }
    }
  }
}
</style>

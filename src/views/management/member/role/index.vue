<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-14 10:34:54
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 09:16:50
 * @FilePath: \智能数据构建\src\views\management\member\role\index.vue
-->
<template>
  <div class="role-manage">
    <template v-if="activePage === 'home'">
      <TabsHeader
        :tabs="tabs"
        :active="activeTab"
        :title="'项目角色管理'"
        class="mb-10"
        @tab-click="handleTabClick"
        height="40px"
      >
        <template #right>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addCustomRole">
            新增自定义项目角色
          </el-button>
        </template>
      </TabsHeader>
      <div class="table-wrapper">
        <el-table :data="tableDataNull" style="width: 100%" class="header-table">
          <el-table-column prop="date" label="项目角色" width="280px"></el-table-column>
          <el-table-column prop="name" label="是否启用" width="100px"></el-table-column>
          <el-table-column prop="address" label="角色说明"></el-table-column>
          <el-table-column label="操作" width="120px"></el-table-column>
        </el-table>
        <div class="table-body">
          <div class="table-title" :style="{'background-image': `url(${require('@/assets/images/bg.png')})`}">系统角色</div>
          <el-table :data="tableDataWin" style="width: 100%" :show-header="false">
            <el-table-column prop="name" label="项目角色" width="280px">
              <template slot-scope="scoped">
                <div>
                  <i :class="[scoped.row.icon, 'mr-10']" :style="{color: scoped.row.color, 'font-size': '16px'}"></i>
                  <span>{{scoped.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isUse" label="是否启用" width="100px">
              <template slot-scope="scoped">
                <el-switch
                  v-model="scoped.row.isUse"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="val => handleSwitchChange(val, scoped.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="roleExplain" label="角色说明"></el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="text" size="mini"
                  @click="handleEdit(scope.$index, scope.row)">
                  <i class="iconfont icon-shujutancha"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">
                  <i class="el-icon-link"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.$index, scope.row)">
                  <i class="el-icon-copy-document"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-title" :style="{'background-image': `url(${require('@/assets/images/bg2.png')})`}">自定义角色</div>
          <el-table :data="tableDataCustom" style="width: 100%" :show-header="false">
            <el-table-column prop="name" label="项目角色" width="280px">
              <template slot-scope="scoped">
                <div>
                  <i :class="[scoped.row.icon, 'mr-10']" :style="{color: scoped.row.color, 'font-size': '16px'}"></i>
                  <span>{{scoped.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isUse" label="是否启用" width="100px">
              <template slot-scope="scoped">
                <el-switch
                  v-model="scoped.row.isUse"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="val => handleSwitchChange(val, scoped.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="roleExplain" label="角色说明"></el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="text" size="mini"
                  @click="handleEdit(scope.$index, scope.row)">
                  <i class="iconfont icon-shujutancha"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">
                  <i class="el-icon-link"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.$index, scope.row)">
                  <i class="el-icon-copy-document"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.$index, scope.row)">
                  <i class="iconfont icon-gengduo"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
    <template v-if="activePage === 'customRole'">
      <CustomRole @backHand="backHand"></CustomRole>
    </template>
  </div>
</template>

<script>
import TabsHeader from '@/components/tabs-header'
import CustomRole from './edit.vue'

const Title = {
  name: 'Title',
  props: {
    tableData: {
      type: Array,
      default: [
        {
          name: '项目1',
          count: 10
        }
      ]
    }
  },
  data() {
    return {
      form: {
        role: '1'
      },
      rules: {
        role: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  render() {
    return (
      <div>
        <div class="title mb-10">
          <span style="font-size:12px;color:rgba(0,0,0,0.65)">该角色已被一下成员引用，通用后改角色原有用户需要指定新角色，确认停用吗？</span>
        </div>
        <el-table
          data={this.tableData}
          style="width: 100%">
          <el-table-column prop="name" label="项目"></el-table-column>
          <el-table-column prop="count" label="当前角色人数"></el-table-column>
        </el-table>
        <el-form model={this.form} rules={this.rules} ref="form" style="margin-top:10px">
          <el-form-item label="切换为角色" prop="role">
            <el-select v-model={this.form.role}>
              <el-option label="项目访客" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    )
  }
}
export default {
  name: 'RoleManage',
  components: {
    TabsHeader,
    CustomRole,
  },
  data() {
    return {
      activeTab: '1',
      activePage: 'home',
      tabs: [
        {
          name: '1',
          label: 'Dev项目'
        },
        {
          name: '2',
          label: 'Prod项目'
        },
        {
          name: '3',
          label: 'Basic项目'
        },
        {
          name: '4',
          label: '标签项目'
        }
      ],
      tableDataNull: [],
      tableDataWin: [
        {
          name: '项目访客',
          isUse: false,
          roleExplain: '拥有项目文件(含规范建模对象)查看权限，项目节点查看权限，无本项目的数据权限，需要单独申请，跨项目权限以租户安全权限策略为准，可以被更改角色，移除',
          icon: 'iconfont icon-lianxirendengji',
          color: '#28ADAC'
        },
        {
          name: '数据访客',
          isUse: false,
          roleExplain: '拥有项目文件(含规范建模对象)查看权限，项目节点查看权限，无本项目的数据权限，需要单独申请，跨项目权限以租户安全权限策略为准，可以被更改角色，移除',
          icon: 'iconfont icon-chakan',
          color: '#67D277'
        },
        {
          name: '分析师',
          isUse: false,
          roleExplain: '拥有项目文件(含规范建模对象)查看权限，项目节点查看权限，无本项目的数据权限，需要单独申请，跨项目权限以租户安全权限策略为准，可以被更改角色，移除',
          icon: 'iconfont icon-tubiao-zhexiantu',
          color: '#8252FF'
        },
        {
          name: '开发者',
          isUse: false,
          roleExplain: '拥有项目文件(含规范建模对象)查看权限，项目节点查看权限，无本项目的数据权限，需要单独申请，跨项目权限以租户安全权限策略为准，可以被更改角色，移除',
          icon: 'iconfont icon-yanfalei',
          color: '#FFC169'
        },
        {
          name: '项目管理员',
          isUse: false,
          roleExplain: '拥有项目文件(含规范建模对象)查看权限，项目节点查看权限，无本项目的数据权限，需要单独申请，跨项目权限以租户安全权限策略为准，可以被更改角色，移除',
          icon: 'iconfont icon-guanliyuan1',
          color: '#FD8E3A'
        }
      ],
      tableDataCustom: [
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
        {
          name: '集成测试',
          isUse: false,
          roleExplain: '集成',
          icon: 'iconfont icon-guanliyuan',
          color: '#6994F5'
        },
      ]
    }
  },
  methods: {
    handleTabClick(tab) {
      this.activeTab = tab.name
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    addCustomRole() {
      this.activePage = 'customRole'
    },
    backHand() {
      this.activePage = 'home'
    },
    handleSwitchChange(row) {
      this.$msgbox({
        title: '停用自定义角色【集成测试】',
        message: (<Title></Title>),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.$message({
          type: 'success',
          message: '已停用'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.role-manage {
  height: 100%;
  width: 100%;
  padding: 15px 15px 0 15px;
}
::v-deep {
  .header-table {
    .el-table__body-wrapper {
      display: none;
    }
  }
}
.table-title {
  height: 28px;
  width: 110px;
  line-height: 28px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  padding: 5px 10px;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.table-wrapper {
  width: 100%;
  height: calc(100% - 40px);
  padding-bottom: 20px;
  .table-body {
    height: calc(100% - 36px);
    overflow: auto;
  }
}
</style>
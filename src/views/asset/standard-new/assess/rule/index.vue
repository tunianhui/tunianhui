
<template>
  <div class="trashlist" v-resize="resizeDom">
    <div v-if="isHome === 'home'">
      <div class="flex-between">
        <div class="flex">
          <div class="page-title mr-20">落标映射规则</div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="落标规则" name="first"></el-tab-pane>
            <el-tab-pane label="执行记录" name="second"></el-tab-pane>
          </el-tabs>
        </div>
        <ListHeader title="" @addRule="addRule"></ListHeader>
      </div>

      <template v-if="activeName === 'first'">
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :max-height="Maxheight">
          <el-table-column type="selection" align="center" width="45">
          </el-table-column>
          <el-table-column label="规则名称" width="160">
            <template slot-scope="{row}">
              <div>{{row.standardRuleSimpleDto.standardRuleName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="标准集名称">
            <template slot-scope="{row}">
              <div>{{row.simpleStandardSet.name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="field3" label="执行方式">
            <template slot-scope="{row}">
              <div>定时执行</div>
              <div>每日 {{row.scheduleConfigDto.cronExpressionConfig.executeTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template>
              <span>已发布</span>
            </template>
          </el-table-column>
          <el-table-column prop="field5" label="负责人">
            <template slot-scope="{row}">
              <div>{{row.standardRuleSimpleDto.ownerDto.displayName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="field6" label="最近更新日期" width="140">
            <template slot-scope="{row}">
              <div>{{row.standardRuleSimpleDto.lastModifyTime}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="field7" label="最近执行记录" width="140">
            <!-- <template slot-scope="{row}">
              <div>{{row.field7}}</div>
              <div>
                <i :class=" true ? 'el-icon-success':'el-icon-close'"></i>
                <span class="ml-5">成功</span>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="{row}">
              <div>{{row.standardRuleSimpleDto.description}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="field9" label="生效状态" width="100">
            <template slot-scope="{row}">
              <el-switch v-model="row.field9" @change="val => changeStatus(val, row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-tooltip content="详情" placement="top">
                <el-button size="mini" type="text" @click="viewDetailHandle(scope)">
                  <i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button size="mini" type="text" @click="editHandle(scope)">
                  <i class="el-icon-edit-outline font-14 color-btn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="开始" placement="top">
                <el-button type="text" @click="runRuleHandle(scope)"><i class="iconfont icon-zhihang font-14 color-btn"></i></el-button>
              </el-tooltip>
              <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
                <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                  <ul class="popper-list">
                    <li>
                      <el-button type="text" @click="handleDel(scope)"><i class="el-icon-delete font-14 color-btn">删除</i></el-button>
                    </li>
                    <li>
                      <el-button type="text" @click="handleViewRunLog(scope)"><i class="iconfont icon-shujutancha font-14 color-btn">查看执行日志</i></el-button>
                    </li>
                    <li>
                      <el-button type="text" @click="handleViewHistory(scope)"><i class="iconfont icon-yuanbiao-xianxing font-14 color-btn">查看运行记录</i></el-button>
                    </li>
                  </ul>
                </el-popover>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="foot">
          <div class="pl-20">
            <el-checkbox v-model="allCheck" class="mr-10">本页全选</el-checkbox>
            <el-button type="text" class="mr-5 ml-10"><i class="el-icon-video-play font-14 color-btn">开启</i></el-button>
            <el-button type="text" class="mr-5"><i class="iconfont icon-Icon-jinyong font-14 color-btn">关闭</i></el-button>
            <el-button type="text" class="mr-5"><i class="el-icon-delete font-14 color-btn">删除</i></el-button>
          </div>
          <div>
            <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="100">
            </el-pagination>
          </div>
        </div>
      </template>
      <template v-if="activeName === 'second'">
        <el-table :data="HistoryTableData" :max-height="Maxheight">
          <el-table-column type="selection" align="center" width="45" v-if="false">
          </el-table-column>
          <el-table-column prop="name" label="规则名称"></el-table-column>
          <el-table-column prop="startTime" label="开始执行时间"></el-table-column>
          <el-table-column prop="runRestlus" label="执行结果">
            <template slot-scope="scoped">
              <div>{{scoped.row.startTime}}</div>
              <div>
                <i class="iconfont icon-yuanxingxuanzhong-fill-copy mr-5" style="color:#24BD47"></i>
                <span class="mr-5">成功</span>
                <span class="mr-5">{{scoped.row.runTime}}</span>
                <i class="iconfont icon-cycletask" style="color: #66b1ff;cursor: pointer;"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nameset" label="标准集名称">
            <template slot-scope="scoped">
              <div style="color: #66b1ff;cursor: pointer;" @click="jumpToStandardSet">{{scoped.row.nameset}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="runType" label="执行方式"></el-table-column>
          <el-table-column prop="userName" label="执行人"></el-table-column>
          <el-table-column prop="dataset" label="映射非空标准集"></el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scoped">
              <el-tooltip content="查看落标明细" placement="top">
                <el-button type="text" @click="handleViewRulesDetail(scoped)"><i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip content="查看执行日志" placement="top">
                <el-button type="text" @click="handleViewRunLog(scoped)"><i class="iconfont icon-shujutancha font-14 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div v-if="isHome === 'add'">
      <RuleEdit @black="black" :viewType="viewType" :currentRow="currentRow"></RuleEdit>
    </div>
    <DrawerDemoLuobiaoMingxi v-if="DrawerDemoLuobiaoMingxiVisible" @close="closeDrawerDemoLuobiaoMingxi"></DrawerDemoLuobiaoMingxi>
  </div>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import RuleEdit from './edit.vue'
import DrawerDemoLuobiaoMingxi from './luobiao-mingxi.vue'
import {
  getStandardruleFuzzySearchList
} from '@/api/asset/rule.js'
import Template from '../../../../plan/work-order/template.vue'
export default {
  name: 'Rule',
  components: {
    ListHeader,
    RuleEdit,
    DrawerDemoLuobiaoMingxi,
    Template
  },
  mixins: [pager],
  data () {
    return {
      activeName: 'first',
      form: {
      },
      loading: 0,
      tableData: [],
      multipleSelection: [],
      isHome: 'home',
      Maxheight: 0,
      allCheck: false,
      viewType: 'add',
      currentRow: {},
      HistoryTableData: [
        {
          name: '规则名称',
          startTime: '2021-08-03 19:90:13',
          runTime: '0.00s',
          nameset: '标准集名称1',
          runType: '定时执行',
          userName: 'test001',
          dataset: '0'
        }
      ],
      DrawerDemoLuobiaoMingxiVisible: false
    }
  },
  created () {
    this._getStandardruleFuzzySearchList()
  },
  mounted () { },
  methods: {
    // 列表数据
    async _getStandardruleFuzzySearchList() {
      const res = await this.$simpleAsyncTo(getStandardruleFuzzySearchList(), '获取数据失败')
      if (res) {
        this.tableData = res.data.totalList
      }
    },
    handleClick (val) { },
    searchChange (val) { },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 编辑
    editHandle (item) {
      this.isHome = 'add'
      this.viewType = 'edit'
      this.currentRow = item
    },
    // 恢复
    batchRecover (item) { },
    resizeDom(data) {
      const { height } = data
      console.log(parseInt(height))
      this.Maxheight = parseInt(height) - 49 - 54
    },
    addRule () {
      this.isHome = 'add'
      this.viewType = 'add'
    },
    black () {
      this.isHome = 'home'
    },
    // 查看详情
    viewDetailHandle (row) {
      this.isHome = 'add'
      this.viewType = 'view'
      this.currentRow = row
    },
    // 切换生效状态
    changeStatus(val, row) {
      console.log(val, row)
      let title = '', subtitle = ''
      if (val) {
        title = '开启'
        subtitle = '开启后，如果已经超过设置的每日定时时间，本日不会生成执行任务'
      } else {
        title = '关闭'
        subtitle = '关闭后，如果已经超过设置的每日定时时间，本日不会生成执行任务'
      }
      this.$confirm(subtitle, `${title}映射规则为生效`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    // 临时手动执行规则
    runRuleHandle(scope) {
      console.log(scope)
      this.$confirm('如果到达下一次定时运行时间时运行仍未结束，则下一次定时执行任务将会被自动终止', '临时手动执行规则', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '执行成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消执行'
        })
      })
    },
    // 删除
    handleDel(scope) {
      this.$confirm('此操作将永久删除该规则, 是否继续?', '删除规则', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看入职
    handleViewRunLog(scope) {
      this.$router.push({ path: '/ruleLog' })
    },
    // 查看执行记录
    handleViewHistory(scope) {
      this.activeName = 'second'
    },
    // 查看落标明细
    handleViewRulesDetail(scoped) {
      this.DrawerDemoLuobiaoMingxiVisible = true
    },
    closeDrawerDemoLuobiaoMingxi() {
      this.DrawerDemoLuobiaoMingxiVisible = false
    },
    handleViewRunLog(scoped) {
      this.$router.push({ path: '/ruleLog' })
    },
    // 跳转到标准集
    jumpToStandardSet() {
      this.$router.push({ path: '/asset/standard-new/dataStandard/standardSet' })
    },
  }
}
</script>

<style lang="scss" scoped>
.trashlist {
  height: 100%;
  > div:nth-child(1) {
    position: relative;
    height: 100%;
  }
  .el-pagination {
    padding: 0;
  }
  .foot {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    background: #fff;
    // border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
  }
  .el-table::before {
    height: 0;
  }
}
</style>

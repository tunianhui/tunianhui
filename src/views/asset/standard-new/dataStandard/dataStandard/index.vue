<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 09:43:05
 * @LastEditTime: 2023-05-12 18:58:08
 * @Description:
-->
<template>
  <div class="public-market">
    <div class="view-wrapper">
      <!-- 菜单 -->
      <div class="side-menu-wrapper">
        <div class="total-card">
          <div class="top-title">标准总量<i class="el-icon-arrow-right arrow"></i></div>
          <div class="total-cont">68</div>
        </div>
        <div class="menu-wrapper">
          <div class="menu-title">
            <span>标准集</span>
            <div>
              <el-checkbox v-model="curChecked">我加入的</el-checkbox>
              <el-checkbox v-model="meChecked">我维护的</el-checkbox>
            </div>
          </div>
          <el-input placeholder="请输入标准集名称编码" class="pr-5 pl-5"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <SideMenu :categoryList="categoryList"></SideMenu>
        </div>
      </div>
      <!-- 列表 -->
      <div class="table-list-wrapper" style="width:0px">
        <div class="top-tag-view">
          <ListHeader title="全部标准列表" @add="addStandard" @batchImport="batchImport" @viewHistory="viewHistory"></ListHeader>
          <el-tabs v-model="activeName" class="tag-view-tabs">
            <el-tab-pane v-for="(item) in tabList" :key="item.key" :label="`${item.name}(${item.value})`" :name="item.key">
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="table" v-resize="resizeDom">
          <el-table :data="tableData" :height="height" style="width: 100%">
            <el-table-column prop="field1" label="标准名称" width="160">
              <template slot-scope="{row}">
                <div>
                  <i :class=" true ? 'el-icon-success':'el-icon-close' "></i>
                  <span class="ml-5">{{row.basicInfo.name}}</span>
                </div>
                <div>
                  {{ row.basicInfo.code }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所属标准集">
              <template slot-scope="{row}">
                <div>{{ row.simpleStandardSet.name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="标准编码">
              <template slot-scope="{row}">
                <div>{{ row.simpleStandardSet.code }}</div>
              </template>
            </el-table-column>
            <el-table-column label="标准类型">
              <template slot-scope="{row}">
                <div>{{ row.basicInfo.type }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column label="生效时间">
              <template slot-scope="{row}">
                <div>{{ standardStatusList[row.standardStatus] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="负责人">
              <template slot-scope="{row}">
                <div>{{ row.basicInfo.owner.displayName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="最近更新人/时间" width="140">
              <template slot-scope="{row}">
                <div>{{ row.basicInfo.lastModifier.displayName }}</div>
                <div>{{  row.basicInfo.lastModifyTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template slot-scope="{row}">
                <div>{{ row.basicInfo.description }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tooltip content="查看" placement="top">
                  <el-button size="mini" type="text" @click="viewHandle(activeName, scope.row)">
                    <i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <el-button size="mini" type="text" @click="editHandle(activeName, scope.row)">
                    <i class="el-icon-edit-outline font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="提交上线" placement="top">
                  <el-button size="mini" type="text" @click="saveHandle(activeName, scope.row)">
                    <i class="el-icon-upload font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
                  <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                    <ul class="popper-list">
                      <li>
                        <el-button type="text" @click="copyHandle(activeName, scope.row)"><i class="iconfont icon-ziyuan2 font-14 color-btn">克隆</i></el-button>
                      </li>
                      <li>
                        <el-button type="text" @click="handleDel(activeName, scope.row)"><i class="el-icon-delete font-14 color-btn">删除</i></el-button>
                      </li>
                    </ul>
                  </el-popover>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="foot">
          <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="100">
          </el-pagination>
        </div>
      </div>
    </div>
    <DataStandardEdit v-if="visible" :title="DataStandardEditTitle" @close="visible = false" :viewType="viewType"></DataStandardEdit>
    <el-dialog
      :title="titleImportant"
      :visible.sync="importVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="680px"
      custom-class="form-standard-important"
      top="10vh"
    >
      
      <el-form :model="form" ref="form" :label-width="formLabelWidth" v-if="step === 1">
        <h6 class="mb-10"> STEP1 下载配置模板</h6>
        <el-form-item label="导入场景" prop="importScene">
          <el-radio-group v-model="form.importScene">
            <el-radio label="1">新增</el-radio>
            <el-radio label="2">更新</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置模板" prop="configModel">
          <el-button type="text" @click="downloadModel">数据安全标准模板 <i class="el-icon-download"></i></el-button>
        </el-form-item>
        <el-divider></el-divider>
        <h6 class="mb-10"> STEP2 上传配置文件</h6>
        <el-form-item label="" label-width="0">
          <el-upload
            class="upload-demo"
            action=""
            multiple
            :limit="3"
            accept=".xls,.xlsx"
            :show-file-list="false"
            :file-list="fileList">
              <el-button type="primary" icon="el-icon-download2">上传</el-button>
          </el-upload>
          
          <span class="ml-10" style="color:rgba(0,0,0,0.5);font-size:12px">
            <i class="el-icon-warning-outline mr-5"></i>
            请上传填写好的配置文件，文件格式仅支持xls、xlsx类型，做多支持200行（不包含标题），不超过20M
          </span>
        </el-form-item>
        <el-divider></el-divider>
        <h6 class="mb-10"> STEP3 冲突解决策略</h6>
        <el-form-item label="校验字段">
          标准名称（标准集内唯一，大小写不敏感）
        </el-form-item>
        <el-form-item label="处理策略" prop="processingStrategy">
          <el-radio-group v-model="form.processingStrategy">
            <el-radio label="1">冲突则跳过</el-radio>
            <el-radio label="2">冲突则覆盖更新</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="step-2" v-if="step === 2">
        <h6 class="mb-10">导入结果</h6>
        <div class="progress">
          <div class="progress-left">
            <div class="top">
              <span>导入进度</span>
              <span>已处理</span>
            </div>
            <div class="bottom">
              <span>0%</span>
              <span>
                <el-progress :stroke-width="10" :percentage="70"></el-progress>
              </span>
            </div>
          </div>
          <div class="progress-right">
            <div class="top">
              <span>已等待时间</span>
            </div>
            <div class="bottom" style="height: 33px; text-align: end; display: flex; flex-direction: column; justify-content: end;">
              <span>6.66s</span>
            </div>
          </div>
        </div>
        <div class="error-list" v-if="showErrorList">
          <div class="error-list-top">
            <div>
              <el-tabs v-model="activeNameError">
                <el-tab-pane label="异常记录" name="first"></el-tab-pane>
              </el-tabs>
            </div>
            <div>
              <el-button>下载异常记录</el-button>
            </div>
          </div>
          <el-table
            :data="errorList"
            max-height="180"
            style="width: 100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="标准名称"></el-table-column>
            <el-table-column prop="code" label="标准编码"></el-table-column>
            <el-table-column prop="errorTip" label="异常提示"></el-table-column>
          </el-table>
          <div style="text-align: end;" class="mt-5">
            <el-pagination
              layout="prev, pager, next"
              :total="50">
            </el-pagination>
          </div>
        </div>
        <h6 class="mb-10 mt-10">执行结果</h6>
        <div style="height:220px">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeImportant">取 消</el-button>
        <el-button type="primary" @click="saveImportant" v-if="step === 1">开始导入</el-button>
        <el-button type="primary" @click="saveImportant" v-if="step === 2">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="titleImportantHistory"
      :visible.sync="importVisibleHistory"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="680px"
      custom-class="form-standard-important-history"
      top="10vh"
    >
      <el-table
        :data="tableDataHistory"
        style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="user" label="创建人"></el-table-column>
        <el-table-column prop="datetime" label="创建时间"></el-table-column>
        <el-table-column prop="ednTime" label="结束时间"></el-table-column>
        <el-table-column prop="status" label="状态"  width="80"></el-table-column>
        <el-table-column label="操作" width="50">
          <template>
            <el-button type="text" @click="viewHistoryInfo">
              <el-tooltip content="查看" placement="top">
                <i class="iconfont icon-shujutancha"></i>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeImportantHistory">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ListHeader from './list-header.vue'
import SideMenu from '../sideMenu.js'
import DataStandardEdit from './edit.vue'
import './index.scss'
import {
  getDirectoryList,
  getStandardFuzzySearchList
} from '@/api/asset/dataStandard.js'

export default {
  name: 'PublicMarket',
  components: {
    SideMenu,
    ListHeader,
    DataStandardEdit
  },
  data () {
    return {
      standardStatusList: {
        ACTIVE: '已生效',
        DRAFT: '草稿',
        FOREVER: '永久',
      },
      curChecked: false,
      meChecked: false,
      activeName: '1',
      tabList: [
        { name: '已生效', value: 53, key: '1' },
        { name: '待生效', value: 1, key: '2' },
        { name: '发布中', value: 0, key: '3' },
        { name: '修订中', value: 14, key: '4' },
        { name: '草稿', value: 10, key: '5' },
        { name: '已失效', value: 10, key: '6' }
      ],
      categoryList: [
        {
          name: '保障平台',
          count: 2,
          children: [
            {
              name: 'uu',
              count: 1,
              children: [
                {
                  name: '数据标准',
                  count: ''
                }
              ]
            },
            {
              name: '数据安全标准',
              count: ''
            }
          ]
        }
      ],
      tableData: [],
      height: 0,
      visible: false,
      DataStandardEditTitle: '新建标准',
      viewType: 'view',
      importVisible: false,
      titleImportant: '批量导入',
      formLabelWidth: '120px',
      form: {
        importScene: '1',
        processingStrategy: '1'
      },
      fileList: [],
      step: 1,
      curCode: '',
      titleImportantHistory: '查看导入记录',
      importVisibleHistory: false,
      tableDataHistory: [
        {
          user: 'test001',
          datetime: '2022-08-08 11:20:25',
          ednTime: '2022-08-08 11:20:25',
          status: '成功'
        },
        {
          user: 'test001',
          datetime: '2022-08-08 11:20:25',
          ednTime: '2022-08-08 11:20:25',
          status: '成功'
        },
        {
          user: 'test001',
          datetime: '2022-08-08 11:20:25',
          ednTime: '2022-08-08 11:20:25',
          status: '成功'
        },
        {
          user: 'test001',
          datetime: '2022-08-08 11:20:25',
          ednTime: '2022-08-08 11:20:25',
          status: '成功'
        }
      ],
      activeNameError: 'first',
      errorList: [
        {
          name: 'first',
          code: 'first',
          errorTip: '错误数据',
        },
        {
          name: 'second',
          code: 'second',
          errorTip: '错误数据',
        }
      ],
      showErrorList: false
    }
  },
  created() {
    this._getDirectoryList()
    this._getStandardFuzzySearchList()
  },
  methods: {
    resizeDom (data) {
      this.height = parseInt(data.height)
    },
    // 获取树列表数据
    async _getDirectoryList() {
      const res = await this.$simpleAsyncTo(getDirectoryList(), '获取数据失败')
      if (res) {
        this.categoryList = res.data.data
      }
    },
    // 列表数据
    async _getStandardFuzzySearchList() {
      const res = await this.$simpleAsyncTo(getStandardFuzzySearchList(), '获取数据失败')
      if (res) {
        this.tableData = res.data.totalList
      }
    },
    handleDel (item) { },
    // 新建
    addStandard () {
      this.visible = true
      this.DataStandardEditTitle = '新建标准'
      this.viewType = 'add'
    },
    // 查看
    viewHandle (name, row) {
      this.visible = true
      this.DataStandardEditTitle = '查看标准'
      this.viewType = 'view'
    },
    // 编辑
    editHandle (name, row) {
      this.visible = true
      this.DataStandardEditTitle = '编辑标准'
      this.viewType = 'edit'
    },
    // 克隆
    copyHandle (name, row) {
      this.visible = true
      this.DataStandardEditTitle = '克隆标准'
      this.viewType = 'copy'
    },
    // 删除
    handleDel (name, row) {
      this.$confirm('此操作将永久删除该标准, 是否继续?', '提示', {
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
    // 提交上线
    saveHandle (name, row) {
      this.$prompt('提交上线需要经过审批，建议您填写审批备注，以作为审批人的参考，审批通过后自动执行上线到生产环境的操作', '提交上线标准：数据标准', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPlaceholder: '请输入审批备注',
        inputType: 'textarea',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    // 批量导入
    batchImport () {
      this.step = 1
      this.importVisible = true
      this.titleImportant = '批量导入'
    },
    // 下载模板
    downloadModel () {
      this.$message({
        type: 'success',
        message: '下载成功!'
      })
    },
    closeImportant () {
      this.importVisible = false
    },
    // 开始导入
    saveImportant (res, file) {
      this.step = 2
      this.titleImportant = '批量导入'
      this.showErrorList = false
    },
    // 查看导入记录
    viewHistory () {
      this.importVisibleHistory = true
      this.titleImportantHistory = '查看导入记录'
    },
    closeImportantHistory () {
      this.importVisibleHistory = false
    },
    viewHistoryInfo () {
      this.importVisible = true
      this.step = 2
      this.titleImportant = '查看导入记录'
      this.showErrorList = true
    },
  }
}
</script>

<style lang="scss" scoped>
.menu-title {
  :deep(.el-checkbox) {
    margin-right: 10px;
  }
}
.progress {
  display: flex;
  align-items: center;
  &-left {
    width: 500px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .bottom {
      >span:first-child {
        margin-right: 20px;
      }
      >span:last-child {
        width: calc(100% - 20px);
      }
    }
  }
  &-right {
    flex: 1;
    width: 0;
    .top {
      margin-bottom: 10px;
      text-align: end;
    }
    .bottom {
      text-align: end;
    }
  }
}
::v-deep .form-standard-important {
  .el-tabs__nav-wrap {
    &::after {
      display: none;
      height: 0;
    }
  }
  .error-list {
    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
}
</style>

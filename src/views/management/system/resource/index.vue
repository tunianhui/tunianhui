<template>
  <div class="resource-settings">
    <div class="title" ref="title">资源设置</div>
    <div class="info-card" v-resize="resizeDom">
      <div class="info-wrapper" v-if="collapse">
        <div class="info-item" v-for="item in infoList" :key="item.title">
          <div class="item-title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </div>
          <div class="item-text">
            {{item.text}}
          </div>
        </div>
      </div>
      <div :class="['info-collapse', collapse ? '' : 'active']" @click="collapseChange">
        <i class="el-icon-d-arrow-left"></i>
        <span>
          {{collapse ? '收起' : '展开'}}
        </span>
      </div>
    </div>
    <div class="info-default" ref="infoDefailt">
      <div class="info-default-title">租户默认资源组</div>
      <div class="info-default-content">
        <div class="left-1">
          <div>
            <span>CPU总量</span>
            <span>
              <!-- <strong>5</strong>
              <span>c/</span>
              <strong>25.2</strong>
              <span>c</span> -->
              {{defaultData.cpuSum}}
            </span>
          </div>
          <div>
            <span>当前分配</span>
            <span>{{defaultData.cpuAllocatedPercent}}</span>
          </div>
          <div>
            <span>最小保留</span>
            <span>
              <el-input-number style="width:80px" v-model="num" controls-position="right" :min="0" :max="100"></el-input-number>
              <span>
                %
              </span>
            </span>
          </div>
          <div @click="saveCpu">
            保存
          </div>
        </div>
        <div class="right-1">
          <div>
            <span>内存总量</span>
            <span>
              <!-- <strong>17.7</strong>
              <span>G/</span>
              <strong>88.7</strong>
              <span>G</span> -->
              {{defaultData.memorySum}}
            </span>
          </div>
          <div>
            <span>当前分配</span>
            <span>{{defaultData.memoryAllocatedPercent}}</span>
          </div>
          <div>
            <span>最小保留</span>
            <span v-show="!isEditMemory">{{defaultData.memoryMinimumRetentionPercent}}%</span>
            <el-input-number v-show="isEditMemory" style="width:80px" v-model="memory" controls-position="right" :min="0"></el-input-number>
          </div>
          <div>
            <i class="el-icon-edit" v-if="!isEditMemory" @click="isEditMemory = true;memory = Number(defaultData.memoryMinimumRetentionPercent)"></i>
            <span v-else style="font-size:12px" @click="saveMomory">保存</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-table" :style="{height: `calc(100% - ${this.height}px)`}">
      <div class="info-table-title">
        <div>自定义资源组列表</div>
        <div>
          <el-select v-model="operUser" placeholder="负责人" style="width: 160px" @change="changeOperUser" clearable>
            <el-option
              v-for="item in operUserOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="status" placeholder="状态" style="width: 100px" @change="changeStatus" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            style="width: 200px"
            placeholder="请输入资源组名称或ID"
            suffix-icon="el-icon-search"
            v-model="keyWord"
            @input="changeKeyWord"
          >
          </el-input>
          <el-button type="primary" size="mini" style="height:28px" @click="add">新建自定义资源组</el-button>
        </div>
      </div>
      <template>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          :height="`calc(100% - ${40 + 55}px)`"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="资源组">
            <div class="tesk-obj" slot-scope="scope">
              <div class="table-icon">
                <i class="iconfont icon-xiangmuquanxianguanli"></i>
              </div>
              <div class="name-code">
                <OverflowTooltip class="name">{{scope.row.name}}</OverflowTooltip>
                <OverflowTooltip class="code">{{scope.row.id}}</OverflowTooltip>
              </div>
            </div>
          </el-table-column>
          <el-table-column prop="ownerUserId" label="负责人"></el-table-column>
          <el-table-column label="资源配置">
            <div class="tesk-obj" slot-scope="scope">
              <div class="name-code">
                
                <span class="name">{{scope.row.cpuConfig}}</span>
                <span class="code">{{scope.row.memoryConfig}}</span>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="状态">
            <div slot-scope="scope">
              {{scope.row.statusDesc}}
            </div>
          </el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="使用场景" prop="applyFor"></el-table-column>
          <el-table-column label="最近更新人/时间">
            <template slot-scope="scope">
              {{scope.row.modifierUserId}}<br>
              {{scope.row.updateTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130" align="right">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit-outline font-14 cursor mr-15" @click="edit(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.status == 'DEACTIVATE' ? '启用' : '停用'" placement="top">
                <i
                  :class="['iconfont font-14 cursor mr-15', scope.row.status == 'DEACTIVATE' ? 'icon-zhihang' : 'icon-execute-']"
                  @click="(scope.row.status == 'ACTIVATED' || scope.row.status == 'DEACTIVATE') && statusChangeHandle(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="iconfont icon-shanchu1 font-14 cursor" @click="deleteResourceGroup(scope.row)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="info-table-bottom">
        <div class="left-1">
          <!-- <div class="bottom-tips-check">
            <el-checkbox v-model="pageAllChecked"></el-checkbox>
            <span>本页全选</span>
          </div>
          <ul class="bottom-tips-actionlist">
            <template v-for="item in actiosList">
              <li :key="item.name">
                <i :class="item.icon"></i>
                <span class="tips-action-name">{{item.name}}</span>
              </li>
            </template>
          </ul> -->
        </div>
        <div>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            :pager-count="5"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <ResourceDialog
      v-if="resourceDialogVisible"
      :operUserOptions="operUserOptions"
      :title="dialogTitle"
      :id="currenId"
      :defaultData="defaultData"
      :type="dialogTitle === '新建自定义资源组' ? 'add' : 'edit'"
      @close="close"
    ></ResourceDialog>
  </div>
</template>

<script>
import OverflowTooltip from '@/components/overflow-tooltip'
import ResourceDialog from './dialog.vue'
import {
  getDefaultResourceGroup,
  getResourceGroupList,
  getPrincipalList,
  getStatusList,
  deleteResourceGroup,
  stopResourceGroup,
  startResourceGroup,
  saveCpuMinPercent,
  saveMemoryMinPercent
} from '@/api/management/resource'
export default {
  name: 'ResourceSettings',
  components: {
    OverflowTooltip,
    ResourceDialog
  },
  data() {
    return {
      infoList: [
        {
          title: '调度资源',
          icon: 'el-icon-receiving',
          text: '调度资源指任务生成的实例调度所消耗资源，支持将当前租户可使用的所有调度资源分配为不同的资源组并关联到可使用的项目，不同资源组之间资源相互隔离互不影响。'
        },
        {
          title: '租户默认资源组',
          icon: 'iconfont icon-code-yewubankuai',
          text: '每个租户有且仅有一个，在创建租户时系统自动生成，不支持删除。创建自定义资源组时，自动从默认资源组分配对应资源。为了保证所有任务均有可使用的调度资源，需要设置租户默认资源组保留最小资源百分比。'
        },
        {
          title: '自定义资源组',
          icon: 'iconfont icon-yuanbiao-xianxing',
          text: '需要指定和项目的关联关系，以便更好的管控资源使用范围和场景；支持设置项目默认资源组；支持在任务配置时自定义修改单个任务使用的资源组；对生产任务执行“补数据”或“重跑”等操作时，可临时指定单次调度使用的资源组。'
        },
        {
          title: '资源组优先级',
          icon: 'iconfont icon-quanbu1',
          text: '优先使用每个任务配置的资源组，如果任务调度时指定的资源组已经被停用或删除，将自动切换为租户默认资源组'
        }
      ],
      collapse: true,
      num: 1,
      height: 0,
      operUser: '', // 负责人
      operUserOptions: [], // 负责人列表
      status: '', // 状态
      statusOptions: [ // 状态列表
      ],
      keyWord: '', // 关键字
      tableData: [],
      pageAllChecked: false,
      actiosList: [
        { name: '停用', icon: 'el-icon-video-pause', command: 'stopHander' },
        { name: '启用', icon: 'iconfont icon-huifu', command: 'restoreHander' }
      ],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      resourceDialogVisible: false,
      dialogTitle: '',
      defaultData: {},
      loading: false,
      isEditMemory: false,
      memory: 0,
      currenId: ''
    }
  },
  created() {
    this._getStatusList()
    this._getPrincipalList()
    this._getDefaultResourceGroup()
    this._getResourceGroupList()
  },
  methods: {
    collapseChange() {
      this.collapse = !this.collapse
    },
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const margin = 10 + 15
        this.height = parseInt(height) + this.$refs.infoDefailt.clientHeight + this.$refs.title.clientHeight + margin + 1
      })
    },
    currentChange(val) {
      this.currentPage = val
      this._getResourceGroupList()
    },
    add() {
      this.resourceDialogVisible = true
      this.dialogTitle = '新建自定义资源组'
    },
    changeOperUser() {
      this._getResourceGroupList()
    },
    changeStatus() {
      this._getResourceGroupList()
    },
    changeKeyWord() {
      this._getResourceGroupList()
    },
    async statusChangeHandle(row) {
      const params = {
        id: row.id
      }
      let fn = null
      if (row.status === 'ACTIVATED') {
        fn = stopResourceGroup
      } else if (row.status === 'DEACTIVATE') {
        fn = startResourceGroup
      }
      const res = await this.$simpleAsyncTo(fn(params), '操作失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this._getResourceGroupList()
      }
    },
    // 获取默认资源组信息
    async _getDefaultResourceGroup() {
      const res = await this.$simpleAsyncTo(getDefaultResourceGroup({
        tenantId: 'admin'
      }), '获取默认资源组信息失败')
      if (res) {
        this.defaultData = res.data
        this.num = Number(res.data.cpuMinimumRetentionPercent)
      }
    },
    // 获取自定义资源组列表
    async _getResourceGroupList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getResourceGroupList({
        ownerUserId: this.operUser,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        searchText: this.keyWord,
        status: this.status,
      }), '获取自定义资源组列表失败')
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading = false
    },
    // 获取负责人列表
    async _getPrincipalList() {
      const res = await this.$simpleAsyncTo(getPrincipalList({
        tenantId: 'admin'
      }), '获取负责人列表失败')
      if (res) {
        this.operUserOptions = res.data.map(item => {
          return {
            label: item.displayName,
            value: item.loginName
          }
        })
      }
    },
    // 获取状态列表
    async _getStatusList() {
      const res = await this.$simpleAsyncTo(getStatusList({
        tenantId: 'admin'
      }), '获取状态列表失败')
      if (res) {
        this.statusOptions = res.data.map(item => {
          return {
            label: item.displayName,
            value: item.value
          }
        })
      }
    },
    // 删除资源组
    async deleteResourceGroup(row) {
     this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(deleteResourceGroup({
          id: row.id
        }), '删除资源组失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getResourceGroupList()
          this._getDefaultResourceGroup()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    close(flag) {
      if (flag === 'refresh') {
        this._getResourceGroupList()
        this._getDefaultResourceGroup()
      }
      this.currenId = ''
      this.resourceDialogVisible = false
    },
    // 保存cpu最小保留百分比
    async saveCpu() {
      const res = await this.$simpleAsyncTo(saveCpuMinPercent({
        id: this.defaultData.id,
        cpuMinimumRetentionPercent: this.num
      }), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this._getDefaultResourceGroup()
      }
    },
    // 保存内存最小保留百分比
    async saveMomory() {
      const res = await this.$simpleAsyncTo(saveMemoryMinPercent({
        id: this.defaultData.id,
        memoryMinimumRetentionPercent: this.memory
      }), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this._getDefaultResourceGroup()
        this.isEditMemory = false
      }
    },
    // 编辑
    edit(row) {
      this.resourceDialogVisible = true
      this.dialogTitle = '编辑自定义资源组'
      this.currenId = row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-settings {
  width: 100%;
  height: 100%;
  padding: 15px 15px 0 15px;
  .title {
    margin-bottom: 15px;
    font-size: 16px;
  }
  .info-card {
    width: 100%;
    background: #fff;
    // padding: 15px;
    font-size: 14px;
    margin-bottom: 10px;
    .info-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      // align-items: flex-start;
      padding: 15px;
      .info-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        width: 0;
        padding: 0 15px;
        border-right: 1px solid #e8e8e8;
        &:last-child {
          border-right: none;
        }
        .item-title {
          font-size: 14px;
          color: #4A4A4A;
          i {
            margin-right: 5px;
            font-size: 16px;
            color:#306CFE;
          }
        }
        .item-text {
          margin-top: 10px;
          line-height: 1.5;
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.65);
        }
      }
    }
    .info-collapse {
      width: 100%;
      height: 100%;
      height: 45px;
      line-height: 45px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      color:#306CFE;
      transition: all 0.3s ease-in-out;
      i {
        margin-right: 5px;
        font-size: 16px;
        transform: rotate(90deg);
      }
      &.active {
        i {
          transform: rotate(-90deg);
        }
      }
    }
  }
  .info-default {
    width: 100%;
    background: #fff;
    padding: 15px;
    &-title {
      font-size: 14px;
      color: #4A4A4A;
      margin-bottom: 15px;
    }
    &-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      .left-1 {
        width: 50%;
        height: 28px;
        padding: 0 15px;
        border-right: 1px solid #e8e8e8;
        display: flex;
        align-items: center;
        > div:not(:last-child) {
          flex: 1;
          font-size: 13px;
          > span:first-child {
            color: #4A4A4A;
            margin-right: 20px;
          }
        }
        >div:last-child {
          width: 40px;
          color: #306CFE;
          cursor: pointer;
          font-size: 13px;
          user-select: none;
        }
      }
      .right-1 {
        width: 50%;
        height: 28px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        > div:not(:last-child) {
          flex: 1;
          font-size: 13px;
          > span:first-child {
            color: #4A4A4A;
            margin-right: 20px;
          }
        }
        >div:last-child {
          width: 40px;
          color: #306CFE;
          cursor: pointer;
          font-size: 16px;
          user-select: none;
        }
      }
    }
  }

  .info-table {
    width: 100%;
    background: #fff;
    padding: 10px 15px 0px 15px;
    margin-top: 10px;
    position: relative;
    .info-table-title {
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      > div:last-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div {
          margin-right: 10px;
        }
      }
    }
    .info-table-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 52px;
      width: 100%;
      box-shadow: 0 -5px 10px 0 rgba(0,0,0,.15);
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-1 {
        display: flex;
        align-items: center;
        .bottom-tips-check {
          > span {
            font-size: 12px;
            color: rgba(0,0,0,0.85);
            margin-left: 10px;
          }
        }
        .bottom-tips-actionlist {
          margin: 0;
          padding: 0;
          display: flex;
          list-style-type: none;
          margin-left: 12px;
          cursor: pointer;
          li {
            padding-right: 20px;
            &.disable-click {
              cursor: not-allowed;
              color: #cecece;
            }
            .tips-action-name {
              position: relative;
              font-size: 12px;
              color: rgba(0,0,0,0.75);
            }
            i {
              margin-right: 5px;
              vertical-align: middle;
              color: rgba(0,0,0,0.75);
            }
          }
        }
      }
    }
    .tesk-obj {
      display: flex;
      align-items: center;
      height: 100%;
      .table-icon {
        i {
          font-size: 28px;
          color: #2D73FF;
          margin-right: 8px;
          display: flex;
        }
      }
      .name-code {
        display: flex;
        flex-direction: column;
        flex: 1;
        .name {
          // cursor: pointer;
          // color: #2D73FF;
          width: calc(100% - 20px);
        }
        .code {
          width: calc(100% - 20px);
        }
      }
    }
    ::v-deep {
      .el-table__header {
        thead {
          tr {
            th:first-child {
              .cell {
                display: none;
              }
            }
          }
        }
      }
    }
    .cursor {
      cursor: pointer;
    }
  }
}
</style>
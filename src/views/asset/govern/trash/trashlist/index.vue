
<template>
  <section class="trashlist">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">回收站列表</div>
      </div>
    </div>
    <div class="search-wrapper">
      <div class="mb-20">
        <span class="title">治理领域</span>
        <!-- <Select :list="list1" @select='select1'></Select> -->
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list" :key="index" @click="select1(item,index)" :class="{'item-select': selectIndex === index }">
              <span class="text">{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理对象</span>
        <!-- <Select :list="list2" @select='select2' :activeIndex="active"></Select> -->
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list2" :key="index" @click="select2(item,index)" :class="{'item-select': selectIndex2 === index }">
              <span class="text">{{ item.objectName }}</span>
            </li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理项</span>
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list3" :key="index" @click="select3(item,index)" :class="{'item-select': selectIndex3 === index }">
              <span class="text">{{ item.itemName }}</span>
            </li>
          </ul>
        </div>
        <!-- <Select :list="list3" @select='select3'></Select> -->
      </div>
    </div>
    <div class="mb-10">
      <div class="flex">
        <el-select v-model="form.projectName" placeholder="请选择项目" @change="getRecycleList" clearable>
          <el-option v-for="item in getProjectList" :key="item.projectId" :label="item.projectName" :value="item.projectName">
          </el-option>
        </el-select>
        <el-input v-model="form.objectName" prefix-icon="el-icon-search" @change="getRecycleList" @input="searchChange" clearable placeholder="请输入搜索表名称" class="input-value ml-10"></el-input>
        <el-select class="ml-10" v-model="form.recovState" placeholder="请选择状态" @change="getRecycleList" clearable>
          <el-option v-for="item in recovStateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="flex2">
        <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="batchDelfun" @batchDel="batchDelfun"></SelectFooter>
      </div>
    </div>

    <el-card>
      <TablepageDetail ref="tablePageDetail" :height="bodyHeight - 60" :cell-width="cellWidth" :collapse="detailCollapse" :fullscreen="fullscreen" @collapse="collapsefun" @isFull="isFullfunc">
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange" @cell-click="cellClick">
            <template slot="empty">
              <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
              <img src="@/assets/images/nodata.png" alt="">
              <p>暂无数据</p>
          </template>
          <el-table-column type="selection" align="center" width="45">
          </el-table-column>
          <el-table-column prop="field1" label="表名" min-width="200" >
            <template slot-scope="{row}">
              <span class="icon iconfont icon-shougongbiaoqian"></span>
              <span class="ml-10">{{row.field1}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="itemCode === 'C0007'"  label="分区"  prop="partitionName" min-width="150">
          </el-table-column>
          <el-table-column prop="projectName" label="项目名" min-width="150">
          </el-table-column>
          <el-table-column prop="dbName" label="库名" width="140">
          </el-table-column>
          <el-table-column prop="recovTime" label="回收日期" width="160"></el-table-column>
          <el-table-column prop="uptime" label="操作日期" width="160"></el-table-column>
          <el-table-column prop="recovState" label="回收状态" width="100">
            <template slot-scope="{row}">
              <span>{{row.recovState === 0 ? '初始状态' : row.recovState === 1 ? '已清除' : '已恢复' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="清除" placement="top">
                <el-button :disabled="scope.row.recovState === 1"  type="text" @click="handleEdit(scope.row)"><i class="el-icon-delete font-14 "></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="一键恢复" placement="top">
                <el-button :disabled="scope.row.recovState === 2" type="text" @click="batchRecover(scope.row)"><i class="el-icon-refresh-right font-14"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr pt-10 pb-10"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageFilters.pageNo"
          :page-sizes="[15, 25, 50, 100]"
          :page-size="pageFilters.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
          </el-pagination>
        <detailsPage v-if="visible" slot="detail" :formList="detailsList" :getheight="bodyHeight-68"></detailsPage>
      </TablepageDetail>
    </el-card>
    <!-- <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination> -->
    <!-- 清除弹框 -->
    <el-dialog :visible.sync="dialogVisible" @close="close"  center width="40%">
      <div style="display: flex;align-items: center;">
        <p id="dialog-title">请输入{{title === 'clear' ? '清除' : '恢复'}}信息</p> <textarea  v-model="bakObjectName"></textarea> 
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
import TablepageDetail from '@c/TablepageDetail.vue'
import detailsPage from '@/views/asset/govern/item-manage/icebergtraceability/dialogPage'
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import {getTableTrace} from '@/api/govern/item-manage'
import {getDomainNum, getObjectNum, getItemNum, getRecycleList, getProject, clearRecycle, recoverRecycle} from '@/api/govern/platform'
import { data } from '../../../../../components/ops-flow/data'
export default {
  name: 'Trashlist',
  components: {
    SelectFooter,
    TablepageDetail,
    detailsPage,
  },
  mixins: [pager],
  data () {
    return {
      itemName: '',
      bakObjectName: '',
      title: '',
      dialogVisible: false, 	// 弹框展示控制台输出控制台显示或关闭控制台显示  dialog
      list: [],
      list1: [],
      list2: [],
      list3: [],
      selectIndex: 0,
      selectIndex2: 0,
      selectIndex3: 0,
      code: '',
      objectCode: '',
      itemCode: '',
      getProjectList: [],
      activeName: 'first',
      typeList: [
        { value: '全部' },
        { value: '物理表' },
        { value: '逻辑表' }
      ],
      
      recovStateList: [
        {label: '初始状态', value: 0}, {label: '已清除', value: 1}, {label: '已恢复', value: 2}
      ],
      form: {
        objectName: '',
        projectName: '',
        recovState: '',
      },
      pageFilters: {
        pageNo: 1,
        pageSize: 15,
      },
      total: 0,
      loading: 0,
      tableData: [],
      multipleSelection: [],
      detailCollapse: false,
      fullscreen: false,
      visible: false,
      bodyHeight: 400,
      cellWidth: 280,
      detailsList: {},
      timer: 0,
      commObject: {},
      sourceType: ''
    }
  },
  mounted () { 
    this.getDomainNum()
    this.getProject()
    this.$nextTick(_ => {
      this.bodyHeight = window.innerHeight
    })
  },
  methods: {
    close() {
      this.bakObjectName = ''
    },
    collapsefun(val) {
      this.fullscreen = true
      this.detailCollapse = val
      this.visible =  false
    },
    isFullfunc() {

    },
    handleSizeChange(val) {
      this.pageFilters.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageFilters.pageNo = val
      this.getRecycleList()
    },
    select1(item, index){
      this.index = index
      this.code = item.code
      this.selectIndex = index
      this.selectIndex2 = 0
      this.selectIndex3 = 0
      this.emptyhandle()
      this.getObjectNum()
    },
    select2(item, index) {
      this.sourceType = item.objectName
      this.selectIndex2 = index
      this.selectIndex3 = 0
      this.emptyhandle()
      this.objectCode = item.objectCode
      this.getItemNum()
    },
    select3(item, index) {
      this.itemName = item.itemName
      this.selectIndex3 = index
      this.emptyhandle()
      this.itemCode = item.itemCode
      this.getRecycleList()
    },
    emptyhandle() {
      this.form = {}
      this.visible = false
      this.detailCollapse = false
    },
    handleClick (val) {
      if (this.title === 'clear') {
        this.clearRecycle()
      } else {
        this.recoverRecycle()
      }
    },
    searchChange (val) { },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cellClick(row, column) {
      if (column.label === '表名') {
        // this.detailsList = row
        this.getTableTrace(data)
        clearTimeout(this.timer)
        this.timer = setTimeout(_ => {
          this.fullscreen = false
          this.visible = true
          this.detailCollapse = true
          // this.$refs.tablePageDetail.visibleDetail()
        }, 500)
      }
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
    commfun(data) {
      const commlist = []
      data.forEach(item => {
        const itemObject = {
          recycleId: item.recycleId,
          objectName: item.objectName, 
          bakObjectName: item.bakObjectName,
          dbName: item.dbName, 
          bakPartitionPath: item.bakPartitionPath
        }
        commlist.push(itemObject) 
      })
      // clear' : 'recover'
      if (this.itemCode === 'C0001') {

        this.commObject = {
          comments: `${this.title === 'clear' ? 'delete' : 'recover'} null table`,
          list: commlist,
          operateType: 'dropTable'
        }
      } else if (this.itemCode === 'C0005') {
        this.commObject = {
          comments: `${this.title === 'clear' ? 'delete' : 'recover'} big table`,
          list: commlist,
          operateType: 'dropTable'
        }
      } else if (this.itemCode === 'C0004' || this.itemCode === 'C0007') {
        this.commObject = {
          list: commlist,
          operateType: 'setLifeCycle',
          comments: `${this.title === 'clear' ? 'drop' : 'recover'} life cycle end`
        }
      } else {
        this.commObject = {
          list: commlist,
          operateType: '',
          comments: ''
        }
      }
      // if (this.title === 'clear') {
      //   this.commObject = {
      //     comments: 'delete',
      //     list: commlist,
      //   }
      // } else {
      //   this.commObject = {
      //     comments: 'recover',
      //     list: commlist,
      //   }
      // }
    },
    // 清除
    handleEdit (item) { 
      if (item) {
        this.title = 'clear'
        this.dialogVisible = true
        this.commfun([item])
      }
    },
    // 批量清除
    batchDelfun(val) {
      if (this.multipleSelection.length > 0) {
        const idsList = this.multipleSelection.map(item => item.recovState)
        let isClear = ''
        if (val === '清除') {
          isClear = idsList.includes('1')
        } else {
          isClear = idsList.includes('2')
        }
        if (!isClear){
          this.title = val === '清除' ? 'clear' : 'recover'
          this.dialogVisible = true
          this.commfun(this.multipleSelection)
        } else {
          this.$message({
            type: 'warning',
            message: `存在已${val}的数据，请重新选择`
          })
          return
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择数据'
        })
      }
    },
    // 恢复
    batchRecover (item) {
      this.title = 'recover'
      this.dialogVisible = true
      this.commfun([item])
     },


    async getDomainNum() {
      const res = await this.$simpleAsyncTo(getDomainNum({webCode: "rgsrecycle"}), '获取治理领域列表失败')
      if (res) {
        this.list = res.data
        this.code = res.data[0].code
        this.getObjectNum()
      }
    },
    async getObjectNum() {
      const params = {
        code: this.code,
        webCode: "rgsrecycle",
      }
      const res = await this.$simpleAsyncTo(getObjectNum(params), '获取治理对象列表失败')
      if (res) {
        this.list2 = res.data
        if (res.data.length > 0) {
          this.objectCode = res.data[0].objectCode
          this.sourceType = res.data[0].objectName
          this.getItemNum()
        } else {
          this.list3 = []
        }
      }
    },
    async getItemNum() {
      const params = {
        objectCode: this.objectCode,
        webCode: "rgsrecycle",
        code: this.code,
      }
      const res = await this.$simpleAsyncTo(getItemNum(params), '获取治理项列表失败')
      if (res) {
        this.list3 = res.data
        this.itemCode = res.data[0].itemCode 		// 保存itemCode到项中，方便后续操作
        this.itemName = res.data[0].itemName
        this.getRecycleList()
      }
    },
    async getRecycleList() {
      this.loading++
      const param = {
        ...this.form,
        objectCode: this.objectCode,
        code: this.code,
        itemCode: this.itemCode,
        ...this.pageFilters
      }
      const res = await this.$simpleAsyncTo(getRecycleList(param), '获取回收站列表查询数据失败')
      if (res) {
        if (res.data) {
          this.tableData = res.data.totalList
          this.total = res.data.total
        }
      }
      this.loading--
    },
    async getProject() {
      const res = await this.$simpleAsyncTo(getProject(), '获取项目列表失败')
      if (res) {
        this.getProjectList = res.data
      }
    },
    //回收站清除
    async clearRecycle() {
      const data = this.commObject.list
      for (let i = 0; i < data.length; i++) {
        data[i].bakObjectName = this.bakObjectName
      }
      const res = await this.$simpleAsyncTo(clearRecycle(this.commObject), '回收站清除数据失败')
      if (res) {
        this.dialogVisible = false 			// 清除操作完成后，清除dialogVisible变量，防止被引用。
        this.getRecycleList()
        this.$message({
          type: 'success',
          message: '清除成功'
        })
      }
    },
    //回收站恢复
    async recoverRecycle() {
      const data = this.commObject.list
      for (let i = 0; i < data.length; i++) {
        data[i].bakObjectName = this.bakObjectName
      }
      const res = await this.$simpleAsyncTo(recoverRecycle(this.commObject), '回收站恢复数据失败')
      if (res) {
        this.dialogVisible = false 			// 恢复操作完成后，清除dialogVisible变量，防止被
        this.getRecycleList()
        this.$message({
          type: 'success',
          message: '恢复成功'
        })
      }
    },
    async getTableTrace(data) {
      const param = {
        sourceType: this.sourceType || undefined,
        tblName: data.objectName || undefined,
        datasourceIdList: data.datasourceId,
        pageSize: 15,
        pageNo: 1,
      }
      const res = await this.$simpleAsyncTo(getTableTrace(param), '获取数据失败')
      if (res) {
        this.detailsList = res.data.totalList[0]
      }
    }
  }
}
</script>

<style lang="scss">
.trashlist {
  position: relative;
  height: 100%;
  .search-wrapper {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .wrapper {
      display: inline-block;
      ul {
        display: flex;
        list-style: none;
        li {
          margin: 0 5px;
          cursor: pointer;
          .text {
            padding: 5px 10px;
            display: inline-block;
            text-align: center;
            color: #666;
            font-size: 12px;
            background-color: #e0e1ee;
            border: 1px solid transparent;
          }
          &:hover {
            .text {
              color: #000e7f;
              background-color: #eaedf8;
              border: 1px solid #000e7f;
            }
          }
        }
        .item-select {
          .text {
            color: #000e7f;
            background-color: #eaedf8;
            border: 1px solid #000e7f;
          }
        }
      }
    }
    .title {
      display: inline-block;
      font-size: 14px;
      text-align: right;
      width: 80px;
      margin-right: 20px;
    }
    .line {
      height: 1px;
      background-color: #d9d9d9;
      margin-top: 10px;
      margin-left: 105px;
    }
  }
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .input-value {
    width: 200px;
  }
  .el-dialog .el-dialog__header {
      border-bottom: none;
  }
  .el-dialog .el-dialog__body{
    border-bottom: none;
  }
  textarea{
    margin-left: 20px;
    width: 70%;
    height: 150px; 
    resize: none;
    background-color: #F8F8FA;
    border: 2px solid #B2B2B2;
    overflow-y: scroll;
  }
  .mb-10{
    display: flex;
    position: relative;
    .flex2{
      position: absolute;
      min-width: 320px;
      right: 0;
      bottom: -15px;
    }
  }
  .item{
    .font-14{
      // color: #40B8FF;
      font-size: 16px;
    }
  }
}

</style>

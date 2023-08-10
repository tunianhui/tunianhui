<template>
  <section class="item-manage-yarntask">
    <div class="title">任务溯源数据查询</div>
    <div class="head-bottom">
      <SearchForm ref="SearchForm" @search="getTaskDetail()" @reset="getTaskDetail(), getProjectQueue()" :formRef="$refs.formfilter">
        <el-form :model="form" ref="formfilter" :inline="true" label-width="70px">
          <el-form-item prop="deployName" label="归属项目">
            <!-- <el-input v-model="form.deployName"></el-input> -->
            <el-select v-model="form.deployName" filterable  placeholder="请选择项目" @change="changeDbname">
              <el-option v-for="item in typeList" :key="item.deployName" :label="item.projectName" :value="item.deployName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state" label="任务状态" width="150px">
            <el-select v-model="form.state" clearable size="mini">
              <el-option v-for="item in dictList" :key="item.value" :value="item.value" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="queue" label="队列名称">
            <el-select v-model="form.queue" placeholder="请选择项目名称" @change="queueClick">
              <el-option v-for="item in projeectList" :key="item.queueName" :label="item.queueName" :value="item.queueName"></el-option>
            </el-select>
            <!-- <el-input v-model="form.queue"></el-input> -->
          </el-form-item>
          <el-form-item prop="appUser" label="提交人" >
            <!-- <el-input v-model="form.appUser"></el-input> -->
            <el-select v-model="form.appUser" placeholder="请选择提交人">
              <el-option v-for="item in  projectMenList" :key="item.userName" :label="item.userName" :value="item.userLoginName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="appId" label="任务ID">
            <el-input v-model="form.appId"></el-input>
          </el-form-item>
          <el-form-item prop="appName" label="任务名称">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item prop="trendDate" label="选择时间">
            <el-date-picker class="pickTime" :clearable="false" v-model="form.trendDate"  
             type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item prop="startTime" label="查询开始时间">
            <el-date-picker size="mini" v-model="form.startTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" placement="bottom-start"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="查询结束时间">
            <el-date-picker size="mini" v-model="form.endTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00" placement="bottom-start"></el-date-picker>
          </el-form-item> -->
        </el-form>
      </SearchForm>
    </div>
    <TablepageDetail ref="tablePageDetail" :height="bodyHeight-60" :cell-width="cellWidth" :collapse="detailCollapse"  :fullscreen="fullscreen" @collapse="collapsefun" @isFull="isFullfunc">
      <div class="flex">
      <el-table :data="tableData" border style="width: 98%; margin: 10px;" v-loading="loading">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <!-- :width="flexColumnWidth('appId',tableData)" -->
        <!-- <el-table-column prop="appId" label="任务ID" :width="flexColumnWidth('appId',tableData)"   style="white-space: nowrap; display: inline-block;"> -->
        <el-table-column prop="appId" label="任务ID" min-width="260px">
          <template slot-scope="scope">
            <div class="optionDiv" ref="optionDiv">
              <i class="iconfont icon-shougongbiaoqian" ></i>
              <el-button type="text" size="mini" @dblclick.native="rightMouse(scope.row.appId)" @click="buttonClick(scope.row)">{{scope.row.appId}}</el-button>
            </div>
          </template>
          <!-- <template slot-scope="scope">
            <div class="optionDiv" style="white-space: nowrap; display: inline-block;"> {{ scope.row.appId }}</div>
          </template> -->
        </el-table-column>
        <el-table-column prop="appName" label="任务名称" min-width="100px"></el-table-column>
        <el-table-column prop="projectName" label="队列名称" min-width="100px"></el-table-column>
        <el-table-column prop="appUser" label="提交人"></el-table-column>
        <el-table-column prop="queue" label="队列名"></el-table-column>
        <el-table-column prop="state" width="100px" label="任务状态"></el-table-column>
        <el-table-column prop="applicaitonType" label="任务类型" min-width="100px"></el-table-column>
        <el-table-column prop="startedTime" label="开始时间" sortable min-width="130px"></el-table-column>
        <el-table-column prop="finishedTime" label="完成时间" sortable min-width="130px"></el-table-column>
        <el-table-column prop="finalStatus" label="最终状态"  min-width="100px"></el-table-column>
        <el-table-column prop="runningContainers" label="运行容器数" sortable min-width="105px"></el-table-column>
        <el-table-column prop="allocatedVcores" min-width="115px" label="分配的cpu" sortable></el-table-column>
        <el-table-column prop="allocatedMb" min-width="135px" label="分配的内存(MB)" sortable></el-table-column>
        <el-table-column prop="queueUsagePercentage" min-width="110px" label="占用队列百分比"></el-table-column>
        <el-table-column prop="clusterUsagePercentage" min-width="150px" label="占用yarn集群百分比"></el-table-column>
        <el-table-column prop="trackingUrl" label="日志" >
          <template slot-scope="scope">
            <el-button @click="openNewurl(scope.row)" type="primary">log</el-button>
          <!-- <el-button type="primary"><a :href="scope.trackingUrl" class="link" target="_blank" style="color: azure;">log</a></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      </div>
      <el-pagination
        class="fr pt-10 pb-10"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.pageNo"
        :page-sizes="[15, 25, 50, 100]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
      <yarnTaskDia v-if="visible" slot="detail" :data="yarnTaskData"  :getheight="bodyHeight - 50" :sendVal="isFullVal"></yarnTaskDia>
    </TablepageDetail>
    
  </section>
</template>

<script>
// getTaskDetail
// import {getTaskDetail} from '@/api/govern/item-manage'
import SearchForm from '@/components/searchform.vue'
import {dateFormat2, dateFormat} from '@/libs/util'
import { getProject} from '@/api/govern/platform'
import {getProjectQueue, getProjectMen, getTaskDetail} from '@/api/govern/item-manage'
import {getDictList} from '@/api/govern/source-analyze'
import TablepageDetail from '@c/TablepageDetail.vue'
import yarnTaskDia from './yarnTaskDia'
export default {
  name: 'yarntask',
  components: {
    SearchForm,
    TablepageDetail,
    yarnTaskDia
  },
  data () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600*1000*24*1 )
    return {
      yarnTaskData: '',
      visible: false,
      detailCollapse: false,
      fullscreen: false,
      bodyHeight: 400,
      cellWidth: 300,
      typeList: [],
      projeectList: [],
      projectMenList: [],
      total: 0,
      form: {
        appId: '',
        appName: '',
        state: '',
        queue: '',
        deployName: '',
        appUser: '',
        trendDate: [start, end] || [],
        pageSize: 15,
        pageNo: 1
      },
      tableData: [],
      dictList: [],
      timer: 0,
      loading: false,
      // sparkAttemptIdList: [],
      isFullVal: false,
    }
  },
  mounted () {
    this.getTaskDetail()
    this.setwidth()
    this.getProject()
    this.getProjectQueue()
    this.getProjectMen()
    this.getDictList()
    this.bodyHeight = window.innerHeight
    // this.$nextTick(_ => {
    //   window.addEventListener('resize', function() {
    //     this.bodyHeight = window.innerHeight
    //   })
    // })
  },
  // beforeDestroy() {
  //   window.removeEventListener('resize', function() {
  //     this.bodyHeight = window.innerHeight
  //   })
  // },
  methods: {
    collapsefun(val) {
      this.fullscreen = true
      this.detailCollapse = val
      this.visible =  false
    },
    isFullfunc(val) {
      this.isFullVal = val
    },
    buttonClick(val) {
      this.fullscreen = false
      clearTimeout(this.timer)
      // this.getSparkAttemptId(val)
      this.timer = setTimeout(_ => {
        this.$refs.tablePageDetail.visibleDetail()
        // this.detailCollapse = true
        this.visible = true
        this.yarnTaskData = val
      }, 200)
    },
    //鼠标左键双击
    rightMouse(val) {
      console.log(val)
      clearTimeout(this.timer)
      const input = document.createElement('input')
      input.value = val
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message.success('复制任务ID成功')
    },
    // 自适应表格列宽
    flexColumnWidth(str, tableData, flag = 'max') {
      // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
      // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
      // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
      str = str + ''
      let columnContent = ''
      if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
        return
      }
      if (!str || !str.length || str.length === 0 || str === undefined) {
        return
      }
      if (flag === 'equal') {
        // 获取该列中第一个不为空的数据(内容)
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str].length > 0) {
           
            columnContent = tableData[i][str]
            break
          }
        }
      } else {
        // 获取该列中最长的数据(内容)
        let index = 0
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str] === null) {
            return
          }
          const now_temp = tableData[i][str] + ''
          const max_temp = tableData[index][str] + ''
          if (now_temp.length > max_temp.length) {
            index = i
          }
        }
        columnContent = tableData[index][str]
      }
      // console.log('该列数据[i]:', columnContent)
      // 以下分配的单位长度可根据实际需求进行调整
      let flexWidth = 0
      for (const char of columnContent) {
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8
        } else if (char >= '\u4e00' && char <= '\u9fa5') {
          // 如果是中文字符，为字符分配15个单位宽度
          flexWidth += 13
        } else {
          // 其他种类字符，为字符分配8个单位宽度
          flexWidth += 6
        }
      }
      // if (flexWidth < 80) {
      //   // 设置最小宽度
      //   flexWidth = 80
      // }
      // if (flexWidth > 250) {
      //   // 设置最大宽度
      //   flexWidth = 250
      // }
      if (str === 'appId') {
        flexWidth = flexWidth + 45
      }
      return flexWidth + 'px'
    },
    queueClick(val) {
      this.projeectList.forEach(item => {
          if(val === item.queueName) {
            this.form.deployName = item.deployName
          }
        })
    },
    changeDbname() {
      this.form.queue = ''
      this.getProjectQueue()
    },
    setwidth(label, prop) {
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNo = val
      this.getTaskDetail()
    },
    openNewurl(val) {
      window.open(val.trackingUrl)
    },
    //接口
    async getTaskDetail(){
      this.loading = true
      const [start, end] = this.form.trendDate ? this.form.trendDate : []
      const params = {
        ...this.form,
        trendDate: undefined,
        appId: this.form.appId || undefined,
        appName: this.form.appName || undefined,
        state: this.form.state || undefined,
        queue: this.form.queue || undefined,
        deployName: this.form.deployName || undefined,
        appUser: this.form.appUser || undefined,
        startDate: start ? dateFormat(start) + ' ' + dateFormat2(start) : undefined,
        endDate : end ? dateFormat(end) + ' ' + dateFormat2(end) : undefined
      }
      const res = await this.$simpleAsyncTo(getTaskDetail(params), '获取任务溯源查询页面数据失败') 
      if (res) {
        this.tableData = res.data.pageInfo.totalList
        this.total = res.data.pageInfo.total
        // this.tableData = res.list
        // this.total = Number(res.count)
      }
      this.loading = false
    },
    async getProject() {
      const res = await this.$simpleAsyncTo(getProject(), '获取下拉列表项目失败') 
      if (res) {
          this.typeList = res.data
          // this.deployList = res.data
      }
    },
    async getProjectQueue() {
      const param = {
        deployName: this.form.deployName || undefined,
        // userName: this.form.userName || undefined
      }
      const res = await this.$simpleAsyncTo(getProjectQueue(param), '')
      if (res) {
        this.projeectList = res.data
      }
    },
    async getDictList() {
      const res = await this.$simpleAsyncTo(getDictList({type: 'yarn_app_detail'}), '获取列表失败')
      if (res) {
        this.dictList = res.data
      }
    },
    async getProjectMen() {
      // const deployId = this.typeList.filter(item => {
      //   if (this.form.deployName === item.deployName) {
      //     return item.projectId
      //   }
      // })
      // const param = {
      //   projectId:  deployId.length > 0 ? deployId[0].projectId : undefined
      // }
      const res = await this.$simpleAsyncTo(getProjectMen(), '')
      if (res) {
        this.projectMenList = this.getadd(res.data)
      }
    },
    getadd(data) {
      let newArray = []
      let newData = []
      for (let i=0; i < data.length; i++) {
        if (!newArray.includes(data[i].userName)) {
          newArray.push(data[i].userName)
          newData.push(data[i])
        } else {
          data.splice(i,1)
        }
      }
      return newData
    },
    // async getSparkAttemptId(data) {
    //   const res = await this.$simpleAsyncTo(getSparkAttemptId({applicationId: data.appId}), '')
    //   if (res) {
    //    this.sparkAttemptIdList = res.data
    //   }
    // }
  }
}
</script>

<style lang="scss">
.item-manage-yarntask {
  .title {
    font-size: 16px; 
  }
  .optionDiv{
    .iconfont {
      font-size: 28px;
      color: #4783FF;
      // font-size: 28px;
      margin-right: 8px;
    }
  }
  .head-bottom {
      display: flex;
      margin-top: 14px;
      background-color: #F5F5F5;
      width: 99%;
      .el-form {
        // border: 1px solid seagreen;
        margin-left: 10px;
        width: 80%;
        .el-form-item {
          .el-form-item__content {
            .el-select {
              width: 177px ;
            }
            .el-date-editor {
              // width: 177px;
            }
          }
        }
      }
    }
    .flex {
        margin-top: 10px;
        background-color: #F5F5F5;
        width: 99%;
        .el-table{
          .el-table-column{
            white-space: nowrap;
            display: inline-block;
          }
          // style="white-space: nowrap; display: inline-block;"
        }
        // .tableAuto.el-table .cell {
        //   white-space: nowrap;
        // }

    }
}

</style>

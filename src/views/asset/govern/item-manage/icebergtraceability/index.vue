<template>
  <section class="item-manage-dispatch">

      <div class="head">
        <div class="head-left">表溯源数据查询</div>
    </div>
    <div class="head-bottom">
        <SearchForm ref="searchForm" @search="getTableTrace" @reset="getTableTrace" :formRef="$refs.formfilter">
            <el-form :model="form" :inline="true" label-width="70px" ref="formfilter" label-position="right">
              <el-form-item label="归属项目" prop="deployName">
                <el-select v-model="form.deployName" filterable clearable placeholder="请选择项目" @change="changeDbname">
                  <el-option v-for="item in typeList" :key="item.deployName" :label="item.projectName" :value="item.deployName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表类型" prop="sourceType">
                <el-select v-model="form.sourceType" clearable @change="changeDbname">
                  <el-option label="hive" value="hive"></el-option>
                  <el-option label="iceberg" value="iceberg"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="库名" prop="dbName">
                <el-select v-if="form.deployName !== ''" v-model="form.dbNameid" clearable>
                  <el-option v-for="item in dbNameList" :key="item.id" :label="item.dbName" :value="item.id"></el-option>
                </el-select>
                <el-input v-else v-model="form.dbName" placeholder="请输入库名" clearable></el-input>
              </el-form-item>
              <el-form-item label="表名" prop="tblName" >
                  <el-input v-model="form.tblName" placeholder="请输入表名" clearable></el-input>
              </el-form-item>
              <el-form-item label="表负责人" prop="owner">
                  <!-- <el-input v-model="form.owner" placeholder="请输入表负责人" clearable></el-input> -->
                  <el-select v-model="form.owner" placeholder="请输入表负责人" clearable>
                    <el-option v-for="item in projectMenList" :key="item.id" :label="item.userName" :value="item.userLoginName"></el-option>
                  </el-select>
              </el-form-item>
            </el-form>
        </SearchForm>
    </div>
    <TablepageDetail ref="tablePageDetail" :height="bodyHeight-70" :cell-width="cellWidth" :collapse="detailCollapse" :fullscreen="fullscreen">
    <div class="flex">
      <el-table :data="tableData" border style="width: 98%; margin: 10px;"  class="tableAuto">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
      <!-- <el-table :data="tableData" border style="width: 98%; margin: 10px;" table-layout='auto'> -->
        <!-- :render-header="renderHeader" -->
        <el-table-column prop="tblName" label="表名" min-width="200px" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <div class="optionDiv" ref="optionDiv" style="white-space: nowrap; display: inline-block">
              <i class="iconfont icon-shougongbiaoqian"></i>
              <el-button @dblclick.native="rightMouse(scope.row.tblName)" type="text" size="mini" @click="details(scope.$index, scope.row)">{{scope.row.tblName}}</el-button>
            </div>
            <!-- <span @click="details(scope.$index, scope.row)">{{ scope.row.tblName }}</span> -->
            <!-- <el-button style="display: inline-block; position: absolute; right: 20px;" @click="details(scope.row)" type="primary" size="small">详情</el-button> -->
            <!-- icon-shougongbiaoqian -->
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="表负责人"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectName" label="归属项目"></el-table-column>
        <!-- <el-table-column prop="projectName" label="项目名" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="sourceType" label="表类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dbName" label="库名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="numfiles" label="表文件数量" sortable min-width="83px"></el-table-column>
        <el-table-column prop="totalsize" label="表总存储(G)" sortable min-width="87px"></el-table-column>
        <el-table-column prop="partitioned" label="是否分区表" min-width="83px">
          <template slot-scope="scope">
            <span>{{ scope.row.partitioned === 1 ? '分区' : '非分区' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="lastAccessTime" label="表最后访问时间" min-width="105px"></el-table-column> -->
        <el-table-column prop="compress" label="压缩格式" min-width="83px">
          <template slot-scope="scope">
            <span>{{ scope.row.compress  ? scope.row.compress : '无' }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="lifeCycle" label="表生命周期(天)" min-width="105px">
          <template slot-scope="scope">
            <span>{{scope.row.lifeCycle === 0 ? '永久' : scope.row.lifeCycle + '天'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="表创建时间" sortable min-width="133px"></el-table-column>
        <!-- <el-table-column label="查看">
            <template slot-scope="scope">
                <el-button @click="details(scope.row)" type="primary" size="small">详情</el-button>
            </template>
        </el-table-column> -->
    </el-table>
    </div>
    <el-pagination
      class="fr pt-10 pb-10"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNo"
      :page-sizes="[15, 25, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    <detailsPage v-if="visible" slot="detail" :formList="detailsList" :getheight="bodyHeight-68"></detailsPage>
    <!-- <detailsPage v-if="visible" slot="detail" :formList="detailsList" @close="close"></detailsPage> -->
    </TablepageDetail>
    
  </section>
</template>

<script>
import SearchForm from '@/components/searchform.vue'
import detailsPage from './dialogPage.vue'
import {getTableTrace, getProjectSource, getProjectMen} from '@/api/govern/item-manage'
import { getProject} from '@/api/govern/platform'
import TablepageDetail from '@c/TablepageDetail.vue'
import qs from 'qs'
export default {
  name: 'ItemManageDispatch',
  components: {
    SearchForm,
    detailsPage,
    TablepageDetail
  },
  // mixins: [pager],
  data () {
    return {
      detailCollapse: false,
      // personList: [],
      fullscreen: false,
      cellWidth: 280,
      bodyHeight: 400,
      setdialogHeight: 400,
      setheight: 0,
      form: {
        dbNameid: '',
        deployName: '',
        dbName: '',
        sourceType: '',
        owner: '',
        tblName: ''
      },
      pageNo: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      dialogVisible: false,
      visible: false,
      detailsList: {},
      typeList: [],
      dbNameList: [],
      projectMenList: [],
      timer: 0
    }
  },
  mounted () { 
    this.getTableTrace()
    this.getProject()
    this.getProjectMen()
    // this.getProjectSource({sourceType: this.form.sourceType})
    // this.$nextTick(_ => {
    //   this.renderHeader()
    // })
    this.$nextTick(_ => {
      this.bodyHeight = window.innerHeight
      // const getbody = document.getElementsByClassName('head-bottom')
      // const setheight = window.innerHeight - getbody[0].offsetHeight - 130
      // if (setheight > 400) {
      //   this.bodyHeight = setheight
      // }
    })
  },
  methods: {
    rightMouse(val) {
      console.log()
      clearTimeout(this.timer)
      const input = document.createElement('input')
      input.value = val
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message.success('复制表名成功')
    },
    // getwindowheight() {
    //   const add = document.getElementsByClassName('head-bottom')
    //   // setTimeout(_ => {
    //     this.bodyHeight = window.innerHeight - add[0].offsetHeight
    //   // }, 30)
    //  
    // },
    tableNameButton() {
    },
    changeDbname(val) {
      this.getProjectMen()
      this.form.dbNameid = ''
      this.form.dbName = ''
      const data = {
        project: this.form.deployName,
        sourceType: this.form.sourceType ? this.form.sourceType : undefined                                
      }
      if (this.form.deployName) {
        this.getProjectSource(data)
      } else {
        this.dbNameList = []
      }
      // console.log(!(!this.form.deployName && !this.form.sourceType), '的分公司的公司的')
      // if (!(!this.form.deployName && !this.form.sourceType)) {
      //   this.getProjectSource(data)
      // }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getTableTrace()
    },
    //详情按钮
    details(val, row) {
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => {
        this.visible = true
        this.$refs.tablePageDetail.visibleDetail()
      }, 200)
      this.detailsList = row
      // this.detailsList = row
      // this.visible = true
    },
    // details(val) {
    //   console.log(val)
    //   this.$router.push({
    //     name: 'tablePage'
    //   })
    // },
    handleClose() {},
    close() {
      this.visible = false
    },
    async getTableTrace() {
      const datasourceIdList = []
      if (this.form.dbNameid) {
        datasourceIdList.push(this.form.dbNameid)
      } else {
        this.dbNameList.forEach(item => {
          datasourceIdList.push(item.id)
        })
      }
      const params = {
        // ...this.form,
        tblName: this.form.tblName || undefined,
        owner: this.form.owner || undefined,
        sourceType: this.form.sourceType || undefined,
        dbName: this.form.dbName || undefined,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        datasourceIdList: datasourceIdList.length !== 0 ? datasourceIdList + '' : undefined
      }
      const res = await this.$simpleAsyncTo(getTableTrace(params), '获取hive溯源数据列表失败')
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },
    async getProject() {
     
      const res = await this.$simpleAsyncTo(getProject(), '获取下拉列表项目失败') 
      if (res) {
          this.typeList = res.data
      }
    },
    async getProjectSource(data) {
        const res = await this.$simpleAsyncTo(getProjectSource(data), '')
        if (res) {
          this.dbNameList = res.data
        }
    },
    getadd(data) {
      // console.log(data)
      // for (let i=0; i<data.length; i++) {
      //     for (let j=i+1; j<data.length;j++) {
      //       console.log(i,j, data[i], data[j] )
      //       if (data[i].userLoginName === data[j].userLoginName) {
      //         data.splice(j,1)
      //       }
      //     }
      //   }
      //   return data
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
    async getProjectMen() {
      const deployId = this.typeList.filter(item => {
        if (this.form.deployName === item.deployName) {
          return item.projectId
        }
      })
      const param = {
        projectId:  deployId.length > 0 ? deployId[0].projectId : undefined
      }
      const res = await this.$simpleAsyncTo(getProjectMen(param), '')
      if (res) {
        // this.projectMenList = res.data
        // const data = res.data
        // console.log(res.data)
        this.projectMenList = this.getadd(res.data)
      }
    }
  }
}
</script>

<style lang="scss">
.item-manage-dispatch {
  overflow: auto;
  // .head {
  //       .head-left {
  //           font-size: 16px;
  //       }
  //   }
  .head-bottom {
    display: flex;
    background-color: #F5F5F5;
    width: 99%;
    .el-form {
      margin-left: 10px;
      // width: 90%;
      min-width: 400px;
      // border: 1px solid brown;
    }
    .el-form-item {
      // width: 260px;
      // display: flex;
      // flex-wrap: nowrap;
      .el-form-item__label{
        // color: palegreen;
        white-space: nowrap; 
        display: inline-block;
      }
      .el-form-item__content{
        width: 195px;
        .el-input{
          width: 195px;
        }
        // background-color: palevioletred;
      }
    }
  }
    .flex {
        margin-top: 10px;
        background-color: #F5F5F5;
        width: 99%;
        // .el-table-column{
        //   display: flex;
        // }
        .iconfont{
          font-size: 24px;
          // color: #68b6b0;
          color: #4783FF;
          margin-right: 10px;
        }
        .tableAuto.el-table .cell {
          white-space: nowrap;
        }
    }
}

</style>

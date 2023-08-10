<template>
  <section class="dispatch" v-loading="!!loading">
    <div class="head">
      <div class="head-left">队列溯源数据查询</div>
    </div>
    <div class="head-bottom">
      <SearchForm ref="SearchForm" @search="getQueueDetail(), getQueueDetail2()" @reset="reserqueue" :formRef="$refs.formfilter">
        <el-form :model="form" ref="formfilter" :inline="true" label-width="80px">
          <el-form-item prop="queueName" label="队列名称">
            <el-select v-model="form.queueName" @change="selectClick" clearable="">
              <el-option v-for="item in projeectList1" :key="item.key" :label="item.queueName " :value="item.queueName "></el-option>
            </el-select>
            <!-- <el-input v-model="form.queueName" placeholder=""></el-input> -->
          </el-form-item>
          <el-form-item v-if="(form.queueName !== '' || form.userName !== '') && form.deployName === ''" prop="deployName2" label="归属项目">
            <el-select v-model="deployName2" filterable clearable placeholder="请选择项目" @change="selectClick">
              <el-option v-for="item in projeectList" :key="item.key" :label="item.deployName" :value="item.deployName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else  prop="deployName" label="归属项目">
            <el-select v-model="form.deployName" filterable  placeholder="请选择项目" @change="changeDbname">
              <el-option v-for="item in typeList" :key="item.deployName" :label="item.projectName" :value="item.deployName"></el-option>
            </el-select>
            <!-- <el-input v-model="form.projectName" placeholder=""></el-input> -->
          </el-form-item>
          <el-form-item prop="userName" label="队列负责人" label-width="85px">
            <el-select v-model="form.userName" @change="selectClick" clearable="">
              <el-option v-for="item in projeectList2" :key="item.key" :label="item.userName " :value="item.userName "></el-option>
            </el-select>
            <!-- <el-input v-model="form.queueMan" placeholder=""></el-input> -->
          </el-form-item>
          <el-form-item label="时间选择" prop="timeRange">
            <el-select placeholder="请选择时间范围" v-model="timeRange" @change="selectTime">
              <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker v-if="visibleTime" class="pickTime" :clearable="false" v-model="trendDate"  
             type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item prop="trendDate" v-if="visibleTime">
            <el-date-picker class="pickTime" :clearable="false" v-model="trendDate"  
             type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item> -->
          <!-- <el-form-item prop="startTime" label="查询开始时间"> 
            <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择日期时间" placement="bottom-start">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="查询结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间" placement="bottom-start" default-time="12:00:00">
            </el-date-picker>
          </el-form-item> -->
        </el-form>
      </SearchForm>
    </div>
    <div class="chart-title">队列使用趋势图</div>
    <div class="chart" ref="chart"></div>
    <div class="flex"> 
      <el-table :data="tableData" border v-if="typeQueue === 'm'">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <el-table-column prop="queueName" label="队列名称" min-width="110px">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.queueName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="usedMemoryCapacityPercent" sortable label="内存使用率" min-width="128px"></el-table-column>
        <el-table-column prop="usedCoresCapacityPercent" sortable label="CPU使用率" min-width="128px"></el-table-column>
        <el-table-column prop="capacity" label="队列总内存(G)" sortable min-width="128px"></el-table-column>
        <el-table-column prop="maxCapacityCores" label="队列总cpu(核)" sortable min-width="128px"></el-table-column>
        <el-table-column prop="projectName" label="队列归属项目" min-width="154px"></el-table-column>
        <el-table-column prop="userName" label="队列负责人" min-width="99px"></el-table-column>
        <el-table-column prop="createdTime" label="统计时间" min-width="105px"></el-table-column>
      </el-table>
      <el-table :data="tableData" border v-else>
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <el-table-column prop="queueName" label="队列名称" min-width="110">
          <template slot-scope="scope">
            <div class="project-name-td">
              <i class="iconfont icon-project"></i>
              <span>{{scope.row.queueName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="avgMemoryPercent" sortable label="内存平均使用率" min-width="134px"></el-table-column>
        <el-table-column prop="maxUsedMemoryPercent" sortable label="内存最大使用率" min-width="134px"></el-table-column>
        <el-table-column prop="minUsedMemoryPercent" sortable label="内存最小使用率" min-width="134px"></el-table-column>
        <el-table-column prop="avgCpuPercent" sortable label="CPU平均使用率" min-width="134px"></el-table-column>
        <el-table-column prop="maxUsedCpuPercent" sortable label="CPU最大使用率" min-width="132px"></el-table-column>
        <el-table-column prop="minUsedCpuPercent" sortable label="CPU最小使用率" min-width="132px"></el-table-column>
        <el-table-column prop="totalMemory" sortable label="队列总内存(G)" min-width="124px"></el-table-column>
        <el-table-column prop="totalCpu" sortable label="队列总cpu(核)" min-width="124px"></el-table-column>
        <el-table-column prop="projectName" label="队列归属项目" min-width="154px"></el-table-column>
        <el-table-column prop="userName" label="队列负责人" min-width="99px"></el-table-column>
        <el-table-column prop="createdTime" label="统计时间" min-width="105px"></el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        class="fr pt-10 pb-10"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[15, 25, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import SearchForm from '@/components/searchform.vue'
import {dateFormat2, dateFormat, getHslArray, rgbArray} from '@/libs/util'
import {getQueueDetail, getProjectQueue} from '@/api/govern/item-manage'
import * as echarts from 'echarts'
import {getDictList} from '@/api/govern/source-analyze'
import { getProject} from '@/api/govern/platform'
export default {
  name: 'yarnqueue',
  components: {
    SearchForm
  },
  data () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return {
      tableData: [],
      typeList: [],
      deployList: [],
      visibleTime: false,
      dictList: [],
      timeRange: '24',
      typeQueue: 'm',
      projeectList: [],
      projeectList1: [],
      projeectList2: [],
      trendDate: [start, end] || [],
      form: {
        deployName: '',
        queueName: '',
        // projectName: '',
        // queueMan: '',
        userName: '',
      },
      deployName2: '',
      pageSize: 15,
      pageNo: 1,
      count: 1,
      trendList: [],
      loading: 0
    }
  },
  mounted () {
    this.getProjectQueue()
    this.getDictList()
    this.getProject()
    setTimeout(_ => {
      this.getQueueDetail()
      this.getQueueDetail2()
    }, 500)
    // this.$nextTick(_ => {
    //   this.getQueueDetail()
    //   this.getQueueDetail2()
    // })
   },
  methods: {
    reserqueue() {
      this.deployName2 = ''
      this.timeRange = '0'
      this.getProjectQueue()
      // this.$nextTick(_ => {
      //   this.getQueueDetail()
      //   this.getQueueDetail2()
      // })
      this.visibleTime = true

      setTimeout(_ => {
        this.getQueueDetail()
        this.getQueueDetail2()
      }, 500)
    },
    changeDbname(val) {
      this.form.queueName = ''
      this.form.userName = ''
      this.getProjectQueue()
    },
    selectTime(val) {
      if (val === '0') {
        this.visibleTime = true
      } else {
        this.visibleTime = false
      }
    },
    selectClick() {
      this.getProjectQueue()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getQueueDetail()
    },
    //一维数组变成二维数组按照不同队列生成新数组
    getNewArr(arr) {
      let newArr = []
      arr.forEach((item, i) => {
        let index = -1
        let alreadyExists = newArr.some((newAddress, j) => {
          if (item.queueName === newAddress.queueName) {
            index = j
            return true
          }
        })
        if (!alreadyExists) {
          newArr.push({
            queueName: item.queueName,
            loctionArr: [item],
          })
        } else {
          newArr[index].loctionArr.push(item)
        }
      })
      return newArr
    },
    initchart(data) {
      let mycharts = echarts.getInstanceByDom(
            this.$refs.chart
        )
      let that = this
      const val = this.getNewArr(data)
      const xAxisData = []
      for (let i = 0; i < data.length; i++) {
        if (!xAxisData.includes(data[i].createdTime)) {
          xAxisData.push(data[i].createdTime)
        }
      }
      
      // const addlist = []
      var seriesList = []
      // const lendlist = []
      for (const i in val) {
        // addlist.push(val[i].loctionArr)
        const dataval = val[i].loctionArr
        const add = []
        const add2 = []
        const colorlist = rgbArray(val.length)
        if (this.typeQueue === 'm') {
          dataval.forEach(item => {
            add.push([item.createdTime, item.usedMemoryCapacityPercent, item.queueName])
            add2.push([item.createdTime, item.usedCoresCapacityPercent, item.queueName])
          })
          // dataval.forEach(item => {
          //   add2.push([item.createdTime, item.usedCoresCapacityPercent, item.queueName])
          // })
        } else {
          dataval.forEach(item => {
            add.push([item.createdTime, item.avgMemoryPercent, item.queueName])
            add2.push([item.createdTime, item.avgCpuPercent, item.queueName])
          })
          // dataval.forEach(item => {
          //   add2.push([item.createdTime, item.avgCpuPercent, item.queueName])
          // })
        }
        seriesList.push(
          {
          // name: val[i].queueName,
          name: '内存',
          type: 'line',
          // data: dataval.map(item => item.usedCapacityPercent)
          data: add,
          showSymbol: false,
          color: colorlist[i].background,
          connectNulls:false
        }, {
          // name: val[i].queueName,
          name: 'cpu',
          type: 'line',
          // data: dataval.map(item => item.usedCapacityPercent)
          data: add2,
          showSymbol: false,
          color: colorlist[i].background,
          connectNulls:true,
          itemStyle: {
            // color: colorlist[i].background,
            normal: {
              lineStyle: {
                type: 'dashed',
                color: colorlist[i].background,
              }
            },
          },
          // encode: {
          //   itemName: 'Year',
          // }
        })
        // lendlist.push({
        //   name: val[i].queueName,
        //   icon: 'rect'
        // })
      }
      if (mycharts) {
          mycharts.dispose()
      }
      mycharts = echarts.init(this.$refs.chart)
      let option = {
        visualMap: false,
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //   type: 'cross'
            // },
            // order: 'valueDesc',
            formatter: function(param) {
              // console.log(param)
              // console.log(param[0].name)
              let html = ''
              let paramsData = _.sortBy(param, 'value[1]')
              paramsData = _.reverse(paramsData)
              html += '<div>' + paramsData[0].name + '</div>'
              for(let k in paramsData ) {
                html += '<div>'
                html +=
                  '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
                  paramsData [k].color +
                  '"></i>'
                html +=
                  '<span>' + 
                    // paramsData[k].name +
                    // paramsData [k].seriesName + '+' +
                    // that.add +
                    paramsData [k].value[2] + ' ' +
                    '(' + paramsData [k].seriesName + ')' +
                  // param[k].seriesName +
                  '</span>: ' +
                 (paramsData [k].value[1] + '%')
                html += '</div>'
              }
              // for(let k in param) {
              //   html += '<div>' + param[k].name + '</div>'
              //   html += '<div>'
              //   html +=
              //     '<i style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; line-height: 10px; margin-right: 5px; background: ' +
              //     param[k].color +
              //     '"></i>'
              //   html +=
              //     '<span>' + 
              //       param[k].seriesName +
              //       // that.add +
              //       param[k].value[2] + ' ' +
              //     // param[k].seriesName +
              //     '</span>: ' +
              //    (param[k].value[1] + '%')
              //   html += '</div>'
              // }
                return html
            }
        },
        backgroundColor: '#FFFFFF',
        legend: {
          // data: lendlist,
            data: [{
                name: '内存',
                icon: 'path://M908.49 562.043H754.526c-23.01 114.216-123.222 200.183-243.363 200.183S290.81 676.259 267.8 562.043H113.836c-27.431 0-49.667-22.405-49.667-50.044 0-27.64 22.236-50.044 49.667-50.044H267.8c23.01-114.216 123.222-200.183 243.363-200.183s220.353 85.967 243.363 200.183H908.49c27.431 0 49.666 22.404 49.666 50.044 0 27.64-22.236 50.044-49.666 50.044zM511.163 361.865c-82.291 0-148.998 67.218-148.998 150.135s66.707 150.135 148.998 150.135S660.16 594.917 660.16 512s-66.706-150.135-148.997-150.135z',
            },{
                name: 'cpu',
                icon: 'path://M304.43 532.76H221.4c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76zM581.19 532.76H442.81c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h138.38c11.47 0 20.76 9.3 20.76 20.76s-9.3 20.76-20.76 20.76zM802.59 532.76h-83.03c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76z'
            }],
            top: 8,
            left: 20,
            // itemWidth: 10,
            // itemHeight:10,
        },
        grid: {
            left: '60',
            right: '4%',
            top: '18%',
            bottom: '10%'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          name: '时间',
          boundaryGap: false
        },
        yAxis: {
            show: true,
            name: '队列使用率(%)',
            type: 'value',
            // boundaryGap: [0, '100%'],
            // min: 0,
            position: 'left',
            axisLine: {
                // show: true,
                lineStyle: {
                    color: '#6E7079'
                }
            },
            axisLabel: {
              show: true,
              formatter: '{value}%'
            }
            
        },
        series: seriesList
      }
      mycharts.setOption(option)
      window.addEventListener('resize', function() {
        mycharts.resize()
      })
    },
    commanFun() {
      let [start, end] = this.trendDate
      let param = {}
      const queueNameList = []
      if (this.form.queueName) {
        queueNameList.push(this.form.queueName)
      } else {
        this.projeectList1.forEach(item => {
          queueNameList.push(item.queueName)
        })
      }
      if (this.timeRange === '0') {
        param = {
          queueNameList: queueNameList + '',
          projectName: this.form.deployName || this.deployName2 || undefined,
          queueMan: this.form.userName || undefined,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          timeRange: this.timeRange,
          startDate: dateFormat(start) + ' ' + dateFormat2(start),
          endDate : dateFormat(end) + ' ' + dateFormat2(end)
        }
      } else {
        param = {
          queueNameList: queueNameList + '',
          // projectName: this.form.deployName || undefined,
          projectName: this.form.deployName || this.deployName2 || undefined,
          queueMan: this.form.userName || undefined,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          timeRange: this.timeRange
        }
      }
      return param
    },
    //接口
    async getQueueDetail() {
      this.loading++
      const res = await this.$simpleAsyncTo(getQueueDetail(this.commanFun()), '')
      if (res) {
        this.typeQueue = res.data.type
        this.tableData = res.data.pageInfo.totalList
        // this.type = res.data.type
        this.count = res.data.pageInfo.total
      }
      this.loading--
    },
    async getQueueDetail2() {
      this.loading++
      const params = {
        ...this.commanFun(),
        pageSize: -1,
        pageNo: -1
      }
      const res = await this.$simpleAsyncTo(getQueueDetail(params), '')
      if (res) {
        this.typeQueue = res.data.type
        this.trendList = res.data.pageInfo.totalList
        this.initchart(this.trendList)
      }
      this.loading--
    },
    async getProject() {
     
      const res = await this.$simpleAsyncTo(getProject(), '获取下拉列表项目失败') 
      if (res) {
          this.typeList = res.data
          this.deployList = res.data
      }
    },
    // async getDictList() {
    //   const res = await this.$simpleAsyncTo(getDictList(), '')
    //   if (res) {

    //   }
    // },
    async getProjectQueue() {
      const param = {
        // deployName: this.form.deployName || undefined,
        deployName: this.form.deployName || this.deployName2 || undefined,
        userName: this.form.userName || undefined,
        queueName: this.form.queueName || undefined
      }
      const res = await this.$simpleAsyncTo(getProjectQueue(param), '')
      if (res) {
        this.projeectList = res.data
        if (!this.form.queueName) {
          this.projeectList1 = res.data
        }
        if (!this.form.userName) {
          this.projeectList2 = res.data
        }
        // if (this.form.deployName === '') {
        //   this.typeList = this.projeectList
        // }
      }
    },
    async getDictList() {
      const res = await this.$simpleAsyncTo(getDictList({type: 'yarn_resource_trend'}), '获取列表失败')
      if (res) {
        this.dictList = res.data
      }
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
.dispatch {
  .head {

  }
  // .el-form {
  //   .el-form-item {
  //     .el-form-item__label-wrap {
  //       .el-form-item__label {
  //         padding: 0; //这里是左侧,覆盖padding
  //       }
  //     }
  //     .el-form-item__content {
  //       // el-form-item__label中padding-right修改为0，el-form-item__content中padding-left修改，
  //       // 解决label-width=auto在ie浏览器内核下auto失败的问题
  //       padding: 0 0 0 30px;
  //     }
  //     .el-form-item__error {
  //       padding: 0 0 0 30px; //配合 el-form-item__content修改padding, 这里是错误提示信息,也应加入padding
  //     }
  //   }
  // }

  .head-bottom {
    display: flex;
    background-color: #F5F5F5;
    width: 99%;
    min-width: 790px;
    .el-form{
      // margin-left: 10px;
      // border: 1px solid slateblue;
      // display: flex;
      // flex-wrap: wrap;
    }
    .el-form-item {
      .el-form-item__label-wrap{
        padding: 0;
      }
      .el-form-item__content {
        // padding: 0 0 0 30px;
        .el-date-editor {
          width: 350px;
        }
      }
      .el-form-item__error {
        padding: 0 0 0 30px;
      }
    }
  }
  .flex {
    margin-top: 10px;
    background-color: #F5F5F5;
    width: 99%;
    .el-table {
      margin: 10px;
    }
  }
  .chart-title {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .chart{
    width: 99%;
    height: 400px;
    background-color: #F5F5F5;
    // margin: 0 auto;
    // div {
    //   width: 50%;
    // }
    canvas {
      width: 50%;
    }
  }
  .project-name-td {
    display: flex;
    align-items: center;
    height: 30px;
    .iconfont {
      font-size: 28px;
      color: #68b6b0;
      // font-size: 28px;
      margin-right: 8px;
    }
  }
}

</style>

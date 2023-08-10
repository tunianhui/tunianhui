<template>
    <section class="platform-self">
      <div class="tips">
        <el-tooltip class="item" effect="dark" content="请参看说明文档及时处理" placement="top">
          <div slot="content"><span>打分规则：</span>{{ score.scoreExplain }}</div>
          <!-- <a :href="@/goverDoc.html" class="link" target="_blank">说明文档</a> -->
          <span>该治理项扣分：
            <span class="count">{{noDealpoint}}</span>分;{{score.itemComments}}，
            请参看<a href="/self/goverDoc.html" class="link" target="_blank">说明文档</a>及时处理。
          </span>
        </el-tooltip>
      </div>
      <div class="mb-10">
        <div class="flex">
          <el-select v-model="form.deployName" filterable clearable placeholder="请选择项目" @change.self="changehandle">
            <el-option v-for="item in typeList1" :key="item.projectId" :label="item.projectName" :value="item.deployName">
            </el-option>
          </el-select>
          <el-input v-model="form.objectName"  prefix-icon="el-icon-search" @change="changehandle" clearable placeholder="请输入对象名称" class="input-value ml-10 mr-10"></el-input>
          <el-select filterable v-model="form.dealState" clearable placeholder="请选择状态" @change.passive="changehandle">
            <el-option v-for="item in typeList2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
  
      <el-card>
        <el-table :key="Math.random()" ref="multipleTable"  :data="data" border style="width: 100%" v-loading="!!loading" @cell-click="handleSelectionChange" fit>
          <!-- <el-table-column  align="center" width="45">
          </el-table-column> -->
          <el-table-column v-if="verifica.code === 'A0001'"  prop="objectName" label="表名" min-width="200">
            <template slot-scope="{row}">
              <span class="icon iconfont icon-shougongbiaoqian" style="margin-right: 10px;"></span>
              <!-- <span class="ml-10">{{row.objectName}}</span> -->
              <a href="javascript:void(0)">{{row.objectName}}</a>
              <!-- <a >{{row.objectName}}</a> -->
            </template>
          </el-table-column>
          <el-table-column v-if="verifica.code === 'A0002'" prop="projectName" label="项目名称" min-width="200" >
            <template slot-scope="{row}">
              <span class="icon iconfont icon-shougongbiaoqian"></span>
              <span class="ml-10">{{row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="verifica.code === 'A0002'" prop="objectName" label="对象名称" min-width="120"></el-table-column>
          <el-table-column v-if="verifica.code === 'A0001'"  prop="projectName" label="项目名" min-width="120">
          </el-table-column>
          <el-table-column   prop="goverName" label="负责人"  show-overflow-tooltip min-width="120"></el-table-column>
          <el-table-column v-if="verifica.code === 'A0002'"  label="类型"  show-overflow-tooltip min-width="120" prop="comType">
            <template slot-scope="{row}">
              <span>{{ row.comType === 0 ? '任务' : '队列' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPoint" label="健康分" sortable show-overflow-tooltip min-width="90"></el-table-column>
          <el-table-column v-if="verifica.code === 'A0001'"  prop="dataSize" label="存储大小(G)" sortable min-width="114">
            <template slot-scope="{row}">
              <span>{{row.dataSize}}</span>
              <!-- <span class="unit">G</span> -->
            </template>
          </el-table-column>
          <el-table-column v-if="verifica.code === 'A0001'"  show-overflow-tooltip  prop="lifeCycle" label="生命周期" sortable min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.lifeCycle === "0" ? '永久' : scope.row.lifeCycle + '天'}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="verifica.code === 'A0002'"   prop="taskCost" label="计算消耗" sortable min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.taskCost}}</span>
              <span>{{ scope.row.taskCostUnit }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="proceState" label="审批结果" min-width="100">
            <template slot-scope="{row}">
                <span>{{ row.proceState === 0 ? '待提交审批' : row.proceState === 1 ? '审批中' : row.proceState === 2 ? '审批通过' : '审批不通过' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dealState" label="处理状态" min-width="100">
            <template slot-scope="{row}">
                <span>{{ row.dealState === 0 ? '未处理' : '已处理' }}</span>
            </template>
          </el-table-column>
          <!-- min-width="120px" -->
          <el-table-column label="操作" style="white-space: nowrap; display: inline-block;">
            <template slot-scope="scope" >
              <!-- <div style="float: left;margin-left: 10px;" v-for="item in detailed" :key="item.key" :value="item.buttonAction" :lable="item.buttonAction">
                <el-button 
                :disabled="(scope.row.dealState === 1 || scope.row.whiteState === 1 || scope.row.proceState === 1) 
                && (item.buttonAction === 'I0003' || item.buttonAction === 'I0006' || item.buttonAction === 'I0007' || item.buttonAction === 'I0001') "  
                    type="primary" 
                    @click="handleDelete({data: scope.row,buttonAction: item.buttonAction})">{{ item.buttonName }}</el-button> -->
                  <!-- <el-tooltip class="item" effect="dark" placement="top" >
                    <div slot="content">{{ item.buttonName }}</div>
                    <el-button :disabled="(scope.row.dealState === 1 && item.buttonAction === 'I0003') 
                    || (scope.row.whiteState === 1 && item.buttonAction === 'I0006')"  
                    type="primary" 
                    @click="handleDelete({data: scope.row,buttonAction: item.buttonAction})">{{ item.buttonName }}</el-button>
                  </el-tooltip> -->
                <!-- </div> -->
                <!-- <el-tooltip class="item" effect="dark" content="" placement="top" v-for="item in operation" :key="item.buttonAction" :lable="item.buttonAction">
                  <div slot="content">{{ item.buttonName }}</div>
                  <el-button :disabled="scope.row.dealState === '1'"  type="primary" @click="handleDelete({data: scope.row,buttonAction: item.buttonAction})">{{ item.buttonName }}</el-button>
                </el-tooltip> -->
                <div class="optionDiv'" style="white-space: nowrap; display: inline-block;" v-for="item in detailed" :key="item.key" :value="item.buttonAction" :lable="item.buttonAction">
                  <el-tooltip class="item" effect="dark" content="" placement="top">
                    <div slot="content">{{ item.buttonName }}</div>
                    <el-button :disabled="(scope.row.dealState === 1 || scope.row.whiteState === 1 || scope.row.proceState === 1) 
                     && (item.buttonAction === 'I0003' || item.buttonAction === 'I0006' || item.buttonAction === 'I0007' || item.buttonAction === 'I0001') "  
                    type="text" @click="handleDelete({data: scope.row,buttonAction: item.buttonAction})">
                    <i :class='item.icon'></i>
                  </el-button>
                  </el-tooltip>
                </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-pagination
      class="fr pt-10 pb-10"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="form.pageNo"
      :page-sizes="[15, 25, 50, 100]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="count">
      </el-pagination>
  
      <!-- <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="handleLifeCycle" @batchDel="handleDelete"></SelectFooter> -->
  
      <!-- 设置弹窗 -->
      <el-dialog title="生命周期设置" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
        <el-form ref="lifeCycleform" :model="formData" :rules="rules" label-width="100px" label-suffix="：">
          <el-form-item label="生命周期" prop="lifeCycle">
            <el-radio-group v-model="formData.lifeCycle" @input="lifehandle">
              <el-radio :label="1">1天</el-radio>
              <el-radio :label="2">7天</el-radio>
              <el-radio :label="3">32天</el-radio>
              <el-radio :label="4">365天</el-radio>
              <el-radio :label="5">其他</el-radio>
            </el-radio-group>
            <el-input v-model="formData.num" maxlength="5" placeholder="请输入数字" class="num-input"></el-input>
            <span>天</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">设 置</el-button>
        </span>
      </el-dialog>
      <el-dialog title="iceberg元数据优化设置" :visible.sync="dialogVisible1" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
        <el-form ref="icebergform" :model="iceformData"  :rules="rules" label-width="120px" label-suffix="：">
          <el-form-item label="快照保留时间" prop="iceSnapTime">
            <el-radio-group v-model="iceformData.iceSnapTime" @input="iceberghandle">
              <el-radio :label="1">1小时</el-radio>
              <el-radio :label="12">12小时</el-radio>
              <el-radio :label="24">24小时</el-radio>
              <el-radio :label="4">其他</el-radio>
            </el-radio-group>
            <el-input v-model="iceformData.iceSnapTimeOut" maxlength="5" placeholder="请输入数字" class="num-input"></el-input>
            <span>小时</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="icesubmitForm">设 置</el-button>
        </span>
      </el-dialog>

      <el-dialog class="dialog" title="转交责任人选择" :visible.sync="dialogVisible2" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
        <el-form class="menNameform" ref="menNameform"    label-width="120px" label-suffix="：">
          <el-form-item label="责任人名称">
            <el-input v-model="menName" placeholder="请输入责任人" clearable=""></el-input>
            <el-button @click="getProjectMenList">查询</el-button>
          </el-form-item>
          <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          @current-change="selectProjectMen"
          border
          style="width: 100%">
          <el-table-column
           label="选择">
            <template slot-scope="{row}">
              <el-radio v-model="radio" @input="selsectRadio(row)" :label="row">{{""}}</el-radio>
              <!-- <el-checkbox v-model="checked" @click="handle(row)"></el-checkbox> -->
            </template>
          </el-table-column>
          <el-table-column
            property="date"
            prop="menName"
            label="责任人">
          </el-table-column>
        </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="setButton">设 置</el-button>
        </span>
      </el-dialog>
      <!-- 详情按钮 -->
      <detailsPage v-if="visible" :formList="detailsList" @close="close"></detailsPage>
    </section>
  </template>
  
  <script>
  import SelectFooter from './footer'
  import pager from '@/mixins/pager'
  import detailsPage from '@/views/asset/govern/item-manage/icebergtraceability/dialogPage'
  import { getProject, offlineDeal, getSysdict, setItemWhite, dropTable, icebergMetaOptimize, setLifeCycle, getProjectMenList, transferGoverName, icebergDataOptimize} from '@/api/govern/platform'
  import {getTableTrace} from '@/api/govern/item-manage'
// import { width } from '../../../../../components/ops-flow/node'
// import json5 from 'json5'
  export default {
    name: 'PlatformSelf',
    components: {
      SelectFooter,
      detailsPage
    },
    props: {
        score: Object,
        data: Array,
        operation: Array,
        verifica: Object,
        count: Number,
        selectIndex3: Number,
        selectIndex: Number,
        selectIndex2: Number,
        sourceType: String,
        noDealpoint: Number,
    },
    mixins: [pager],
    data () {
      return {
        detailsList: {},
        visible: false,
        checked: '',
        menName: '',
        radio: '',
        iceformData: {
          iceSnapTime: '',
          iceSnapTimeOut: '',
        },
        typeList1: [],
        typeList2: [],
        form: {
            deployName: '',
            objectName: '',
            dealState: '',
            pageSize: 15,
            pageNo: 1,
        },
        // total: 0,
        formData: {
          lifeCycle: '',
          num: ''
        },
        rules: {
          lifeCycle: [
            { required: true, message: '必填项', trigger: 'change' }
          ],
          iceSnapTime: [
            { required: true, message: '必填项', trigger: 'change' }
          ]
        },
        loading: 0,
        tableData: [],
        multipleSelection: [],
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        springData: '',
        newLifecycle: '',
        iscode: true,
        isdisabled: false,
        detailed: [],
        // tableData: [],
        actionList: ['I0008', 'I0009', 'I0010', 'I0011', 'I0012']
      }
    },
    watch: {
      operation: {
        handler(val) {
          this.detailed = []
          const inforList = []
          val.forEach((item) => {
            // debugger
            // if (item.buttonAction === 'I0008' || item.buttonAction === 'I0009' || item.buttonAction === 'I0010' || item.buttonAction === 'I0011' || item.buttonAction === 'I0012') {
            //   inforList.push(item) 
            // }
            if (this.actionList.includes(item.buttonAction)) {
              inforList.push(item) 
            }
          })
          if (inforList.length > 0) {
            this.detailed = val.filter(item => {
              return item.buttonAction !== inforList[0].buttonAction
            })
          } else {
            this.detailed = val
          }
          
        }
      },
      data: {
        handler(val) {
          // this.iscode = !val ? false : val.code === 'A0001' ? true : false
          val.forEach((index, j) => {
            this.operation.forEach(item => {
            })
          })
        }
      }
    },
    mounted () {
        this.getProject()
        this.getSysdict()
    },
    updated() {
    },
    methods: {
      // renderHeader(h, { column, $index }) {
      //   const opt = document.getElementsByClassName('optionDiv')
      //   let widthArr = []
      //   Array.prototype.forEach.call(opt, item => {
      //     if (item.innerText) {
      //       widthArr.push(item.offsetWidth)
      //     }
      //   })
      //  
      //   if (widthArr.length > 0) {
      //     column.width = Math.max(...widthArr) + 24
      //     return h('span', column.label)
      //   } else {
      //     column.width = 0
      //     return h('span', column.label)
      //   }
      //   // // 取操作组的最大宽度
      //   // Array.prototype.forEach.call(opts, function (item) {
      //   //   if (item.innerText) {
      //   //     widthArr.push(item.offsetWidth);
      //   //   }
      //   // })
      //   // // 重新设置列标题及宽度属性
      //   // if (widthArr.length > 0) {
      //   //   column.width = Math.max(...widthArr) + 24;
      //   //   return h('span', column.label);
      //   // } else {
      //   //   column.width = 0;
      //   //   return h('span', column.label);
      //   // }
      // },
      handleSelectionChange (row, column) {
        row.sourceType = this.sourceType
        if (column.label === '表名' || column.label === '项目名称') {
          this.operation.forEach(item => {
          if (item.buttonAction === 'I0008') {
            this.getTableTrace(row)
              // this.visible  = true
              // this.detailsList = row
            }
          })
        }
      },
      // 关闭
      close() {
        this.visible =  false
      },
      selsectRadio(val) {
      },
      selectProjectMen(val) {
        this.radio = val
      },
      //设置按钮
      setButton() {
        if (this.radio === '') {
          this.$alert('<strong>您没有选择责任人，请选择责任人后再提交</strong>', '提示', {
            dangerouslyUseHTMLString: true
          })
        } else {
          const data = this.springData.data
          const params = {
            code: data.code,
            id: data.itemId,
            newGoverName: this.radio.projectMan,
            oldGoverName: data.goverName
          }
          transferGoverName(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '成功'
              })
              this.dialogVisible2 = false
            }
          })
        }
      },
      handleSizeChange(val) {
        this.form.pageSize = val
        this.handleCurrentChange(1)
      },
      handleCurrentChange(val) {
        this.form.pageNo = val
        this.$emit('select', this.form)
      },
      searchChange (val) {
      },
      // checkAllChange (boolean) {
      //   if (boolean) {
      //     this.tableData.forEach(item => {
      //       this.$refs.multipleTable.toggleAllSelection(item)
      //     })
      //   } else {
      //     this.$refs.multipleTable.clearSelection()
      //   }
      // },
      changehandle(val) {
        this.$emit('select', this.form)
      },
      springFrame(data) {
        if (data.buttonAction === 'I0004') {
          this.dialogVisible = true
        } else {
          this.dialogVisible1 = true
        }
      },
      //白名单设置
      setWhotelist(data) {
        this.$confirm('请问是否提交白名单设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            ...this.verifica,
            // itemId: data.itemId,
            itemId: data.code === 'A0001' ? data.storageId : data.itemId,
            objectName: data.objectName
          }
          setItemWhite(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '成功'
              })
              this.changehandle()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      //drop审批
      dropTableHandle(data) {
        
        this.$confirm('请问是否发送drop审批?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          const params = {
            code: data.code,
            objectCode: data.objectCode,
            itemCode: data.itemCode,
            objectName: data.objectName,
            dbName: data.dbName,
            itemId: data.itemId
          }
          dropTable(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '成功'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      //合并元数据小文件
      icebergData() {
        this.$confirm('请问是否合并小文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = this.springData.data
          const params = {
            code: data.code,
            objectCode: data.objectCode,
            itemCode: data.itemCode,
            objectName: data.objectName,
            dbName: data.dbName,
            id: data.itemId,
          }
          icebergDataOptimize(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '成功'
              })
            }
          })
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      },
      handleDelete (item) {
        this.buttonAction = item.buttonAction
        this.springData = item
        if (item.buttonAction === 'I0003') {
          this.$confirm('请问是否申请线下治理?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // storageId
          const params = {
            ...this.verifica,
            id: item.data.code === 'A0001' ? item.data.storageId : item.data.itemId
            // id: item.data.itemId
          }
          offlineDeal(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.changehandle()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
        } else if (item.buttonAction === 'I0006') {
          this.setWhotelist(item.data)
        } else if (item.buttonAction === 'I0002') {
          this.springFrame(item)
        } else if (item.buttonAction === 'I0007') {
          this.getProjectMenList()
        } else if (item.buttonAction === 'I0001') {
          this.dropTableHandle(item.data)
        } else if (item.buttonAction === 'I0005') {
          this.icebergData()
        } else {
          if (item.buttonAction === 'I0008') {
            this.visible  = true
          }
          // const verifica = {
          //   ...this.verifica,
          //   selectIndex3: this.selectIndex3,
          //   selectIndex: this.selectIndex,
          //   selectIndex2: this.selectIndex2
          // }
          // window.localStorage.setItem('verifica', JSON.stringify(verifica))
          // if (item.buttonAction === 'I0008') {
          //   this.$router.push('/asset/govern/item-manage/hivetraceability')
          // } else if (item.buttonAction === 'I0009') {
          //   this.$router.push('/asset/govern/item-manage/hdfstraceability')
          // } else if (item.buttonAction === 'I0010') {
          //   this.$router.push('/asset/govern/item-manage/icebergtraceability')
          // } else if (item.buttonAction === 'I0011') {
          //   this.$router.push('/asset/govern/item-manage/yarnqueue')
          // } else if (item.buttonAction === 'I0012') {
          //   this.$router.push('/asset/govern/item-manage/yarntask')
          // }
        }
      },
      // 暂停
      handleSuspend (item) {
        this.$confirm('系统不支持恢复已暂停的表，请您谨慎操作，确认暂停?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
  
      // 生命周期
      handleLifeCycle (item) {
        this.dialogVisible = true
      },
      lifehandle(val) {
        if (val !== 5) {
          this.formData.num = ''
          this.newLifecycle = val === 2 ? '7' : val === 3 ? '32' : val === 4 ? '365' : '1'
        } else {
          this.newLifecycle = this.formData.num
        }
      },
      iceberghandle(val) {
        if (val !== 4) {
          this.iceformData.iceSnapTimeOut = ''
        }
      },
  
      // 设置生命周期
      submitForm () {
        this.$refs.lifeCycleform.validate(async valid => {
          if (valid) {
            const data = this.springData.data
            if (this.formData.lifeCycle === 5 ) {
              this.newLifecycle = this.formData.num
            }
            const params = {
              newLifecycle: this.newLifecycle,
              code: data.code,
              objectCode: data.objectCode,
              itemCode: data.itemCode,
              objectName: data.objectName,
              dbName: data.dbName,
              id: data.itemId,
            }
            setLifeCycle(params).then(res => {
              if (res.code === 0) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: '设置成功！'
                })
              }
            })
          }
        })
      },
      //iceberg元数据优化设置
      icesubmitForm() {
        this.$refs.icebergform.validate(async valid => {
          if (valid) {
            const data = this.springData.data
            const params = {
              code: data.code,
              objectCode: data.objectCode,
              itemCode: data.itemCode,
              objectName: data.objectName,
              dbName: data.dbName,
              id: data.itemId,
              iceSnapTimeOut: this.iceformData.iceSnapTime === 4 ? Number(this.iceformData.iceSnapTimeOut) : this.iceformData.iceSnapTime,
            }
            icebergMetaOptimize(params).then(res => {
              if (res.code === 0) {
                this.dialogVisible1 = false
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                })
              }
            })
          }
        }) 
      },
      //   下拉列表
      async getProject() {
        const res = await this.$simpleAsyncTo(getProject(), '获取下拉列表项目失败') 
        if (res) {
            this.typeList1 = res.data
        }
      },

      //按钮选择
      async getSysdict() {
        const res = await this.$simpleAsyncTo(getSysdict({dictType: 'OFFLINE_DEAL_STATE'}), '')
        if (res) {
          this.typeList2 = res.data
        }
      },
      // 获取转交责任人列表
      async getProjectMenList() {
        const params = {
          menName: this.menName,
        }
        const res = await this.$simpleAsyncTo(getProjectMenList(params), '获取责任人列表失败')
        if (res) {
          this.tableData = res.data
          this.dialogVisible2 = true
        }
      },
      async getTableTrace(data) {
        const params = {
          sourceType: data.sourceType || undefined,
          tblName: data.objectName || undefined,
          datasourceIdList: data.datasourceId,
          pageSize: 15,
          pageNo: 1,
        }
        const res = await this.$simpleAsyncTo(getTableTrace(params), '获取表溯源列表失败')
        if (res) {
          // this.tableData = res.data.totalList
            this.visible  = true
            this.detailsList = res.data.totalList[0]
        }
      }
    }
  }
  </script>
  
  <style lang="scss">
  .platform-self {
    .search-wrapper {
      padding: 10px;
      background-color: #fff;
      margin-bottom: 10px;
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
    .tips {
      font-size: 14px;
      padding: 5px 10px;
      background-color: #d7dcef;
      border: 1px solid #c5cbea;
      margin-bottom: 10px;
      .count {
        font-size: 18px;
        font-weight: bold;
        color: #000e7f;
        margin-left: 5px;
        margin-right: 5px;
      }
      .link {
        font-weight: bold;
        color: #000e7f;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
    .icon {
      font-size: 24px;
      color: #4783ff;
    }
    .count {
      color: #4783ff;
    }
    .unit {
      color: #999;
      margin-left: 5px;
    }
    .input-value {
      width: 200px;
    }
    .num-input {
      width: 100px;
      margin-left: 5px;
      margin-right: 5px;
    }
    .dialog {
      .el-dialog__body {
        .el-form .el-form-item__content{
          display: flex;
          .el-button {
            margin-left: 40px;
          }
          .el-input {
            width: 50%;
          }
        }
      }
      
    }
    .menNameform {
      .el-table {
        height: 350px;
        overflow: auto;
      }
    }
  }
  </style>
  
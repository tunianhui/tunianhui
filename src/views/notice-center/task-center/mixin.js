import pager from '@/mixins/pager'
import {dateFormat} from '@/libs/util'
import {
  getToDoDetail,
  getToDoDetail1,  //工单审批
  getPassTask,
  getRejectTask
} from '@/api/notice/task-center/index.js'
export default {
  mixins: [pager],
  data() {
    return {
      inputName: '',
      isShow: 'home',
      baseinfo: {},
      baseinfo1:{},
      tableOptions:[],
      baseinfoTable: {},
      value:'',
      untils: [
        {
          label: '30天',
          value: '1'
        },
        {
          label: '90天',
          value: '2'
        },
        {
          label: '180天',
          value: '3'
        },
        {
          label: '长期',
          value: '4'
        },
        {
          label: '自定义',
          value: '5'
        }
      ],
      grantConfig: {
        expire_type: '1',
        expire_time: this.formatTime(30),
        reason: ''
      },
      auth_type: '查询',
      number_type: '个人账号',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      disabled: true,
      approvalInfo: {
        message: '',
        reject: ''
      },
      approvalInfoRules: {
        reject: [{required: true, message: '请选择审批结果', trigger: 'blur'}]
      },
      proc_inst_id: '',
      loadingTable: false
    }
  },
  methods: {
    inputNameChange(val, type) {
      this.inputName = val
      this.pageFilters.pageNo = 1
      this.getTableList()
    },

    async getToDoDetail(id, type, flag) {
      this.loadingTable = true
      const params = {
        proc_inst_id: id,
        type
      }
      const res = await this.$simpleAsyncTo(
        getToDoDetail(params),
        '获取明细信息失败'
      )
      if (res) {
        if (flag !== 'table') {
          this.baseinfo = res.data.param
          this.grantConfig.expire_type = res.data.param.expire_type
          this.grantConfig.expire_time = res.data.param.expire_time
          this.grantConfig.reason = res.data.param.reason
          this.approvalInfo.message = res.data.param.message
          this.approvalInfo.reject = res.data.param.reject
          this.auth_type = res.data.param.auth_type
          this.number_type = res.data.param.number_type
        } else {
          this.baseinfoTable = {
            ...res.data.param,
          }
        }
      }
      this.loadingTable = false
    },

    // 工单审批

    async getToDoDetail1(id, type) {
      const params = {
        proc_inst_id: id,
        type
      }
      const res = await this.$simpleAsyncTo(
        getToDoDetail1(params),
        '获取明细信息失败'
      )
      if (res) {
        this.baseinfo1 = res.data.param
        // let param = res
        this.tableOptions = []
        this.baseinfo1.forEach((item,index) =>{
          this.tableOptions.push({value:item.table_code,label:item.table_code})
          if (index == 0){
            this.value = item.table_code
            this.baseinfo = item.table_info
            this.baseinfo.table_info = item.column_info
             this.grantConfig.expire_type = res.data.param.expire_type
        this.grantConfig.expire_time = res.data.param.expire_time
        this.grantConfig.reason = res.data.param.reason
        this.approvalInfo.message = res.data.param.message
        this.approvalInfo.reject = res.data.param.reject
        this.auth_type = res.data.param.auth_type
        this.number_type = res.data.param.number_type
          }
        })
        
        // this.options
        // this.grantConfig.expire_type = res.data.param.expire_type
        // this.grantConfig.expire_time = res.data.param.expire_time
        // this.grantConfig.reason = res.data.param.reason
        // this.approvalInfo.message = res.data.param.message
        // this.approvalInfo.reject = res.data.param.reject
        // this.auth_type = res.data.param.auth_type
        // this.number_type = res.data.param.number_type
      }
    },
    expireTypeChange(val) {
      switch (val) {
        case '1':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(30)
          break
        case '2':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(90)
          break
        case '3':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(180)
          break
        case '4':
          this.disabled = true
          this.grantConfig.expire_time = this.formatTime(99999)
          break
        case '5':
          this.disabled = false
          break
      }
    },
    formatTime(day) {
      let n = new Date()
      let s = 60 * 60 * 24 * day * 1000
      let t = n.getTime()
      let nw = t + s
      return dateFormat(new Date(nw))
    },

    async confirm() {
      if (this.approvalInfo.reject === '') {
        return this.$message({type: 'error', message: '请选择审批结果'})
      }
      const params = {
        proc_inst_id: this.proc_inst_id,
        opinion: this.approvalInfo.message
      }
      let fn = null
      if (this.approvalInfo.reject) {
        fn = getRejectTask
      } else {
        fn = getPassTask
      }
      const res = await this.$simpleAsyncTo(fn(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.cancel()
      }
    },
    cancel() {
      this.isShow = 'home'
      this.pageFilters.pageNo = 1
      this.approvalInfo.message = ''
      this.getTableList()
    }
  }
}

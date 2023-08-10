/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-08-08 15:02:19
 * @Description:
 */
import {
  getWorkers,
  getEnvironments,
  getTaskGroups,
  getResources,
  getDatasourceEntitys,
  getMainJars,
  getWorkFlows,
  getProjectList,
  getListAll,
  getTaskList,
  getDictParams,
  getDictParamsByParent
} from '@/api/rd/integrate'
import {mapGetters} from 'vuex'
export default {
  inject: ['attrStore'],
  props: {
    id: String,
    nodeData: Object
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      tempList: [],
      tempIds: [],
      configData: {},
      // 任务优先级
      taskLevelList: [
        { name: 'HIGHEST', value: 1 },
        { name: 'HIGH', value: 2 },
        { name: 'MEDIUM', value: 3 },
        { name: 'LOW', value: 4 },
        { name: 'LOWEST', value: 5 }
      ],
      directList: [
        { name: 'IN' },
        { name: 'OUT' }
      ],
      typeList: [
        { name: 'VARCHAR' },
        { name: 'INTEGER' },
        { name: 'LONG' },
        { name: 'FLOAT' },
        { name: 'DOUBLE' },
        { name: 'DATA' },
        { name: 'TIME' },
        { name: 'TIMESTAMP' },
        { name: 'BOOLEAN' },
        { name: 'LIST' }
      ],
      dataSourceTypeList: [
        { name: 'MYSQL', value: 'MYSQL' },
        { name: 'POSTGRESQL', value: 'POSTGRESQL' },
        { name: 'HIVE', value: 'HIVE' },
        { name: 'SPARK', value: 'SPARK' },
        { name: 'CLICKHOUSE', value: 'CLICKHOUSE' },
        { name: 'ORACLE', value: 'ORACLE' },
        { name: 'SQLSERVER', value: 'SQLSERVER' },
        { name: 'DB2', value: 'DB2' },
        { name: 'PRESTO', value: 'PRESTO' },
        { name: 'REDSHIFT', value: 'REDSHIFT' },
        { name: 'ATHENA', value: 'ATHENA' }
      ],
      // SQL类型
      sqlTypeList: [
        { name: '查询', value: 0 },
        { name: '非查询', value: 1 }
      ],
      // 日志显示
      rowList: [1, 10, 25, 50, 100],
      // 请求类型
      httpMethodList: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
      httpParametersTypeList: ['PARAMETER', 'BODY', 'HEADERS'],
      // 校验条件
      httpCheckConditionList: [
        { name: '默认响应码200', value: 'STATUS_CODE_DEFAULT' },
        { name: '自定义响应码', value: 'STATUS_CODE_CUSTOM' },
        { name: '内容包含', value: 'BODY_CONTAINS' },
        { name: '内容不包含', value: 'BODY_NOT_CONTAINS' }
      ],
      // 程序类型
      programTypeList: [
        { name: 'JAVA', value: 'JAVA' },
        { name: 'SCALA', value: 'SCALA' },
        { name: 'PYTHON', value: 'PYTHON' },
        { name: 'SQL', value: 'SQL' }
      ],
      // Spark版本
      sparkVersionList: [
        { name: 'SPARK2', value: 'SPARK2' },
        { name: 'SPARK1', value: 'SPARK1' }
      ],
      // Flink版本
      flinkVersionList: [
        { name: '<1.10', value: '<1.10' },
        { name: '1.10', value: '1.10' },
        { name: '>1.12', value: '>1.12' }
      ],
      // 状态
      statusList: [
        { name: '成功', value: 'SUCCESS' },
        { name: '失败', value: 'FAILURE' }
      ],
      // Worker分组
      workersList: [],
      // 环境
      environmentsList: [],
      // 任务
      taskGroupList: [],
      // 数据源实例
      dataSourceList: [],
      // 资源
      resourcesList: [],
      // 主程序包
      mainJarList: [],
      // 子节点列表
      workFlowsList: [],
      // 项目列表
      projectList: [],
      // 任务列表
      depTaskList: [],
      // 前置任务 除了自己的所有节点，不含下游分支节点
      preTaskList: [],
      // 前置条件选择下拉框，只能选择当前节点的上游节点集合，需要根据当前流程获取
      preList: [],
      // 当前节点下游集合 分支流转下拉框，只能选择当前节点的下游节点集合，需要根据当前流程获取
      branchList: []
    }
  },
  created () {
    this.tempList = []
    this.ids = []
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    nodeData: {
      immediate: true,
      deep: true,
      handler (val) {
        if (val) {
          console.log('form-data-6-0', val)
          // ----->
          this.taskType = localStorage.getItem('taskType') || '3'
          this.configForm()
          const data = JSON.parse(JSON.stringify(val))
          this.form = {
            ...this.form,
            ...data
          }
        }
        console.log('form-data-6', this.form)
        this.getWorkFlowsData(this.project.skd_prj_id)
      }
    },
    'project.skd_prj_id': {
      handler (val) {
        this.getListData({skd_prj_id: val})
        // this.getWorkFlowsData(val)
      },
      immediate: true
    },
    'form.type': {
      handler (val) {
        if (val) {
          this.getDataSourceData(val)
        }
      }
    }
  },
  methods: {
    configForm () { },

    async getWorkersData () {
      const res = await getWorkers()
      if (res) {
        this.workersList = res.data
      }
    },

    async getEnvironmentsData () {
      const res = await getEnvironments()
      if (res) {
        this.environmentsList = res.data
      }
    },

    async getTaskGroupsData (val) {
      const res = await getTaskGroups({ skd_prj_id: val })
      if (res) {
        this.taskGroupList = res.data
      }
    },

    async getResourcesData () {
      const res = await getResources()
      if (res) {
        this.resourcesList = res.data
      }
    },

    async getDataSourceData (type) {
      const res = await getDatasourceEntitys({type})
      if (res) {
        this.dataSourceList = res.data
      }
    },

    async getMainJarList () {
      const res = await getMainJars()
      if (res) {
        this.mainJarList = res.data
      }
    },

    async getWorkFlowsData (val) {
      const res = await getWorkFlows({ skd_prj_id: val })
      if (res) {
        this.workFlowsList = res.data
      }
    },

    // 项目列表
    async getProjectData () {
      const res = await getProjectList()
      if (res) {
        this.projectList = res.data
      }
    },

    // 工作流流列表
    async getListData (data) {
      const res = await getListAll(data)
      if (res && res.flag) {
        this.definitionList = res.data
      }
    },

    // 任务列表
    async getTaskData (data) {
      const res = await getTaskList(data)
      if (res) {
        this.depTaskList = res.data
      }
    },

    // 代码表查询
    async getDictParamsData () {
      const res = await getDictParams()
      if (res && res.data) {
        this.taskCycleTypeList = res.data.task_cycle
      }
    },

    // 查询周期表达式
    async getDictParamsByParentData (code) {
      const res = await getDictParamsByParent({code})
      if (res) {
        this.taskCycleList = res.data
      }
    },

    // ---------------- 事件 ----------------------

    // 选择资源
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        this.tempList.push(data.name)
        this.ids.push({ id: data.id })
      } else {
        this.tempList = this.tempList.filter(ele => ele !== data.name)
        this.ids = this.ids.filter(ele => ele.id !== data.id)
      }
      // 展示数据用 未处理下一级
      this.$set(this.form, 'resourceNameList', this.tempList)
      this.$set(this.form, 'resourceList', this.ids)
      // const list = this.$refs.treeSelect.getCheckedNodes()
      this.$refs.treeSelect.blur()
    },

    // 选择主程序包
    handleNodeClick (data, node, e) {
      // 展示数据用
      this.$set(this.form, 'mainJarName', data.fullName)
      this.$set(this.form, 'mainJar', {id: data.id})
      this.$refs.mainJar.blur()
    },

    // 添加自定义参数
    handleAddParameters () {
      const data = { prop: '', direct: 'IN', type: 'VARCHAR', value: '', key: Date.now() }
      this.form.localParams.push(data)
    },

    // 删除自定义参数
    handleDelParameters (item, index) {
      this.form.localParams.splice(index, 1)
    }
  }
}

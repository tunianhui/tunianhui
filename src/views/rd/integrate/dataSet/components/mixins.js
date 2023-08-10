/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-03 09:59:05
 * @LastEditTime: 2023-07-12 17:58:36
 * @Description:
 */
import {mapGetters} from 'vuex'
export default {
  props: {
    id: String,
    nodeData: Object,
    nodes: Array,
    edges: Array
  },
  data() {
    return {
      keyword: '',
      // 动态 根据选择的表查询
      tableData: [],
      //
      fieldList: [
        {
          'fieldName': 'idc_id',
          'dataType': 'varchar(64)',
          'partitionKey': 'false',
          key: 1
        }
      ],
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

      // 数据源实例
      dataSourceList: [],
      // 前置任务 除了自己的所有节点，
      preTaskList: [],
      // 前置条件选择下拉框，只能选择当前节点的上游节点集合，需要根据当前流程获取
      preList: [],
      // 当前节点下游集合 分支流转下拉框，只能选择当前节点的下游节点集合，需要根据当前流程获取
      branchList: []
    }
  },
  created () {},
  mounted() {},
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    // nodes: {
    //   deep: true,
    //   handler (val) {
    //   }
    // },
    // edges: {
    //   deep: true,
    //   handler (val) {
    //   }
    // },
    // 激活节点都会响应
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        this.getDataSource()
        if (val.name) {
          this.form = val // 编辑
          this.filterType = !!this.form.filterWhere
        } else {
          // 初始化
          this.filterType = true
          this.dataSourceList = []
          this.dataSourceTableList = []
          this.tableData = []
          this.splitList = []
          this.columList = []
          this.fieldList = []
          this.$refs.form && this.$refs.form.resetFields()
          this.configForm()
        }
      }
    },
    'project.skd_prj_id': {
      handler (val) {

      },
      immediate: true
    }
  },
  methods: {
    // 初始化
    configForm () {
      this.form = {}
    }

    // ---------------- 事件 ----------------------

  }
}

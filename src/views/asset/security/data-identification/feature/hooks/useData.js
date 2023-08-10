/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-20 14:22:44
 * @LastEditTime: 2023-05-16 09:32:19
 * @Description:
 */
import {
  reactive,
  onBeforeMount,
  toRefs,
  computed,
  watch,
  ComponentInternalInstance,
  getCurrentInstance
} from 'vue'

import { getIdentifyList, saveIdentify, getIdentify, delIdentify } from '@/api/asset/feature.js'
import { getFeatureRecognizeType, getFeatureForm } from '@/api/asset/security.js'

export function usehook () {
  const state = reactive({
    title: '添加特征',
    showEdit: false,
    pageSizes: [10, 20, 30, 50],
    total: 0,
    tableData: [],
    matchTypeList: [
      {
        name: '字典匹配',
        value: '1'
      },
      {
        name: '规则匹配',
        value: '0'
      }
    ],
    identifyList: [
      {
        name: '内置',
        value: '1'
      },
      {
        name: '自定义',
        value: '0'
      }
    ],
    // 特征数据结构
    formData: {
      featureName: '',
      recognizeType: '0',
      dataType: '0',
      dic_type: '1',
      feature_rules: [
        {
          rule_way: '0',
          operate: 'AND',
          children: [
            {
              identify_item: '',
              recognize_way: '',
              match_rule: ''
            }
            // {
            //   operate: 'AND',
            //   children: [
            //     {
            //       identify_item: '',
            //       recognize_way: '',
            //       match_rule: ''
            //     }
            //   ]
            // }
          ]
        },
        {
          rule_way: '1',
          operate: 'AND',
          children: [
            {
              identify_item: '',
              recognize_way: '',
              match_rule: ''
            }
          ]
        }
      ]
    },
    rules: {
      featureName: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      recognizeType: [{ required: true, message: '请输入', trigger: 'blur' }],
      dataType: [{ required: true, message: '请输入', trigger: 'blur' }]
    },
    searchForm: {
      recognizeType: '0',
      featureFrom: '1',
      featureName: '',
      pageSize: 10,
      pageNo: 1
    },
    pageFilters: {
      pageSize: 10,
      pageNo: 1
    },
    ruleList1: [
      { name: '数据类型', value: 'col_type' },
      { name: '列备注', value: 'col_commen' },
      { name: '列名', value: 'col_name' },
      { name: '内容', value: 'content' }
    ],
    ruleList2: [
      { name: '正则表达式', value: 'regex' },
      { name: '包含', value: 'include' },
      { name: '不包含', value: 'not_include' }
    ],
    ruleList3: [
      'tinyint',
      'smallint',
      'mediumint',
      'int',
      'bigint',
      'decimal',
      'bit',
      'date',
      'datetime',
      'timestamp',
      'varchar',
      'text',
      'json'
    ]
  })

  const getMatchTypeData = async () => {
    const res = await getFeatureRecognizeType()
    if (res) {
      state.matchTypeList = res.data
    }
  }

  const getIdentifyData = async () => {
    const res = await getFeatureForm()
    if (res) {
      state.identifyList = res.data
    }
  }

  // 页码改变
  const handleCurrentChange = (val) => {
    state.pageFilters.pageNo = val
    state.searchForm.pageNo = val
    getList()
  }

  // 页容量改变
  const handleSizeChange = (val) => {
    state.pageFilters.pageSize = val
    state.searchForm.pageSize = val
    getList()
  }

  const getList = async () => {
    const res = await getIdentifyList(state.searchForm)
    if (res) {
      state.tableData = res.data.totalList
      state.total = res.data.total
    }
  }

  // 筛选列表
  function filterType (val) {
    getList()
  }

  const handleSure = async (formRef) => {
    await formRef.validate((valid, fields) => {
      if (valid) {
        sumbitData()
      }
    })
  }

  // 添加 & 编辑
  const sumbitData = async (data) => {
    const res = await saveIdentify(data)
  }

  const handleDel = async (id) => {
    const res = await delIdentify({ id })
    if (res.status === '0000') {
      getList()
    }

    // const instance = getCurrentInstance()
    // console.log(888, instance)

    // const { proxy } = getCurrentInstance() as ComponentInternalInstance

    // const { proxy } = getCurrentInstance()
    // console.log(888, proxy)

  // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // }).then(() => {
  //   this.$message({
  //     type: 'success',
  //     message: '删除成功!'
  //   })
  // }).catch(() => {
  //   this.$message({
  //     type: 'info',
  //     message: '已取消删除'
  //   })
  // })
  }

  onBeforeMount(() => {
    getList()
    getMatchTypeData()
    getIdentifyData()
  })

  const handleAddFeature = () => {
    state.showEdit = true
  }

  const handleCancle = () => {
    state.showEdit = false
  }

  const handleEdit = async (id) => {
    state.title = '编辑特征'
    state.showEdit = true
    const res = await getIdentify({id})
    if (res.status === '0000') {
      const data = res.item
      const feature_rules = JSON.parse(data.feature_rules)
      state.formData.featureName = data.featureName
      state.formData.recognizeType = data.recognizeType
      state.formData.dataType = data.dataType
      state.formData.feature_rules = feature_rules
    }
  }

  const addRule = (arr) => {
    const param = {
      identify_item: '',
      recognize_way: '',
      match_rule: '',
      key: Date.now()
    }
    arr.unshift(param)
    // state.formData.feature_rules[0].children.unshift(param)
  }

  const delDule = (arr, index) => {
    arr.splice(index, 1)
    // state.formData.feature_rules[0].children.splice(index, 1)
  }

  const addGroupRule = (itemGroup) => {
    const param = {
      identify_item: '',
      recognize_way: '',
      match_rule: '',
      key: Date.now()
    }
    itemGroup.children.unshift(param)
  }

  const delGroupRule = (arr, index) => {
    arr.splice(index, 1)
  }

  const addGroup = (arr) => {
    const param = {
      operate: 'AND',
      children: [
        {
          identify_item: '',
          recognize_way: '',
          match_rule: '',
          key: Date.now()
        }
      ]
    }
    arr.push(param)
    // state.formData.feature_rules[0].children.push(param)
  }

  const delGroup = (arr, index) => {
    // filter 后会丢失响应式
    const num = state.formData.feature_rules[0].children.filter(ele => !ele.operate).length
    arr.splice(index + num, 1)
  }

  const delExceptionGroup = (arr, index) => {
    // filter 后会丢失响应式
    const num = state.formData.feature_rules[1].children.filter(ele => !ele.operate).length
    arr.splice(index + num, 1)
  }

  return {
    ...toRefs(state),
    handleCurrentChange,
    handleSizeChange,
    filterType,
    handleAddFeature,
    handleCancle,
    handleDel,
    handleEdit,
    addRule,
    delDule,
    addGroup,
    delGroup,
    addGroupRule,
    delGroupRule,
    delExceptionGroup,
    handleSure
  }
}

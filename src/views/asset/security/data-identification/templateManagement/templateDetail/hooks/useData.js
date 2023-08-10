/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-23 17:45:32
 * @LastEditTime: 2023-03-24 10:55:04
 * @Description:
 */
import {
  reactive,
  onBeforeMount,
  toRefs,
  computed,
  watch,
  getCurrentInstance
} from 'vue'

import { getIdentifyList, saveIdentify, getIdentify, delIdentify, getDictList } from '@/api/asset/feature.js'

export function usehook () {
  const state = reactive({
    classifyData: [
      {
        id: '0',
        name: '全部分类',
        is_leaf: '0',
        children: [
          {
            id: '1',
            name: '个人敏感信息',
            is_leaf: '0',
            parent_id: '0',
            parent_ids: '0',
            children: [
              {
                id: '2',
                name: '手机号（中国内地）',
                is_leaf: '1',
                parent_id: '1',
                parent_ids: '0,1'
              },
              {
                id: '3',
                name: '邮箱',
                is_leaf: '1',
                parent_id: '1',
                parent_ids: '0,1'
              }
            ]
          },
          {
            id: '5',
            name: '个人敏感信息2',
            is_leaf: '0',
            parent_id: '0',
            parent_ids: '0'
          }
        ]
      }
    ],
    tableData: [
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S1',
        'status': '1',
        'is_default': '1'
      },
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S1',
        'status': '0',
        'is_default': '1'
      },
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S2',
        'status': '1',
        'is_default': '1'
      },
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S1',
        'status': '1',
        'is_default': '1'
      },
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S1',
        'status': '1',
        'is_default': '1'
      },
      {
        'model_id': '',
        'model_name': '注册日期',
        'grade_id': '',
        'grade_abbr': 'S1',
        'status': '1',
        'is_default': '1'
      }
    ],
    searchForm: {
      page_size: 10,
      page_no: 1
    },
    pageFilters: {
      pageSize: 10,
      pageNo: 1
    },
    total: 11,
    matchTypeList: [],
    identifyList: []
  })

  const handleAddFeature = () => {

  }

  const filterType = () => {

  }

  function handleSelectionChange (val) {

  }

  function handleCheckChange(val) {

  }

  function handleAddClassify () {

  }

  // 页码改变
  const handleCurrentChange = (val) => {
    state.pageFilters.pageNo = val
    state.searchForm.page_no = val
    getList()
  }

  // 页容量改变
  const handleSizeChange = (val) => {
    state.pageFilters.pageSize = val
    state.searchForm.page_size = val
    getList()
  }

  function getList () {

  }

  onBeforeMount(() => {
    getList()
  })

  return {
    ...toRefs(state),
    handleAddFeature,
    filterType,
    handleCheckChange,
    handleSelectionChange,
    handleAddClassify,
    handleCurrentChange,
    handleSizeChange
  }
}

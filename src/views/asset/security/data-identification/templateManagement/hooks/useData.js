/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-21 09:55:05
 * @LastEditTime: 2023-03-23 17:46:11
 * @Description:
 */
import {
  reactive,
  onBeforeMount,
  toRefs,
  computed,
  watch
} from 'vue'

export function usehook () {
  const state = reactive({
    title: '互联网行业分类分级模板',
    showDrawer: false,
    list: [
      {
        id: '1',
        template_name: '金融行业分类分级模板',
        active_flag: '0', // 1：激活 0：冻结  默认 0
        main_flag: '0', // 1：主模板 0：非主模板 默认 0
        is_default: '1', // 1: 内置 0：自定义
        remark: '参考JRT 0197-2020 金融数据安全 数据安全分级指南' // 模板描述
      },
      {
        id: '2',
        template_name: '电力行业分类分级模板',
        active_flag: '0',
        main_flag: '0',
        is_default: '1',
        remark: '参考电力行业最佳实践'
      },
      {
        id: '3',
        template_name: '电力行业分类分级模板',
        active_flag: '0',
        main_flag: '0',
        is_default: '1',
        remark: '参考电力行业最佳实践'
      },
      {
        id: '4',
        template_name: '电力行业分类分级模板',
        active_flag: '0',
        main_flag: '0',
        is_default: '1',
        remark: '参考电力行业最佳实践'
      }
    ],
    templateDetail: [
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
    ]
  })

  onBeforeMount(() => {
    //
  })

  // 显示详情
  const showDetail = (val) => {
    state.showDrawer = true
    state.title = '互联网行业分类分级模板'
  }

  const handleCancle = () => {
    state.showDrawer = false
  }

  const handleMaster = () => {

  }

  const handleCopy = () => {

  }

  const handleFreeze = () => {

  }
  return {
    ...toRefs(state),
    showDetail,
    handleCancle,
    handleMaster,
    handleCopy,
    handleFreeze
  }
}

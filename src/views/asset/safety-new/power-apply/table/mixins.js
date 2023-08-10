/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-08 09:44:24
 * @LastEditTime: 2023-06-08 10:16:44
 * @Description:
 */
import { getTableTypeList } from '@/api/asset/authority'
import {
  queryBussinessList
} from '@/api/plan/data-architecture'
import {
  getProjectList
} from '@/api/rd/integrate'

export default {
  data() {
    return {
      filterData: [],
      // 表类型
      tableTypeList: [],
      // 数据板块
      bussinessList: [],
      // 项目
      projectList: [],
      environmentList: [
        {
          id: 'prod',
          label: '生产环境'
        },
        {
          id: 'dev',
          label: '开发环境'
        }
      ],
      accountTypeList: [
        {
          id: 'PERSONAL',
          label: '个人账号'
        },
        {
          id: 'PRODUCE',
          label: '生产账号'
        }
      ]
    }
  },
  methods: {
    // 表类型
    async getTableType () {
      const res = await getTableTypeList()
      if (res) {
        this.tableTypeList = res.data.map(item => {
          return {
            id: item.code,
            label: item.name
          }
        })
      }
    },

    // 数据板块
    async getBussinessList () {
      const params = {
        pageSize: 100,
        pageNo: 1
      }
      const res = await queryBussinessList(params)
      if (res) {
        this.bussinessList = res.data.busi_data.map(item => {
          return {
            id: item.busin_code,
            label: item.busin_name
          }
        })
      }
    },

    // 项目
    async getProjectData () {
      const res = await getProjectList()
      if (res) {
        this.projectList = res.data.map(item => {
          return {
            id: item.project_id,
            label: item.project_name
          }
        })
      }
    }
  }
}

<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-03-06 19:47:07
 * @Description:
-->
<template>
  <section class="data-preview b-r animated fadeInRight">
    <el-table :data="tableData"
              :max-height="tableHeight"
              style="width: 100%">
      <el-table-column width="50"
                       type="index"
                       fixed></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       :prop="item"
                       :label="item"
                       v-for="item in columns"
                       :key="item"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getPreviewData
} from '@/api/asset/map'
export default {
  name: 'DataPreview',
  data () {
    return {
      tableData: [],
      columns: [],
      tableHeight: 0
    }
  },
  props: {
    widthHeightData: Object
  },
  watch: {
    widthHeightData: {
      handler(val) {
        this.$nextTick(_ => {
          this.tableHeight = parseInt(val.height) - 80
        })
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const params = {
        cube_id: this.cube_id,
        source_type: this.$route.query.source_type,
        project_code: this.$route.query.project_code
      }
      const res = await this.$simpleAsyncTo(getPreviewData(params))
      if (res) {
        this.columns = res.columns
        this.tableData = res.data
      }
    },
    flexWidth(prop, tableData, title, num = 0) {
      if (tableData.length === 0 ) {//表格没数据不做处理
        return;
      }
      let flexWidth = 0;//初始化表格列宽
      let columnContent = '';//占位最宽的内容
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.font = "14px Microsoft YaHei";
      if ((prop === '') && title) {//标题长内容少的，取标题的值,
        columnContent = title
      } else {// 获取该列中占位最宽的内容
        let index = 0;
        for (let i = 0; i < tableData.length; i++) {
          const now_temp = tableData[i][prop] + '';
          const max_temp = tableData[index][prop] + '';
          const now_temp_w = context.measureText(now_temp).width
          const max_temp_w = context.measureText(max_temp).width
          if (now_temp_w > max_temp_w) {
            index = i;
          }
        }
        columnContent = tableData[index][prop]
        //比较占位最宽的值跟标题、标题为空的留出四个位置
        const column_w = context.measureText(columnContent).width
        const title_w = context.measureText(title).width
        if (column_w < title_w) {
          columnContent = title || '留四个字'
        }
      }
      // 计算最宽内容的列宽
      let width = context.measureText(columnContent);
      flexWidth = width.width + 40 + num
      return flexWidth + 'px';
    }
  }
}
</script>

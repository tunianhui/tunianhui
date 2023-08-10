<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2022-08-27 15:18:07
 * @Description:
-->
<template>
  <section class="side-panel-view"
           :style="active.style || {}">

    <div class="spv-histories"
         v-show="!active.name && !visibleEmpty">
      <h4>版本</h4>
      <div class="count mt-20 mb-10">函数ID:530</div>
      <el-table :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column prop="field1"
                         label="提交人"
                         min-width="80">
        </el-table-column>
        <el-table-column prop="field2"
                         label="提交日期">
        </el-table-column>
        <el-table-column prop="field3"
                         label="状态"
                         min-width="60"></el-table-column>
        <el-table-column label="操作"
                         width="150">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="_releaseHandle(scope.row)">发布</el-button>
            <el-button type="text"
                       @click="_abandonHandle(scope.row)">废弃</el-button>
            <el-button type="text"
                       @click="_versionDetail(scope.row)">版本详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="contrast">对比</el-button>

      <el-pagination class="fr pt-10 pb-10"
                     background
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     :page-size="pageFilters.pageSize"
                     :page-sizes="pageSizes"
                     :current-page.sync="pageFilters.pageNo"
                     small
                     layout="prev, pager, next"
                     :total="total"></el-pagination>
    </div>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import mixin from '../mixin'
import { capitalize } from '@/libs/util'
import './common.scss'

export default {
  name: 'version',
  mixins: [pager, mixin],
  inject: ['attrStore', 'components'],
  components: {
  },
  data () {
    return {
      tableData: [
        {
          field1: 'sd',
          field2: '2022-02-22 22:22:22',
          field3: '可发布'
        }
      ]
    }
  },
  computed: {
    active () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories () {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty () {
      return this.attrStore && !this.histories.length
    },
    component () {
      return this.active.attrType === 'objectAttr'
        ? 'ObjectAttrSideAttr'
        : capitalize(this.active.attrType) + 'Attr'
    }
  },
  methods: {
    _releaseHandle (item) { },
    _abandonHandle (item) { },
    _versionDetail (item) { },
    // 对比
    contrast () { },

    setActiveAttr (attr) {
      this.attrStore.commit('setActive', attr)
    },
    setActiveToFirst (attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
</script>
<style scoped lang="scss">
.count {
  font-weight: 600;
}
</style>

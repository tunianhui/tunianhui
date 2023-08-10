<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :show-header="showHeader">
    <el-table-column show-overflow-tooltip prop="date" label="" width="80" type="index">
      <!-- <template>
        <el-tooltip class="item" effect="dark" content="主键" placement="top">
          <i class="icon iconfont icon-zhujian"></i>
        </el-tooltip>
      </template> -->
    </el-table-column>
    <el-table-column prop="name" label="" width="80" show-overflow-tooltip>
      <template>
        <el-tooltip class="item" effect="dark" content="主键" placement="top">
          <i class="icon iconfont icon-zhujian pl-10" v-if="isPrimary"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="element_code" label="英文字段名" show-overflow-tooltip></el-table-column>
    <el-table-column prop="element_name" label="字段名称" show-overflow-tooltip></el-table-column>
    <el-table-column prop="element_type" label="数据类型" show-overflow-tooltip></el-table-column>
    <!-- <el-table-column prop="heat" label="热度">
      <template slot-scope="scope">
        <div class="heat">
          <span :class="{'active': scope.row.heat > 0}"></span>
          <span :class="{'active': scope.row.heat > 20}"></span>
          <span :class="{'active': scope.row.heat > 40}"></span>
          <span :class="{'active': scope.row.heat > 60}"></span>
          <span :class="{'active': scope.row.heat > 80}"></span>
        </div>
      </template>
    </el-table-column> -->
    <el-table-column label="操作" v-if="tableType==16||tableType==17||tableType==18">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="分区详情" placement="top">
          <i class="icon iconfont icon-fenquxiangqing pl-10 size-16" @click="clickZoneHandle(scope.row)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="数据探查" placement="top">
          <i class="icon iconfont icon-shujutancha pl-10 size-16" @click="clickDataHandle(scope.row)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="血缘关系" placement="top">
          <i class="icon iconfont icon-xieyuanguanxi pl-10 size-16" @click="clickBloodRelHandle(scope.row)"></i>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {treeTypes, types} from '@/config/rd-config'
export default {
  name: 'Table',
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableType: {
      type: [Number, String],
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      DimensionTable: treeTypes[types.DIMENSIONTABLE],
      FactTable: treeTypes[types.FACTTABLE],
      PolymerTable: treeTypes[types.POLYMERTABLE],
      PhysicalTable: treeTypes[types.PHYSICALTABLE]
    }
  },
  created() {
  },
  methods: {
    clickZoneHandle(row) {
      this.$emit('zoneDetail', row)
    },
    clickDataHandle(row) {
      this.$emit('dataSearch', row)
    },
    clickBloodRelHandle(row) {
      this.$emit('bloodRel', row)
    }
  }
}
</script>

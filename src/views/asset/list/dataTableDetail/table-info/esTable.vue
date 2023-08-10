<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :show-header="showHeader"
    :max-height="maxHeight"
    row-key="element_id"
    :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
  >
    <el-table-column prop="element_code" label="英文字段名"></el-table-column>
    <el-table-column prop="element_type" label="数据类型"></el-table-column>
    <el-table-column prop="analyzer" label="分词器"></el-table-column>
    <el-table-column prop="rel_standards" label="关联标准"></el-table-column>
    <el-table-column prop="info_classify" label="信息分类"></el-table-column>
    <el-table-column prop="safe_level" label="安全等级"></el-table-column>
    <el-table-column prop="data_hot" label="热度">
      <template slot-scope="{row}">
        <div class="heat">
          <span :class="{'active': row.data_hot > 0}"></span>
          <span :class="{'active': row.data_hot > 0.2}"></span>
          <span :class="{'active': row.data_hot > 0.4}"></span>
          <span :class="{'active': row.data_hot > 0.6}"></span>
          <span :class="{'active': row.data_hot > 0.8}"></span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      v-if="tableType == 16 || tableType == 17 || tableType == 18"
    >
      <template slot-scope="{row}">
        <el-tooltip
          class="item"
          effect="dark"
          content="分区详情"
          placement="top"
        >
          <i
            class="icon iconfont icon-fenquxiangqing pl-10 size-16"
            @click="clickZoneHandle(row)"
          ></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="数据探查"
          placement="top"
        >
          <i
            class="icon iconfont icon-shujutancha pl-10 size-16"
            @click="clickDataHandle(row)"
          ></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="血缘关系"
          placement="top"
        >
          <i
            class="icon iconfont icon-xieyuanguanxi pl-10 size-16"
            @click="clickBloodRelHandle(row)"
          ></i>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {treeTypes, types} from '@/config/rd-config'
export default {
  name: 'EsTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      PhysicalTable: treeTypes[types.PHYSICALTABLE],
    }
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
    },
  }
}
</script>
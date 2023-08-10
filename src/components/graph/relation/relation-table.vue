<template>
  <div class="relation-table">
    <el-select v-model="keyword" placeholder="搜索表名" clearable filterable @change="searchTable">
      <i slot="prefix" class="el-icon-search" />
      <el-options
        v-for="item in selectList"
        :value="item.value"
        :label="item.label"
        :key="item.value"
      />
    </el-select>
    <div class="relation-table-body">
      <i class="el-icon-arrow-up" />
      <i class="el-icon-arrow-down" />
      <div class="relation-table-list">
        <div
          v-for="item in data"
          :key="item.modelId"
          :class="['node', item.modelType === 4 ? 'node-physical' : 'node-logic']"
        >
          <template v-if="item.modelType === 4">
            <div @click="handleClickTable">
              <span class="prefix-physical prefix-physical-big" />
              {{item.tableName}}
            </div>
          </template>
          <template v-if="item.modelType === 1">
            <dl>
              <dt>
                <OverflowTooltip>{{item.tableName}}</OverflowTooltip>
                <span>（{{item.columnNameList.length}}字段）</span>
              </dt>
              <dd
                v-for="column in item.columnNameList"
                :key="column"
                @click="handleClickCloumn(column, item)"
              >
                <i class="prefix-column prefix-column-big">{{column}}</i>
              </dd>
            </dl>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'

export default {
  name: 'RelationTable',
  props: {
    data: Array
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      keyword: '',
      selectList: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        // this.proce
      }
    }
  },
  methods: {
    getSelectList() {},
    searchTable(val) {},
    handleClickTable(e) {},
    handleClickCloumn(e) {}
  }
}
</script>

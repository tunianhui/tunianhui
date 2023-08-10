<template>
  <section class="polymer-table-info">
    <el-form :model="filter" label-width="92px" label-position="right" label-suffix="：">
      <SimpleHead name="主键信息"></SimpleHead>
      <el-form-item label="统计粒度"></el-form-item>
      <div class="part-table">
        <div class="part-table-head" @click="isCollapse = !isCollapse">
          <i :class="data.icon"></i>查看主键及分区字段
        </div>
        <el-collapse-transition>
          <el-table :data="tableData" v-show="isCollapse">
            <el-table-column label="类型" prop="type" width="60"></el-table-column>
            <el-table-column label="字段">
              <template #default="scope">
                <div class="cell-field">
                  <div class="pr-10">
                    <p>{{scope.row.element_code}}</p>
                    <p class="grey">{{scope.row.element_name}}</p>
                  </div>
                  <div>
                    <el-popover
                      width="300"
                      placement="right"
                      popper-class="dark-popper"
                      trigger="hover"
                    >
                      <el-link
                        :underline="false"
                        slot="reference"
                        icon="font-16 iconfont icon-wangluoxitong"
                      ></el-link>
                      <MonacoEditor style="height: 150px;" readonly :code="scope.row.sql_content" />
                    </el-popover>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="维度逻辑表" prop="table">
              <template #default="scope">
                <p>{{scope.row.dim_code}}</p>
                <p class="grey">{{scope.row.dim_name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="data_type"></el-table-column>
          </el-table>
        </el-collapse-transition>
      </div>
      <SimpleHead name="汇总逻辑表描述信息"></SimpleHead>
      <el-form-item label="名称">{{filter.name}}</el-form-item>
      <el-form-item label="英文名">{{filter.name}}</el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          type="textarea"
          v-model="filter.desc"
          placeholder="请输入汇总逻辑表描述"
          maxlength="128"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'PolymerTableInfo',
  props: {
    data: Object
  },
  data() {
    return {
      filter: {name: '', desc: ''},
      tableData: [
        {
          type: '主键',
          element_code: 'test',
          element_name: '测试',
          data_type: 'string',
          sql_content: 'sql table',
          dim_name: '用户维度',
          dim_code: 'dim_user'
        }
      ],
      isCollapse: false
    }
  }
}
</script>

<style lang="scss">
.polymer-table-info {
  .part-table {
    border: 1px solid $grey6;
    margin-bottom: 15px;

    .part-table-head {
      color: $grey2;
      text-align: center;
      border-bottom: 1px solid $grey6;
      padding: 2px 0;
      font-size: 12px;
      user-select: none;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }

    .el-table {
      transition: $transition;
      background-color: transparent;
      tr,
      td {
        background-color: transparent;
      }
      th {
        background-color: $grey7;
      }
      p {
        color: $grey2;
      }
      .grey {
        color: $grey4;
      }
      .cell-field {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

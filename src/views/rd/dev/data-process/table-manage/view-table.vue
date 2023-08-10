<template>
  <section class="limit-atom-edit">
    <div class="view-content emphasize-class" ref="container">
      <div v-if="isExcel">
        <el-table :data="table_info">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="表分层" prop="table_layer"></el-table-column>
          <el-table-column
            label="数据源类型"
            prop="datasource_type"
          ></el-table-column>
          <el-table-column label="库" prop="datasource_db"></el-table-column>
          <el-table-column label="表名称" prop="table_code"></el-table-column>
          <el-table-column label="表名描述" prop="table_name"></el-table-column>
          <el-table-column
            label="核心表"
            prop="is_core_table"
          ></el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-collapse v-model="formActiveNames">
          <el-collapse-item :name="'1'">
            <span class="collapse-title" slot="title">非分区字段</span>
            <div>
              <el-table :data="column_info" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column
                  label="字段名称"
                  prop="column_code"
                ></el-table-column>
                <el-table-column
                  label="类型"
                  prop="column_type"
                ></el-table-column>
                <el-table-column
                  label="描述"
                  prop="column_name"
                ></el-table-column>
                <el-table-column label="主键">
                  <template slot-scope="scope">
                    {{ scope.row.is_primary == 0 ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="标准化标签">
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.selected_type !== '0' ||
                        scope.row.selected_type !== '1'
                      "
                    >
                      -
                    </div>
                    <div v-else>
                      <el-tag>{{
                        scope.row.selected_type === '0' ? '维度' : '度量'
                      }}</el-tag
                      >&nbsp;{{
                        scope.row.label_dim_name != '' ||
                        scope.row.label_dim_name !== null
                          ? scope.row.label_dim_name
                          : scope.row.label_measure_name
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
          <el-collapse-item :name="'2'">
            <span class="collapse-title" slot="title">分区字段</span>
            <div v-if="isHive">
              <el-table :data="partition_info" class="mt-10">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column
                  label="分区字段名称"
                  prop="column_code"
                ></el-table-column>
                <el-table-column
                  label="类型"
                  prop="column_type"
                ></el-table-column>
                <el-table-column
                  label="描述"
                  prop="column_name"
                ></el-table-column>
                <el-table-column label="主键">
                  <template slot-scope="scope">
                    {{ scope.row.is_primary == 0 ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="标准化标签">
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.selected_type !== '0' ||
                        scope.row.selected_type !== '1'
                      "
                    >
                      -
                    </div>
                    <div v-else>
                      <el-tag>{{
                        scope.row.selected_type === '0' ? '维度' : '度量'
                      }}</el-tag
                      >&nbsp;{{
                        scope.row.label_dim_name != '' ||
                        scope.row.label_dim_name !== null
                          ? scope.row.label_dim_name
                          : scope.row.label_measure_name
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              <el-input
                v-model="table_properties"
                type="textarea"
                :autosize="true"
                :readonly="true"
              ></el-input>
            </div>
          </el-collapse-item>
          <el-collapse-item :name="'3'">
            <span class="collapse-title" slot="title">基础属性</span>
            <div>
              <el-form
                :data="table_param"
                label-width="120px"
                label-position="left"
                class="mt-10 pl-10 pt-10 pb-10"
                style="background-color: #fff"
              >
                <el-form-item label="核心表">{{
                  table_param.is_core_table == 0 ? '是' : '否'
                }}</el-form-item>
                <el-form-item label="表类型" v-if="isHive">{{
                  table_param.table_type == 'internal' ? '内部表' : '外部表'
                }}</el-form-item>
                <el-form-item label="表生命周期">{{
                  table_param.table_lifecycle_type == '0'
                    ? '永久'
                    : table_param.table_lifecycle
                }}</el-form-item>
                <el-form-item label="分区生命周期">{{
                  table_param.part_lifecycle_type == '0'
                    ? '永久'
                    : table_param.part_lifecycle
                }}</el-form-item>
                <el-form-item label="存储格式" v-if="isHive">{{
                  table_param.storage_type | filterStorage
                }}</el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </section>
</template>

<script>
import {queryById} from '@/api/rd/table-manage.js'

export default {
  name: 'ViewTable',
  props: {
    data: Object,
  },
  data() {
    return {
      column_info: [],
      partition_info: [],
      table_properties: [],
      table_param: {},
      table_info: [],
      isHive: true,
      isExcel: false,
      formActiveNames: '1',
    }
  },
  filters: {
    filterStorage(val) {
      if (val == 0) {
        return 'Parquet'
      } else if (val == 1) {
        return 'Textfile'
      } else if (val == 2) {
        return 'SequenceFile'
      } else if (val == 3) {
        return 'ORC'
      } else if (val == 4) {
        return 'AVRO'
      }
    },
  },
  created() {
    this.queryById()
  },
  methods: {
    async queryById() {
      if (this.data.oper_type == 'execl导入') {
        this.isExcel = true
      } else {
        this.isExcel = false
      }
      let params = {
        id: this.data.id,
      }
      const res = await queryById(params)
      if (res.flag) {
        const {
          table_basic,
          table_param,
          column_info,
          new_column_info,
          partition_info,
          table_properties,
          table_info,
        } = res.data
        let datasource_type = table_basic ? table_basic.datasource_type : ''
        this.isHive = datasource_type == 'hive' ? true : false
        let temp_new_column_info = new_column_info ? new_column_info : []
        this.column_info = column_info
          ? [...column_info, ...temp_new_column_info]
          : []
        this.partition_info = partition_info || []
        this.table_properties = table_properties || []
        this.table_param = table_param || {}
        this.table_info = table_info || []
      }
    },
  },
}
</script>

<style lang="less" scoped>
.limit-atom-edit {
  .view-content.emphasize-class {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .view-content {
    margin: 10px 0px 0px 40px;
    width: 95%;
  }
}
</style>
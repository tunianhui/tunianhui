<template>
  <section class="table-info">
    <el-card class="table-record">
      <el-table :data="tableData" style="width: 100%" ref="table">

        <template v-if="type === 'common'">
          <el-table-column prop="cube_name" label="数据对象">
            <template slot-scope="scope">
              <div class="flex">
                <span class="icon iconfont icon-shougongbiaoqian"></span>
                <div class="ml-10">
                  <div class="color">
                    {{scope.row.cube_name}}
                  </div>
                  <div class="font">
                    {{scope.row.cube_code}}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="auth_type" label="权限类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.auth_type">
                <span class="tag mr-5" v-for="(item,index) in scope.row.auth_type" :key="index">
                  {{item}}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="busin_name" label="业务板块" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="account_name" label="权限账号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="环境" prop="environment" min-width="100" />
        </template>

        <template v-if="type === 'dataSource'">
          <el-table-column prop="datasourceName" label="数据对象">
            <template slot-scope="scope">
              <div class="flex">
                <span class="icon iconfont icon-shougongbiaoqian"></span>
                <div class="ml-10">
                  <div class="color">
                    {{scope.row.datasourceName}}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="account_type_name" label="权限账号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="auth_type" label="权限类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.auth_type">
                <span class="tag mr-5" v-for="(item,index) in scope.row.auth_type" :key="index">
                  {{item}}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="valid_time" label="有效期" show-overflow-tooltip>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button v-if="type === 'common'" type="text" style="font-size:16px" @click="showDetail(scope.row)"><i class="el-icon-tickets"></i></el-button>
            <el-button v-if="type === 'dataSource'" type="text" style="font-size:16px" @click="showDetail(scope.row)"><i class="el-icon-document-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'TableInfo',
  props: {
    tableData: {
      type: Array
    },
    type: {
      type: String,
      default: 'common'
    }
  },
  data () {
    return {}
  },
  methods: {
    showDetail (item) {
      this.$emit('showDetail', item)
    }
  }
}
</script>

<style lang="scss">
.table-info {
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .color {
    color: $grey1;
    line-height: 14px;
  }
  .font {
    color: $grey5;
    line-height: 14px;
  }
  .tag {
    display: inline-block;
    width: 50px;
    text-align: center;
    line-height: 25px;
    background: $screenItemTag;
  }
}
</style>

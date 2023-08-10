<template>
  <section class="table-info">
    <el-card class="table-record">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="business_name" label="业务板块">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.business_name}}
              </OverflowTooltip>
            </div>
            <OverflowTooltip style="width:150px">{{scope.row.business_id}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.role}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="gaveSource" label="授权来源" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.gaveSource}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="权限归属" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <el-button type="text"><i class=""></i></el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'porjectTableQuanXian',
  components: {
    OverflowTooltip
  },
  props: {
    tableData: {
      type: Array
    }
  },
  data () {
    return {
      // tableData: []
    }
  }
}
</script>

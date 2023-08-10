<template>
  <div class="rules-version">
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="version"
                       label="版本号">
      </el-table-column>
      <el-table-column prop="user_name"
                       label="提交人">
      </el-table-column>
      <el-table-column prop="time"
                       label="提交时间">
      </el-table-column>
      <el-table-column prop="desc"
                       label="备注">
      </el-table-column>
      <el-table-column label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'RulesVersion',
  data () {
    return {
      tableData: [
        {
          version: '',
          user_name: '',
          time: '2020-09-15 14:55:15',
          desc: ''
        }
      ]
    }
  }
}
</script>

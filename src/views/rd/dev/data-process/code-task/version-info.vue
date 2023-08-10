<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:44
 * @LastEditTime: 2023-02-02 18:00:13
 * @Description:
-->
<template>
  <section class="version-info">
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="version"
                       label="版本号">
      </el-table-column>
      <el-table-column prop="submitter"
                       label="提交人">
      </el-table-column>
      <el-table-column prop="submitDate"
                       label="提交时间">
      </el-table-column>
      <el-table-column prop="remarks"
                       label="备注">
      </el-table-column>
      <el-table-column prop="status"
                       label="生产状态">
      </el-table-column>
      <el-table-column label="操作"
                       width="100">
        <template>
          <el-button type="text"
                     size="small">查看</el-button>
          <el-button type="text"
                     size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'VersionInfo',
  data () {
    return {
      tableData: []
    }
  }
}
</script>

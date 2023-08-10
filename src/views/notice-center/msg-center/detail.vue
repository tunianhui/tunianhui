<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-05 16:39:48
 * @LastEditTime: 2023-06-05 16:56:01
 * @Description:
-->
<template>
  <div class="msg-detail">
    <div class="title">消息详情</div>
    <el-divider></el-divider>
    <div class="content">
      <div class="overview">
        <div class="item">
          <span class="label">消息来源</span>
          <span class="value">消息来源</span>
        </div>
        <div class="item">
          <span class="label">消息类型</span>
          <span class="value">系统消息</span>
        </div>
        <div class="item">
          <span class="label">发送时间</span>
          <span class="value">2023-05-24 17:33:12</span>
        </div>
      </div>
      <div class="mt-20">
        <div class="mb-10">以下权限被授权</div>
        <el-table ref="tableData" :data="tableData" style="width: 100%;">
          <el-table-column prop="field1" label="资源名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="field2" label="资源类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="field3" label="环境" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="field4" label="权限类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="field5" label="过期时间" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  components: {},
  props: {},
  mixins: [],
  data () {
    return {
      tableData: [
        {
          field1: 'des3test',
          field2: '密钥',
          field3: '生产环境',
          field4: 'SECRET_KEY_VIEW',
          field5: '20230623'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style scoped lang="scss">
.msg-detail {
  padding: 15px;
  .overview {
    display: flex;
    .item {
      flex: 1;
      .label {
        margin-right: 5px;
      }
    }
  }
}
</style>

<template>
  <div class="version-info">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="版本号"
        width="200px">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.version"
              placeholder="请输入版本号"
              style="width: 110px"
            >
            </el-input>
            <a href="javascript:;" @click="_getGenerateVersion">自动生成</a>
          </template>
      </el-table-column>
      <el-table-column
        prop="oper_user"
        label="提交人">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.oper_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper_time"
        label="提交时间">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.oper_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="备注">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.desc}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="生产状态">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{ getDicsValue('status_tag',  scope.row.status) || '测试'}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作">
        <template slot-scope="scope">
          <el-button
          type="text"
          class="ml-20"
          title="跳转"
          @click="jump(scope.row)"
          ><i class="icon iconfont icon-tiaozhuan" style="font-size:14px"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {
  getGenerateVersion
} from '@/api/asset/standard/criterion.js'
export default {
  name: 'VersionInfo',
  inject: ['tabStore', 'attrStore'],
  props: {
    data: Object
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.tableData = [this.data]
  },
  methods: {
    getData() {
      return this.tableData[0].version
    },
    async _getGenerateVersion() {
      const res = await this.$simpleAsyncTo(getGenerateVersion({version: this.tableData[0].version, std_code: this.tableData[0].std_code}))
      if (res) {
        this.tableData[0].version = res.data
      }
    },
    jump(row) {
      const data = {
        name: 'curr',
        meta: {
          name: '当前版本',
          icon: 'iconfont icon-banben'
        },
        component: 'ManageCurrent'
      }
      const opt = {
        label: data.meta.name,
        icon: data.meta.icon,
        data: data,
        tabType: data.name,
        name: data.name,
        visibleFileQuote: true,
        component: data.component
      }
      this.tabStore.commit('add', opt)
    }
  }
}
</script>

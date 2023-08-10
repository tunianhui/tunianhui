<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-05-31 09:27:24
 * @Description:
-->
<template>
  <section class="variable-wrapper container">
    <div class="head mb-10">
      <div class="flex">
        <div class="page-title mr-20">变量权限</div>
      </div>
      <div>
        <div class="flex top-right">
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>

    <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
      <el-table-column prop="field1" label="变量名称">
        <template slot-scope="{row}">
          <div class="keyName">
            <span class="icon iconfont icon-yuechi iconBg"></span>
            <span class="ml-10">{{ row.field1 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="field2" label="变量类型"> </el-table-column>
      <el-table-column prop="field4" label="生成方式"></el-table-column>
      <el-table-column prop="field5" label="负责人"></el-table-column>
      <el-table-column prop="field6" label="创建时间"></el-table-column>
      <el-table-column prop="field7" label="变量描述"> </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="text"><i class="el-icon-set-up font-14 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更多" placement="top">
            <el-button type="text"><i class="iconfont icon-gengduo font-16 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchRecover="batchRecover" @batchDel="handleEdit"></SelectFooter>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
export default {
  name: 'VariablePower',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      loading: 0,
      tableData: [
        {
          field1: 'km_aes_test_02',
          field2: '哈希脱敏',
          field3: '-',
          field4: '系统生成',
          field5: 'SuperAdmin(SuperAdmin@d)',
          field6: '2022-04-20 11:15:28',
          field7: 'adsadad'
        },
        {
          field1: 'km_aes_test_02',
          field2: '哈希脱敏',
          field3: '-',
          field4: '系统生成',
          field5: 'SuperAdmin(SuperAdmin@d)',
          field6: '2022-04-20 11:15:28',
          field7: 'adsadad'
        },
        {
          field1: 'km_aes_test_02',
          field2: '哈希脱敏',
          field3: '-',
          field4: '系统生成',
          field5: 'SuperAdmin(SuperAdmin@d)',
          field6: '2022-04-20 11:15:28',
          field7: 'adsadad'
        }
      ],
      multipleSelection: [],
      showCondition: false,
      inputVal: ''
    }
  },
  mounted () { },
  methods: {
    handleClick (val) { },
    searchChange (val) { },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 清除
    handleEdit (item) { },
    // 恢复
    batchRecover (item) { }
  }
}
</script>

<style lang="scss" scoped>
.variable-wrapper {
  position: relative;
  height: 100%;
  .head {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
    .top-right {
      align-items: center;
      .el-input {
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
        }
        .el-input__icon {
          line-height: 32px !important;
        }
      }
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .keyName {
    display: flex;
    align-items: center;
    .iconBg {
      background: #2358fe;
      color: #fff;
    }
  }
}
</style>

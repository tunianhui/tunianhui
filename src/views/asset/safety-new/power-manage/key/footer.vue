<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:50:41
 * @LastEditTime: 2023-07-20 11:49:57
 * @Description:
-->

<template>
  <section class="select-footer">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        <span class="font-12">选中 {{multipleSelection.length}} 个</span>
      </el-checkbox>
      <el-button type="text" :disabled="multipleSelection.length === 0" @click="batchDel" class="ml-10">
        <i class="iconfont icon-shouquan1 font-12 color-btn mr-5"><span class="ml-5">授权</span></i>
      </el-button>
      <el-button type="text" :disabled="multipleSelection.length === 0" @click="batchRecover">
        <i class="iconfont icon-huishou font-12 color-btn mr-5"><span class="ml-5">回收</span></i>
      </el-button>
    </div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 25, 50, 75, 100]" :page-size="pageFilters.pageSize" :current-page="pageFilters.pageNo" layout="total, prev, pager, next,sizes, jumper" :total="total">
    </el-pagination>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'SelectFooter',
  components: {
    //  Footer
  },
  mixins: [pager],
  props: {
    multipleSelection: Array,
    tableData: Array,
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler (val) {
        if (val.length === this.tableData.length) {
          this.checkAll = true
        }
        if (val.length === 0) {
          this.checkAll = false
        }
      }
    }
  },
  data () {
    return {
      checkAll: false
    }
  },

  mounted () {
    let pageText = document.getElementsByClassName('el-pagination__jump')[0]
    if (pageText) {
      pageText.childNodes[0].nodeValue = '跳到'
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.$emit('checkAllChange', val)
    },
    batchRecover () {
      this.$emit('batchRecover')
    },
    batchDel () {
      this.$emit('batchDel')
    },
    getTableList () {
      this.$emit('setTableList', this.pageFilters)
    }
    // currentPage4() {
    // }
  }
}
</script>

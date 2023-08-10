<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:48:05
 * @LastEditTime: 2023-08-08 17:29:30
 * @Description:
-->

<template>
  <section class="select-footer">
    <div class="flex" v-if="isShow">
      <el-button :disabled="inputValue === 1" type="text" @click="leftButton"><i class="el-icon el-icon-arrow-left"></i> </el-button>
      <el-input v-model="inputValue" style="width: 46px;" @change="clickJumper"></el-input> <span>/</span>{{ totalNum }}
      <el-button :disabled="inputValue >= totalNum" type="text" @click="rightButton"><i class="icon el-icon el-icon-arrow-right"></i></el-button>
    </div>
    <div class="flex font-12">
      <el-pagination v-if="isShow" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageFilters.pageSize" :page-size="pageFilters.pageSize" :current-page="pageFilters.pageNo" layout="total, prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
    <div v-if="!isShow" class="mr-0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageFilters.pageSize" :page-size="pageFilters.pageSize" :current-page="pageFilters.pageNo" layout="total, prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'taskFooter',
  mixins: [pager],
  props: {
    isShow: Boolean,
    totalNum: {
      type: Number,
      default: 0
    }
    //   multipleSelection: Array,
    //   tableData: Array,
    //   isIndeterminate: {
    //     type: Boolean,
    //     default: false
    //   }
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
    },
    isShow: {
      immediate: true,
      handler (val) {
        this.pageFilters.pageSize = 15
        this.pageFilters.pageNo = 1
      }
    }
  },
  data () {
    return {
      checkAll: false,
      activeIndex: 1,
      inputValue: 1
    }
  },
  mounted () {
    // this.totalNum = Math.ceil(this.total / 15)
  },
  methods: {
    leftButton () {
      this.inputValue = this.inputValue - 1
      this.clickJumper()
    },
    rightButton () {
      this.inputValue = this.inputValue + 1
      this.clickJumper()
    },
    clickJumper () {
      if (this.inputValue === '' || this.inputValue > this.totalNum) {
        this.inputValue = 1
      }
      this.$emit('clickJumper', this.inputValue)
    },
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
      this.$emit('sendTableList', this.pageFilters)
    }
  }
}
</script>

  <style lang="scss" scoped>
.el-input {
  margin: 0px 10px;
}
span {
  margin-right: 10px;
}
.icon {
  margin-left: 10px;
}
</style>

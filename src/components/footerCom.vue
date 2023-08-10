<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:50:41
 * @LastEditTime: 2023-05-24 16:28:29
 * @Description:
-->

<template>
    <section class="select-footer">
      <div>
        <slot name="left"></slot>
      </div>
      <el-pagination
      background 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,25, 50, 75, 100]"
        :page-size="pageFilters.pageSize"
        :current-page="pageFilters.pageNo"
        layout="total, prev, pager, next,sizes, jumper"
        :total="total">
      </el-pagination>
    </section>
  </template>
  
  <script>
  import pager from '@/mixins/pager'
  export default {
    name: 'footerCom',
    mixins: [pager],
    props: {
      total: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        checkAll: false,
        count:0
      }
    },
  
    mounted() {
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
      getTableList() {
        this.$emit('setTableList',this.pageFilters)
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>

.select-footer {
  position: absolute;
  // top: 50px;
  bottom: -40px;
  right: 0;
  left: 0;
  // margin-left: 160px;
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding: 0 20px;
  background-color: $grey10;
  z-index: 9;
  box-shadow: 0 -5px 10px 0 rgba(0,0,0,.15);
}
  </style>
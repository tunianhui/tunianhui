<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-18 09:08:36
 * @LastEditTime: 2021-08-10 14:20:28
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="myClose"
    @confirm="myConfirm"
    width="400px"
    top="25vh"
  >
    <div class="my-confirm-info-wrapper confirm-info">
      <i class="el-icon-warning-outline"></i>
      <div>
        <div>{{textTitle}}</div>
        <div class="">{{textDes}}</div>
      </div>
    </div>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'DelDialog',
  props: {
    visible: Boolean,
    title: String,
    data: [Object, Array, null],
    fn: [Function, null],
    textTitle: String,
    textDes: String
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    }
  },
  data() {
    return {
      isVisible: false,
      dialogFlag: false,
      isRule: false,
      dialogText: ''
    }
  },
  methods: {
    myClose() {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },
    async myConfirm() {
      let params = {}
      if (this.data instanceof Array) {
        const ids = this.data.map(item => item.id)
        params.id = JSON.stringify(ids)
      } else {
        params.id = this.data.id
      }
      const res = await this.$simpleAsyncTo(this.fn(params), '提交失败')
      if (res) {
        this.$emit('close', true)
        this.$message({
          type: 'success',
          message: res.msg
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-info {
  padding-bottom: 20px;
  >div {
    >div:last-child {
      color: $grey4;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>

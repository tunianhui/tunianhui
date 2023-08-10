<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 15:27:17
 * @LastEditTime: 2022-11-02 18:24:36
-->
<template>
  <SimpleEditDialog :title="title" :visible="isVisible" @close="myClose" @confirm="myConfirm" width="400px" top="25vh">
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
    textTitle: String,
    textDes: String
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        this.isVisible = val
      }
    }
  },
  data () {
    return {
      isVisible: false,
      dialogFlag: false,
      isRule: false,
      dialogText: ''
    }
  },
  methods: {
    myClose () {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },
    myConfirm () {
      this.$emit('myConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-info {
  padding-bottom: 20px;
  > div {
    > div:last-child {
      color: $grey4;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}

</style>

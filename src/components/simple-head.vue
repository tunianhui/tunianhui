<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:42
 * @LastEditTime: 2023-03-17 16:28:11
 * @Description:
-->
<template>
  <section class="simple-head">
    <i></i>
    {{name}}
  </section>
</template>

<script>
export default {
  name: 'SimpleHead',
  props: {
    name: String
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.simple-head {
  height: 24px;
  line-height: 24px;
  margin-bottom: 10px;
  color: $grey2;
  font-size: 14px;
  i {
    display: inline-block;
    width: 4px;
    height: 14px;
    background: $--color-primary;
    position: relative;
    top: 3px;
    margin-right: 5px;
  }
}
</style>

<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 10:43:55
 * @LastEditTime: 2022-08-26 17:28:32
 * @Description:
-->
<template>
  <section class="no-data">
    <img src="@/assets/images/nodata.png"
         alt="" />
    <p>你暂时没有新打开的页面</p>
  </section>
</template>

<script>
export default {
  name: 'nodata',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.no-data {
  margin-top: 300px;
  text-align: center;
  p {
    line-height: 50px;
    color: $grey4;
  }
}
</style>

<template>
  <section class="blank">
    <img src="@/assets/images/quanxian.png" alt="" />
    <p>请点击左侧菜单栏，查看权限管理信息</p>
  </section>
</template>

<script>
export default {
  name: 'Blank'
}
</script>

<style lang="scss">
.blank {
  margin-top: 200px;
  text-align: center;
  line-height: 1;

  p {
    /* margin-top: 20px; */
    line-height: 50px;
    color: $grey4;
  }
  img {
    /* line-height: none; */
  }
}
</style>

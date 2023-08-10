<template>
  <section class="ops-nodata">
    <img src="@/assets/images/ops-nodata.png" alt="" />
    <p>未找到任何内容</p>
  </section>
</template>

<script>
export default {
  name: 'OpsNodata',
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.ops-nodata {
  margin-top: 180px;
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

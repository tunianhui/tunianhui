<template>
  <section class="no-data">
    <img src="@/assets/images/nodata.png" alt="" />
    <p>暂时还没有任何{{title}}哦！</p>
  </section>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
.no-data {
  margin-top: 150px;
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

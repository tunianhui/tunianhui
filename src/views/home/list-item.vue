<template>
  <router-link :to="data.link" class="list-item">
    <div class="list-avatar">
      <img :src="data.img" width="64px" height="64px" alt />
    </div>
    <div class="list-content">
      <h4>
        <strong>{{ data.title }}</strong>
      </h4>
      <p>{{ data.brief }}</p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    data: Object
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.list-item {
  display: flex;
  margin-bottom: 8px;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  background-color: $grey10;

  &:hover {
    /* box-shadow: 0 0 4px 2px rgba($grey3, 0.1); */
    box-shadow: 0 5px 11px rgba($grey2, 0.09);
  }

  .list-avatar {
    margin-right: 10px;
  }
  .list-content {
  }
  h4 {
    font-size: 14px;
    line-height: 28px;
    color: $grey2;
    a {
      display: inline-block;
      padding: 0 10px;
      color: $grey4;
      font-size: 14px;
      &:hover {
        color: $grey2;
      }
    }
  }
  p {
    @include lineClamp(2);
    font-size: 12px;
    color: $grey3;
  }
}
</style>

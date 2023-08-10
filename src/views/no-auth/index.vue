<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-03 10:30:09
 * @Description:
-->
<template>
  <section class="no-auth flex-center">
    <div>
      <img src="@/assets/images/lock.png" alt="" />
      <p>
        对不起，您还没有当前操作的权限，请点击申请
        <el-button type="text" @click="applyAuth">资产安全</el-button>
        权限
      </p>
      <el-button type="primary" @click="applyAuth">申请权限</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NoAuth',
  inheritAttrs: false,
  data() {
    return {}
  },
  methods: {
    applyAuth() {
      this.$router.push(
        '/asset/safety/powermanage/myManage/functionPowerManage'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.no-auth {
  display: flex;
  height: 100%;
  justify-content: center;
  div {
    text-align: center;
    margin-top: -24vh;

    img {
      height: 25vh;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 10px;
      color: $grey2;
      font-size: 12px;
    }
  }
}
</style>

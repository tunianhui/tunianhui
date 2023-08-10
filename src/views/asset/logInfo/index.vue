<!--
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-06-30 13:44:49
 * @LastEditTime: 2022-11-04 11:33:40
 * @Description:
-->
<template>
  <div class='log-info' v-loading="!!loading">
    <div class="log-title">运行日志</div>
    <div class="log-wrapper">
      <el-card>
        <div class="info-left">
          <div class="title">
            <div class="font-12">{{info.start_time}}至{{info.end_time}}</div>
            <div class="font-12">({{info.exec_time}}秒)</div>
          </div>
        </div>
        <div class="info-right font-12" v-html="info.run_log">
          <!-- {{info.run_log}} -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getVerifyInstancelog
} from '@/api/asset/quality/record'
export default {
  name: 'LogInfo',
  props: {},
  components: {},
  data () {
    return {
      loading: 0,
      info: {}
    }
  },
  computed: {},
  created () {
    this.getVerifyInstancelog(this.$route.query.id)
  },
  mounted () { },
  methods: {
    async getVerifyInstancelog (val) {
      this.loading++
      const params = { id: val }
      const res = await this.$simpleAsyncTo(getVerifyInstancelog(params), '获取失败')
      if (res) {
        this.info = res.data
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.log-info {
  height: 100%;
  .log-title {
    padding: 15px 20px;
    font-size: 20px;
    border-bottom: 1px solid $grey6;
  }
  .log-wrapper {
    padding: 20px;
    height: calc(100% - 60px);
    .el-card {
      height: 100%;
      .el-card__body {
        display: flex;
        padding: 0px;
        height: 100%;
      }
      .info-left {
        height: 100%;
        // border-right: 1px solid $grey6;
        .title {
          width: 200px;
          background-color: rgb(237, 238, 243);
          padding: 8px 15px;
          line-height: 20px;
        }
      }
      .info-right {
        width: calc(100% - 200px);
        padding: 10px;
        background-color: rgb(31, 39, 64);
        color: #fff;
        max-height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>

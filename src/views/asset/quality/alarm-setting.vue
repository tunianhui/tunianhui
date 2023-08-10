<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-18 09:08:36
 * @LastEditTime: 2021-06-22 10:02:03
 * @Description:
-->
<template>
  <div class="alarm-setting mb-15">
    <div class="alarm-setting-header">告警设置</div>
    <div class="basic-info">
      <div class="info-item mr-40">
        <span class="basic-label">告警接收人：</span>
        <OverflowTooltip class="basic-value">LD_Demo</OverflowTooltip>
      </div>
      <div class="info-item mr-40">
        <span class="basic-label">告警方式：</span>
        <OverflowTooltip class="basic-value">短信、邮件、钉钉机器人、电话</OverflowTooltip>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'AlarmSetting',
  components: {
    OverflowTooltip
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
.alarm-setting {
  padding: 16px 20px;
  background-color: #f8f8f8;
  .alarm-setting-header {
    margin-bottom: 5px;
  }
  .basic-info {
    display: flex;
    .info-item {
      font-size: 12px;
      .basic-label {
        color: rgba($color: #000000, $alpha: 0.5);
      }
      .basic-value {
        color: rgba($color: #000000, $alpha: 0.8);
        width: 160px;
      }
    }
  }
}
</style>

<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-30 10:17:26
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-04 10:16:32
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\real-time-monitoring-config\task-config.vue
-->
<template>
  <el-dialog
    :title="title"
    custom-class="real-time-task-config"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="62%"
  >
    <div>
      <div class="top-label">
        <span class="index">1</span>
        <span>选择监控任务</span>
      </div>
      <div class="monitoring-task">
        <div class="label">
          <span>*</span>
          <span>监控任务</span>
        </div>
        <div>
          <!-- <MonitorTaskSelect v-model="monitorTask"></MonitorTaskSelect> -->
          <el-select v-model="monitorTaskValue" placeholder="请选择监控任务">
            <el-option
              v-for="item in taskOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="top-label border">
        <span class="index">2</span>
        <span>配置报警原因</span>
      </div>
      <div class="config-wrapper">
        <div class="config-left">
          <div class="title-top">
            <span>报警原因</span>
            <i class="el-icon-plus" @click="addRasonForAlarm" :style="{cursor: leftOptions.length >= 4 ? 'not-allowed' : ''}"></i>
          </div>
          <div class="item-wrapper">
            <template v-if="leftOptions.length">
              <div :class="['item', activeIndex === index ? 'active' : '']" v-for="(item,index) in leftOptions" :key="item.value" @click="selectHandle(item, index)">
                <div>
                  <el-select v-model="item.value" placeholder="请选择" @click.native="e => selectHandle(item, index)">
                    <el-option
                      v-for="itemSub in rasonForAlarmOptions"
                      :key="itemSub.value"
                      :label="itemSub.label"
                      :value="itemSub.value"
                      :disabled="getDisabled(itemSub.value)"
                    >
                    </el-option>
                  </el-select>
                </div>
                <el-divider direction="vertical"></el-divider>
                <i class="el-icon-delete" @click="delRasonForAlarm(index)"></i>
              </div>
            </template>
            <div v-else style="display: flex;font-size: 12px;justify-content: center;line-height: 250px; color: rgba(0,0,0,0.5);">请先新增报警原因</div>
          </div>
        </div>
        <div class="config-right pt-10 pr-20">
          <template v-if="!!curData">
            <RealTimeTaskConfigComplete v-model="curData" @change="changeCurData"></RealTimeTaskConfigComplete>
          </template>
          <div v-else style="display: flex;font-size: 12px;justify-content: center;line-height: 250px; color: rgba(0,0,0,0.5);">请先新增报警原因</div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RealTimeTaskConfigComplete from './complete.vue'
export default {
  name: 'RealTimeTaskConfig',
  props: {
    title: String,
  },
  components: {
    RealTimeTaskConfigComplete
  },
  data() {
    return {
      dialogVisible: true,
      activeIndex: 0,
      taskOptions: [
        { label: '任务1', value: '1' }
      ],
      curData: null,
      leftOptions: [],
      rasonForAlarmOptions: [
        { label: '业务延时过高', value: '1'},
        { label: 'TPS超过范围', value: '2'},
        { label: '失败频率超过配置', value: '3'},
        { label: '数据滞留超过配置', value: '4'},
        { label: 'checkpoint失败配置', value: '5'},
      ],
      monitorTaskValue: '',
    }
  },
  methods: {
    getDisabled(value) {
      return this.leftOptions.some(item => item.value === value)
    },
    selectHandle(item, index) {
      this.activeIndex = index
      this.curData = {...item.data}
    },
    addRasonForAlarm() {
      if (this.leftOptions.length >= 4) return
      const data = {
        value: this.getRasonForAlarm(),
        data: {
          ...this.getDefaultData(this.getRasonForAlarm())
        }
      }
      this.leftOptions.push({...data})
      this.activeIndex = this.leftOptions.length - 1
      this.curData = {...data.data}
    },
    getRasonForAlarm() {
      const value = this.leftOptions.map(d => d.value)
      return !value.includes('1') ? '1' : !value.includes('2') ? '2' : !value.includes('3') ? '3' : !value.includes('4') ? '4' : !value.includes('5') ? '5' : ''
    },
    delRasonForAlarm(index) {
      this.leftOptions.splice(index, 1)
      this.activeIndex = 0
      if (this.leftOptions.length) {
        this.curData = {...this.leftOptions[0].data}
      } else {
        this.curData = null
      }
    },
    getDefaultData(key) {
      const result = {}
      switch(key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          result.reasonForAlarm = '1'
          result.seconds = 1
          result.alarmFrequency = 1
          result.monitoringInterval = '1'
          result.monitoringInterval = []
          result.tableData = []
          break
      }
      return result
    },
    changeCurData(data) {
      console.log(data)
      this.leftOptions[this.activeIndex].data = {...data}
    },
    close() {
      this.$emit('close')
    },
    save() {
      console.log(this.leftOptions)
      this.close()
    },
  }
}
</script>

<style lang="scss">
.real-time-task-config {
  .top-label {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
    .index {
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #1439AC;
      color: #fff;
      margin-right: 10px;
      font-size: 12px;
    }
    &.border {
      border-bottom: 1px solid #E6E6E6;
    }
  }
  .monitoring-task {
    display: flex;
    align-items: center;
    .label {
      display: flex;
      width: 80px;
      justify-content: flex-end;
      margin-right: 10px;
      >span:first-child {
        color: #ff4949;
        margin-right: 3px;
      }
    }
    >div:last-child {
      flex: 1;
      width: 0;
    }
  }
  .config-wrapper {
    display: flex;
    height: 300px;
    .config-left {
      width: 190px;
      .title-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 28px;
        >span {
          color: rgba($color: #000000, $alpha: 0.7);
          font-size: 12px;
        }
        >i {
          color: #1439AC;
          font-size: 14px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
      .item-wrapper {
        .item {
          padding: 0 10px 0 0;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          background: #f5F5F7;
          .el-input__inner {
            border: none!important;
            border-radius: 0;
            background: #f5F5F7;
          }
          i {
            cursor: pointer;
          }
          &.active {
            background: #fff;
            .el-input__inner {
            background: #fff;
          }
          }
        }
      }
    }
    .config-right {
      width: 0;
      flex: 1;
      background: #fff;
      overflow: overlay;
    }
  }
}

</style>
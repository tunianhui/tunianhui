<template>
  <div class="buss-day">
    <p>业务日期</p>
    <div class="radio-list">
      <ul>
        <li :class="{'is-active': activeDay === item.value}"
            v-for="item in dayList"
            :key="item.label"
            @click="selectDate(item)">
          {{ item.label }}
        </li>
      </ul>
      <div class="filter-value">
        <el-date-picker v-model="activeDay"
                        prefix-icon="''"
                        type="date"
                        style="width: 120px"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        placeholder="全部"
                        :clearable="false"
                        @change="changeDay">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/libs/util'

export default {
  name: 'RadioDay',
  props: {
    value: String
  },
  data () {
    const date = Date.now(),
      day = 24 * 60 * 60 * 1000,
      lastDay = dateFormat(new Date(date - day))
    return {
      activeDay: this.value || lastDay,
      dayList: [
        { label: '昨天', value: lastDay },
        { label: '前天', value: dateFormat(new Date(date - day * 2)) },
        { label: '全部', value: '' }
      ]
    }
  },
  created () {
    this.$emit('input', this.activeDay)
  },
  methods: {
    selectDate (data) {
      this.activeDay = data.value
      this.changeDay()
    },
    changeDay (date) {
      this.$emit('input', this.activeDay)
      this.$emit('change', this.activeDay)
    }
  }
}
</script>

<style lang="scss">
.buss-day {
  padding: 0 12px;
  margin-bottom: 10px;

  p {
    color: $grey6;
    font-size: 14px;
    margin-bottom: 6px;
  }
  .radio-list {
    display: flex;
    line-height: 22px;
    padding: 5px;
    background: $sideMenuStress;
    color: $grey8;

    li {
      float: left;
      padding: 0 7px;
      margin-right: 6px;
      cursor: pointer;

      &.is-active {
        background-color: lighten($--color-primary, 10%);
      }
    }
  }
  .filter-value {
    margin-left: 10px;
  }
  .el-date-editor {
    input {
      background: transparent;
      border: none;
      padding-left: 5px;
      color: $grey10;
      line-height: 22px;
      height: 22px;
    }
  }
}
</style>

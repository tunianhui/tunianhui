<template>
  <div class="result-set height-100per flex-column">
    <div class="result-set-content">
      <div :class="['process-area', unfold ? 'unfold-area' : 'fold-area']">
        --此处为临时结果集{{ indexNum + 1 }}
        <div class="unfold-edit">
          <el-button type="text" @click="changFoldStatus">{{
            unfold ? '收起' : '展开'
          }}</el-button>
          <el-button type="text" @click="popup">编辑</el-button>
        </div>
        <div v-if="!isEdit">
          <div>select 字段组01</div>
          <div>from 输入表01</div>
          <div>where 过滤条件01</div>
          <div>group by 聚合项01</div>
        </div>
        <div v-else>
          SELECT {{ temp.str1.label + '--' + temp.str1.value }} <br />
          ,{{ temp.str2.label + '--' + temp.str2.value }} <br />
          ,{{ temp.str3.label + '--' + temp.str3.value }} <br />
          FROM {{ temp.table }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'ResultSet',
  mixins: [pager],
  components: {},
  props: {
    indexNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // isEdit: false,
      unfold: true,
      resultVal: {},
      temp: {},
    }
  },
  computed: {
    isEdit() {
      return JSON.stringify(this.temp) == '{}' ? false : true
    },
  },
  watch: {
    resultVal(n, o) {
      this.temp = n
      console.log('this.temp', this.temp)
    },
  },
  created() {},
  methods: {
    changFoldStatus() {
      this.unfold = !this.unfold
    },
    popup() {
      console.log('ResultSet', this.indexNum)
      this.$emit('popup', {
        index: this.indexNum,
      })
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.result-set {
  .result-set-content {
    .unfold-edit {
      float: right;
    }
    .process-area {
      background: #ccc;
    }
    .unfold-area {
      height: auto;
    }
    .fold-area {
      height: 28px;
      overflow: hidden;
    }
  }
}
</style>

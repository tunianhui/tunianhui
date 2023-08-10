<template>
  <section class="platform-self">
    <div class="space-between mb-10">
      <div class="flex">
        <div class="page-title">我的治理列表</div>
      </div>
    </div>

    <div class="search-wrapper">
      <div class="mb-20">
        <span class="title">治理领域</span>
        <Select :list="list1" @select='select1'></Select>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理对象</span>
        <Select :list="list2" @select='select2'></Select>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理项</span>
        <Select :list="list3" @select='select3'></Select>
      </div>
    </div>

    <keep-alive>
      <!-- 存储 -->
      <Storage v-if="index === 0"></Storage>
      <!-- 计算 -->
      <Calculation v-if="index === 1"></Calculation>
    </keep-alive>
  </section>
</template>

<script>
import Storage from './storage.vue'
import Calculation from './calculation.vue'
import Select from '../comps/select.vue'
export default {
  name: 'PlatformSelf',
  components: {
    Storage,
    Calculation,
    Select
  },
  data () {
    return {
      list1: [
        { name: '存储', value: 379 },
        { name: '计算', value: 341 }
      ],
      list2: [],
      list21: [
        { name: '物理表', value: 3031 },
        { name: '逻辑表', value: 748 }
      ],
      list22: [
        { name: '任务节点', value: 3031 }
      ],
      list3: [],
      list31: [
        { name: '空表', value: 3021 },
        { name: '未管理表', value: 456 },
        { name: '废弃表', value: 1 },
        { name: '生命周期过长', value: 0 },
        { name: 'sss', value: 800 },
        { name: '大于1GB的表', value: 800 },
        { name: '【双十二】存储大于1000', value: 0 },
        { name: '【双十二】存储大于1000', value: 456 },
        { name: '【双十二】存储大于1000', value: 88 }
      ],
      list32: [
        { name: '输入为空', value: 186 },
        { name: '产出表未被读', value: 97 },
        { name: '出差节点', value: 58 },
        { name: '暴力扫描', value: 0 },
        { name: '数据膨胀', value: 0 },
        { name: '数据倾斜', value: 0 },
        { name: '导入为空', value: 0 }
      ],
      index: 0
    }
  },
  mounted () {
    this.list2 = this.list21
    this.list3 = this.list31
  },
  methods: {
    searchChange (val) { },
    select1 (item, index) {
      this.index = index
      this.list2 = index === 0 ? this.list21 : this.list22
      this.list3 = index === 0 ? this.list31 : this.list32
    },
    select2 (item, index) {

    },
    select3 (item, index) {

    }
  }
}
</script>

<style lang="scss">
.platform-self {
  position: relative;
  .search-wrapper {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .title {
      display: inline-block;
      font-size: 14px;
      text-align: right;
      width: 80px;
      margin-right: 20px;
    }
    .line {
      height: 1px;
      background-color: #d9d9d9;
      margin-top: 10px;
      margin-left: 105px;
    }
  }
  .tips {
    font-size: 14px;
    padding: 5px 10px;
    background-color: #d7dcef;
    border: 1px solid #c5cbea;
    margin-bottom: 10px;
    .count {
      font-size: 18px;
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
    .link {
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
}

</style>

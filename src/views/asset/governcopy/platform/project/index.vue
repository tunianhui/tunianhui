<template>
  <section class="platform-self">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">项目治理列表</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的(8)" name="first"></el-tab-pane>
          <el-tab-pane label="全部(32)" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索数据名称" class="mr-10"></el-input>
          <!-- <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建治理项</el-button> -->
        </div>
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
      activeName: 'first',
      inputVal: '',
      list1: [
        { name: '存储', value: 5 },
        { name: '计算', value: 0 }
      ],
      list2: [],
      list21: [
        { name: '物理表', value: 34 },
        { name: '逻辑表', value: 77 }
      ],
      list22: [
        { name: '任务节点', value: 223 }
      ],
      list3: [],
      list31: [
        { name: '空表', value: 21 },
        { name: '未管理表', value: 55 },
        { name: '废弃表', value: 1 },
        { name: '生命周期过长', value: 0 },
        { name: 'sss', value: 2 },
        { name: '大于1GB的表', value: 2 },
        { name: '双十一废弃表处理', value: 0 },
        { name: '双十一废弃表处理', value: 456 },
        { name: '双十一废弃表处理', value: 88 }
      ],
      list32: [
        { name: '输入为空', value: 21 },
        { name: '产出表未被读', value: 7 },
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
    handleClick (val) { },
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
  height: 100%;
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
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

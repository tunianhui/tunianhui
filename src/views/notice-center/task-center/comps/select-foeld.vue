<template>
  <div class="select-field">
    <el-collapse v-model="activeName">
      <el-collapse-item :name="key" v-for="(val, key) in list" :key="key">
        <div slot="title" class="title">
          <i class="el-icon-arrow-down mr-10" v-if="!showIcon(key)"></i>
          <i class="el-icon-arrow-up mr-10" v-else></i>
          <span>{{val.cube_code}}</span>
          <span class="select-field__cube-code" v-for="item in val.operates" :key="item">
            <span>{{item | filterItem}}</span>
          </span>
        </div>
        <div class="table-wrapper">
          <el-table
            :data="val.list"
            style="width: 100%">
            <el-table-column
              type="index"
              width="55">
            </el-table-column>
            <el-table-column
              prop="elementCode"
              label="字段名">
            </el-table-column>
            <el-table-column
              prop="elementName"
              label="字段描述">
            </el-table-column>
            <el-table-column
              prop="elementType"
              label="数据类型">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { iconMapColor } from '@/config/rd-config.js'
export default {
  name: 'SelectField',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Object,
  },
  computed: {
    showIcon() {
      return item => {
        return this.activeName.includes(item)
      }
    }
  },
  filters: {
    filterItem(val) {
      console.log(val)
      return {
        SELECT: '查表数据',
        UPDATE: '改表数据',
        DELETE: '删表数据',
        ALTER: '改表结构'
      }[val]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.list = val
          this.activeName = Object.keys(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      iconMapColor,
      activeName: [],
      list: {}
    }
  },
  methods: {
    change() {
      this.$emit('change', this.list)
    },
    changeOperates(val) {
      this.change()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-collapse-item__arrow {
    display: none;
  }
}
.select-field {
  .title {
    padding: 0 20px;
    width: 100%;
    height: 100%;
    background: #ededf1;
    display: flex;
    align-items: center;
    i {
      font-size: 16px;
    }
    .select-field__cube-code {
      span {
        // display: flex;
        color: rgba(46, 116, 255, 1);
        background: rgba(230, 240, 255, 1);
        padding: 2px 5px;
        margin-left: 10px;
      }
    }
  }
  .operates {
    display: flex;
    padding: 0 20px;
    height: 40px;
    align-items: center;
  }
  .table-wrapper {
    // padding: 0 20px;
  }
}
</style>
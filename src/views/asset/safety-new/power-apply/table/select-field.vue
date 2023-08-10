<template>
  <div class="select-field">
    <el-collapse v-model="activeName">
      <el-collapse-item :name="key" v-for="(val, key) in list" :key="key">
        <div slot="title" class="title">
          <i class="el-icon-arrow-down mr-10" v-if="!showIcon(key)"></i>
          <i class="el-icon-arrow-up mr-10" v-else></i>
          <span>{{val.cube_code}}</span>
        </div>
        <h4 style="padding: 10px 20px">权限配置</h4>
        <div class="operates">
          <span class="mr-15">权限类型</span>
          <span>
            <el-checkbox-group v-model="val.operates" @change="changeOperates">
              <el-checkbox label="SELECT">查表数据</el-checkbox>
              <el-checkbox label="UPDATE">改表数据</el-checkbox>
              <el-checkbox label="DELETE">删表数据</el-checkbox>
              <el-checkbox label="ALTER">改表结构</el-checkbox>
            </el-checkbox-group>
          </span>
        </div>
        <div class="table-wrapper">
          <h4 class="mt-10 mb-10">字段列表</h4>
          <el-table
            :data="val.list"
            @select="handleSelectionChange"
            @select-all="selection => handleSelectionChangeAll(selection, val.list)"
            style="width: 100%">
            <el-table-column
              type="selection"
              prop="select"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="55">
            </el-table-column>
            <el-table-column
              prop="element_code"
              label="字段名">
            </el-table-column>
            <el-table-column
              prop="element_name"
              label="字段描述">
            </el-table-column>
            <el-table-column
              prop="element_type"
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
  watch: {
    value: {
      handler(val) {
        if (val) {
          console.log(val)
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
    },
    handleSelectionChange(selection, row) {
      console.log(selection, row)
      row.select = !row.select
    },
    handleSelectionChangeAll(selection, list) {
      list.forEach(item => {
        item.select = selection.length > 0
      })
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
  }
  .operates {
    display: flex;
    padding: 0 20px;
    height: 40px;
    align-items: center;
  }
  .table-wrapper {
    padding: 0 20px;
  }
}
</style>
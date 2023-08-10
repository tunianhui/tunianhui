<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-07-30 11:21:35
 * @LastEditTime: 2020-07-30 14:30:27
 * @Description:
-->
<template>
  <div class="initialize" v-loading="!!loading">
    <div class="initialize-head">
      <h3>初始化配置</h3>
      <p>
        在使用数据萃取前，需要您使用与数据萃取功能相绑定的计算引擎源名称，数据萃取相关的计算由此承担。绑定完成后，系统会自动帮您建立“数据萃取”项目。
      </p>
    </div>
    <el-form label-suffix="：" label-width="480px" :model="filter">
      <el-form-item label="研发模式">
        Basic <i class="el-icon-info"></i>
      </el-form-item>
      <el-form-item label="项目名称">
        数据萃取
      </el-form-item>
      <el-form-item label="项目英文名">
        Data_distill
      </el-form-item>
      <el-form-item label="描述">
        数据萃取专用项目，系统自动创建，不可修改。与ID中心、行为中心、标签中心相关的产出表、计算节点、资源消耗，皆位于此项目内。
      </el-form-item>
      <el-form-item
        label="计算引擎源"
        prop="engine"
        :rules="{required: true, message: '请选择计算引擎源'}"
      >
        <div class="flex-layout">
          <el-select v-model="filter.engine">
            <el-option
              v-for="item in engines"
              :key="item.id"
              :value="item.id"
              :label="item.engine_name"
            ></el-option>
          </el-select>
          <i class="el-icon-info p-10"></i>
          <el-button type="text" @click="testConnection">测试连接性</el-button>
        </div>
      </el-form-item>
      <el-form-item label="业务板块名称">萃取数据中心</el-form-item>
      <el-form-item label="业务板块英文名">LD_distill</el-form-item>
      <el-form-item label="空间类型">应用层</el-form-item>
    </el-form>
    <div class="initialize-foot">
      <p>初始化失败，请点击按钮重新初始化</p>
      <div>
        <el-button size="medium" type="primary" @click="confirm"
          >确定并开始初始化</el-button
        >
        <i class="el-icon-info ml-5"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {getTableList, getTestConnection} from '@/api/plan/compute-engine'
import {mapMutations} from 'vuex'

export default {
  name: 'Initialize',
  inheritAttrs: false,
  data() {
    return {
      loading: 0,
      filter: {
        engine: ''
      },
      engines: []
    }
  },
  mounted() {
    this.getEngines()
  },
  methods: {
    ...mapMutations({
      setInitialized: 'SET_INITIALIZED'
    }),
    async getEngines() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getTableList(),
        '获取计算引擎源失败'
      )
      if (res) {
        this.engines = res.data
      }
      this.loading--
    },
    async testConnection() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getTestConnection({
          id: this.filter.engine
        }),
        '测试连接性失败'
      )
      if (res) {
        this.$message({
          message: '测试连接性成功',
          type: 'success'
        })
      }
      this.loading--
    },
    confirm() {
      this.setInitialized(true)
      this.$router.push('/rd/exreact')
    }
  }
}
</script>

<style lang="scss" scoped>
.initialize {
  height: 100%;
  background: $grey7;
  padding: 30px;

  &-head {
    margin-bottom: 20px;
    p {
      margin-top: 8px;
      font-size: 12px;
    }
  }

  .el-form {
    padding: 20px;
    background: $grey9;

    .el-form-item {
      margin-bottom: 14px;
      font-size: 12px;
    }
    .flex-layout {
      align-items: center;
    }
  }

  .el-icon-info {
    font-size: 16px;
  }
  &-foot {
    font-size: 12px;
    text-align: center;
    p {
      margin: 20px 0 10px;
    }
    .el-icon-info {
      color: $error;
    }
  }
}
</style>

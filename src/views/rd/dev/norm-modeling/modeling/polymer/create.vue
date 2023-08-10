<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新建汇总逻辑表"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="create-polymer-table"
    @close="beforeClose"
    top="10vh"
    v-draggable="{
      trigger: '.create-polymer-table .el-dialog__header',
      body: '.create-polymer-table .el-dialog',
      recover: false
    }"
  >
    <el-steps
      :space="250"
      :active="activeStep"
      process-status="finish"
      finish-status="success"
      align-center
    >
      <el-step title="主键信息"></el-step>
      <el-step title="汇总逻辑表描述信息"></el-step>
    </el-steps>
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-width="120px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="统计粒度" prop="particle" v-if="activeStep === 0">
        <el-select
          v-model="filter.particle"
          filterable
          clearable
          multiple
          :multiple-limit="3"
          value-key="dim_id"
        >
          <el-option
            v-for="item in particleList"
            :key="item.dim_id"
            :label="`${item.dim_code}(${item.dim_name})`"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <div v-else>
        <el-form-item label="统计粒度">
          <el-tag
            class="mr-10"
            size="medium"
            type="info"
            v-for="item in tagList"
            :key="item"
            >{{ item }}</el-tag
          >
        </el-form-item>
        <el-form-item label="名称">{{ filter.name }}</el-form-item>
        <el-form-item label="英文名">{{ filter.code }}</el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            type="textarea"
            :rows="4"
            v-model="filter.desc"
            maxlength="128"
            show-word-limit
            placeholder="请输入汇总逻辑表描述"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="beforeClose">取消</el-button>
      <el-button type="primary" @click="nextStep" v-if="activeStep === 0"
        >下一步</el-button
      >
      <el-button type="primary" @click="activeStep = 0" v-if="activeStep === 1"
        >上一步</el-button
      >
      <el-button type="primary" @click="confirm" v-if="activeStep === 1"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {queryDimension1} from '@/api/rd/derive'
import {save} from '@/api/rd/polymer-table'

export default {
  name: 'PolymerTableCreate',
  mixins: [editDialog],
  data() {
    return {
      filter: {
        particle: [],
        code: '',
        name: '',
        desc: ''
      },
      rules: {
        particle: {required: true, message: '必填项'}
      },
      activeStep: 0,
      particleList: [],
      tagList: []
    }
  },
  created() {
    this.fetchParticleList()
  },
  methods: {
    beforeClose() {
      this.activeStep = 0
      this.close()
    },
    particleChange() {
      const ids = [],
        names = [],
        codes = []
      this.tagList = []
      this.filter.particle.forEach(item => {
        this.tagList.push(`${item.dim_code}(${item.dim_name})`)
        ids.push(item.dim_id)
        names.push(item.dim_name)
        codes.push(item.dim_code.split('dim_')[1])
      })
      this.filter.dim_id = ids.join('&')
      this.filter.name = names.join('_')
      this.filter.code = 'dws_' + codes.join('_')
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activeStep = 1
          this.particleChange()
        }
      })
    },
    async fetchParticleList() {
      const res = await this.$simpleAsyncTo(
        queryDimension1(),
        '获取统计粒度列表失败'
      )
      if (res) {
        this.particleList = res.data
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const {dim_id, desc} = this.filter
          const params = {
            dim_id,
            desc
          }
          const res = await this.$simpleAsyncTo(
            save(params),
            '新建汇总逻辑表失败'
          )
          if (res && res.flag) {
            this.$message({
              type: 'success',
              message: '新建汇总逻辑表成功！！!'
            })
          }
          this.$root.eventEmitter.emit('refresh')
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.create-polymer-table {
  // display: flex;
  // .el-dialog {
  //   margin: auto !important;
  // }
  .el-steps {
    width: 500px;
    margin: 0 auto 20px auto;
  }

  .custom-item {
    // width: 50%;
    .el-form-item__content {
      > .el-select,
      > .el-input {
        width: 50%;
      }
    }
    .el-icon-info {
      cursor: pointer;
      margin-left: 5px;
      font-size: 16px;
    }
  }
}
</style>

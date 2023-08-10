<template>
  <div class="add-sompute-set">
    <el-row class="mb-10">
      <el-col>计算设置<i class="el-icon-info ml-10 color"></i></el-col>
    </el-row>
    <div class="steps-title">
      <span>
        <i :class="[success_step?'el-icon-success':'el-icon-question', {'active': success_step}]"></i>
        <span>设置计算引擎</span>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">设置系统全局唯一计算及存储引擎类型</div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </span>
      <span></span>
      <span>
        <i :class="[success_step1?'el-icon-success':'el-icon-question', {'active': success_step1}]"></i>
        <span>设置集群及元数据</span>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">设置系统计算集群地址，即软件部署及数据物理计算存储的集群地址，以进行元数据连接与采集管理</div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </span>
    </div>
    <section style="width:50%;margin:0 auto">
      <div class="step-1 animated fadeInRight" v-if="step===1">
        <div class="mt-20 flex-center steps-content">
          <el-form
            ref="form"
            :model="form"
            label-width="120px"
            style="width:100%"
            :rules="rules"
            :hide-required-asterisk="false"
            label-suffix="：">
            <el-form-item label="计算引擎名称" prop="engine_name">
              <el-input v-model="form.engine_name" maxlength="32" show-word-limit placeholder="最多输入32个字符"></el-input>
            </el-form-item>
            <el-form-item label="计算引擎类型" prop="engine_type">
              <el-select v-model="form.engine_type" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in engineTypeList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计算引擎编码" prop="engine_code">
              <el-input v-model="form.engine_code"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="text-center pt-20">
          <el-button @click="nextStep(step)" type="success" :disabled="disabled_next">下一步</el-button>
        </div>
      </div>
      <div class="step-2 animated fadeInRight mt-20 pt-20 mb-20 pb-20" v-if="step===2">
        <div style="font-size:14px;min-height:200px" class="text-center steps-content" v-if="engine_bigdata_hdp">bigdata计算引擎类型无需设置集群及元数据信息，请直接点击下一步进行bigdata平台连通性测试</div>
        <div class="flex-center steps-content" v-else>
          <el-form
            :model="congifInfo"
            :rules="congifInfoRules"
            ref="three"
            label-width="130px"
            class="demo-ruleForm"
            style="width:100%"
            label-suffix="：">
            <el-form-item label-width="0">
              <div class="f-size">Hive配置</div>
            </el-form-item>
            <el-form-item label="JDBC驱动串" prop="connction_driver_name">
              <el-input v-model="congifInfo.connction_driver_name"></el-input>
            </el-form-item>
            <el-form-item label="JDBC连接串" prop="connction_url">
              <el-input v-model="congifInfo.connction_url"></el-input>
            </el-form-item>
            <el-form-item label="JDBC连接用户名" prop="connction_user_name">
              <el-input v-model="congifInfo.connction_user_name"></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="thrift_port">
              <el-input v-model="congifInfo.thrift_port"></el-input>
            </el-form-item>
            <el-form-item label="元数据类型" prop="hive_database_type">
              <el-input v-model="congifInfo.hive_database_type"></el-input>
            </el-form-item>
            <el-form-item label="元数据地址" prop="metastore_host">
              <el-input v-model="congifInfo.metastore_host"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="f-size">HDFS配置</div>
            </el-form-item>
            <el-form-item label="HDFS URL" prop="fs_defaultFS">
              <el-input v-model="congifInfo.fs_defaultFS"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="f-size">Spark配置</div>
            </el-form-item>
            <el-form-item label="队列名" prop="spark_yarn_queue">
              <el-input v-model="congifInfo.spark_yarn_queue"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="f-size">Tez配置</div>
            </el-form-item>
            <el-form-item label="队列名" prop="tez_queue_name">
              <el-input v-model="congifInfo.tez_queue_name"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="f-size">MapReduce配置</div>
            </el-form-item>
            <el-form-item label="队列名" prop="mapreduce_job_queuename">
              <el-input v-model="congifInfo.mapreduce_job_queuename"></el-input>
            </el-form-item>
          </el-form>
          <el-dialog
            title="设置ambar连接信息"
            :visible.sync="ambarVisible"
            :close-on-click-modal="false"
            width="40%"
            :append-to-body="true"
            :show-close="false"
            :close-on-press-escape="false">
            <el-form
              :model="ambarInfo"
              :rules="ambarInfoRules"
              ref="ambarInfo"
              :hide-required-asterisk="false"
              label-suffix="：">
              <el-form-item label="URL" label-width="100px" prop="endpoint">
                <el-input v-model="ambarInfo.endpoint" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户名" label-width="100px" prop="amberi_user" maxlength="32" show-word-limit>
                <el-input v-model="ambarInfo.amberi_user" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" label-width="100px" prop="amberi_passwd">
                <el-input v-model="ambarInfo.amberi_passwd" autocomplete="off" type="password"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="readConfigInfo(true)">读取配置信息</el-button>
              <el-button type="primary" @click="readConfigInfo(false)">不，我要手动输入</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="text-center pt-20">
          <el-button @click="upperStep(step)" :disabled="disabled_prev" type="success">上一步</el-button>
          <el-button @click="nextStep(step)" :disabled="disabled_next" type="success">下一步</el-button>
        </div>
      </div>
      <div class="step-3 animated fadeInRight mt-20 pt-20 mb-20 pb-20" v-if="step===3">
        <div class="steps-three">
          <div class="data-type flex-layout">
            <el-tooltip effect="dark" placement="top" v-for="(item, index) in engineTypeList" :key="index">
              <div slot="content"  v-if="form.engine_type===item.key">支持{{item.value}}</div>
              <div slot="content" v-else>如若更改计算引擎，请返回上一步重新设置</div>
              <a href="javascript:;" :class="[{'active': form.engine_type!==item.key}, 'item']">
                <div>
                  <span>
                    <i :class="['icon', 'iconfont', item.value==='bigdata'?'icon-Metadataspecificati':'icon-HDPE']"></i>
                  </span>
                  <div>{{item.value}}</div>
                </div>
              </a>
            </el-tooltip>
          </div>
          <div class="steps-tip mt-20 mb-20">
            <span>当前仅支持单集群计算及元数据管理</span>
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">Hadoop支持添加同集群多个HDFS地址，只要有一个地址校验成功，即可完成元数据采集；如有Host地址绑定，请务必填写</div>
              <i class="el-icon-info ml-10"></i>
            </el-tooltip>
          </div>
          <div class="check">
            <el-form :model="checkData" :rules="checkRules" ref="check" label-width="100px" class="demo-ruleForm" :inline="true">
              <el-form-item label="Endpoint：" prop="endpoint" style="width:80%">
                <!-- <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">系统中已生成数据源或您不是超级管理员，所以无法操作</div>
                  <el-input v-model="checkData.endpoint" style="width:90%" :disabled="is_disabled"></el-input>
                </el-tooltip> -->
                <el-input v-model="checkData.endpoint" style="width:90%"></el-input>
              </el-form-item>
              <el-form-item prop="">
                <el-button type="primary" @click="checkHandle" size="mini">{{thro_flag?'检验中...':'校验'}}</el-button>
              </el-form-item>
            </el-form>
            <div class="check-log pt-10 pb-10 mt-20 pl-20" v-if="check_show">
              <div class="log-item" v-for="item in checkInfo" :key="item.info">
                <i :class="[item.state?'el-icon-success c-success':'el-icon-error c-err']"></i>
                <span class="ml-10">{{item.info}}</span>
              </div>
            </div>
          </div>
          <div class="foot">
            <el-button :disabled="disabled_prev" type="success" @click="upperStep(step)">上一步</el-button>
            <el-button :disabled="disabled_next" type="success" @click="submitDataBuild">确认并开始数据建设</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import 'animate.css'
import { getEngineType, getInfos, getCheck, getAddEngine } from '@/api/management/comput'
export default {
  name: 'Add',
  data() {
    return {
      disabled_prev: false,
      success_step: false,
      success_step1: false,
      disabled_next: true,
      engine_bigdata_hdp: false,
      is_disabled: false,
      step: 1,
      form: {
        engine_name: '',
        engine_type: '',
        engine_code: ''
      },
      rules: {
        engine_name: [{ required: true, message: '请输入计算引擎名称', trigger: 'blur' }, { min: 1, max: 32, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        engine_type: [{ required: true, message: '请输入计算引擎类型', trigger: 'change' }],
        engine_code: [{ required: true, message: '请输入计算引擎类型', trigger: 'blur' }]
      },
      congifInfo: {
        connction_driver_name: '',
        connction_url: '',
        connction_user_name: '',
        thrift_port: '',
        hive_database_type: '',
        metastore_host: '',
        fs_defaultFS: '',
        spark_yarn_queue: '',
        tez_queue_name: '',
        mapreduce_job_queuename: ''
      },
      ambarInfo: {
        endpoint: '',
        amberi_user: '',
        amberi_passwd: ''
      },
      ambarVisible: false,
      congifInfoRules: {},
      ambarInfoRules: {
        endpoint: [
          {required: true, message: '请输入URL', trigger: 'none'}
        ],
        amberi_user: [
          {required: true, message: '请输入用户名', trigger: 'none'}
        ],
        amberi_passwd: [
          {required: true, message: '请输入密码', trigger: 'none'}
        ]
      },
      checkData: {
        endpoint: ''
      },
      checkRules: {},
      checkInfo: [],
      check_show: false,
      thro_flag: false,
      engineTypeList: []
    }
  },
  watch: {
    form: {
      handler(val) {
        for (let key in val) {
          if (val[key] === '') {
            this.disabled_prev = false
            this.disabled_next = true
            this.success_step = false
            return
          } else {
            this.disabled_prev = true
            this.disabled_next = false
            this.success_step = true
          }
        }
      },
      deep: true,
      immediate: true
    },
    congifInfo: {
      handler(val) {
        for (let key in val) {
          if (val[key] === '') {
            this.disabled_next = true
            return
          } else {
            this.disabled_next = false
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getEngineType()
  },
  methods: {
    // 下一步
    nextStep(step) {
      if (step === 1) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.step = 2
            this.disabled_prev = false
            if (this.form.engine_type === 0) {
              this.engine_bigdata_hdp = true
            } else {
              this.engine_bigdata_hdp = false
              this.ambarVisible = true
              for (let value of Object.values(this.congifInfo)) {
                if (value === '') {
                  this.disabled_next = true
                }
              }
            }
          }
        })
      } else if (step === 2) {
        this.step = 3
        this.disabled_next = true
        let _index = this.engineTypeList.findIndex(e => {
          return e.key === this.form.engine_type
        })
        if (this.form.engine_type === this.engineTypeList[_index].key) {
          this.checkData.endpoint = this.ambarInfo.endpoint
        }
        if (this.ambarInfo.endpoint !== '') {
          this.is_disabled = true
        } else {
          this.is_disabled = false
        }
      }
    },
    // 上一步
    upperStep(step) {
      if (step === 2) {
        this.step = 1
        for (let value of Object.values(this.form)) {
          if (value === '') {
            this.disabled_next = true
            this.disabled_prev = false
            return false
          } else {
            this.disabled_prev = true
            this.disabled_next = false
          }
        }
      } else if (step === 3) {
        this.step = 2
        this.disabled_prev = false
        this.disabled_next = false
        this.success_step1 = false
      }
    },
    // 读取配置信息
    readConfigInfo(ambarInfo) {
      this.$refs['ambarInfo'].validate(async valid => {
        if (ambarInfo) {
          if (valid) {
            const params = { ...this.ambarInfo }
            const res = await this.$simpleAsyncTo(getInfos(params), '读取配置信息失败')
            if (res) {
              this.congifInfo = res.data
              this.ambarVisible = false
            }
          }
        } else {
          // this.congifInfo.connction_driver_name = ''
          // this.congifInfo.connction_url = ''
          // this.congifInfo.connction_user_name = ''
          // this.congifInfo.thrift_port = ''
          // this.congifInfo.hive_database_type = ''
          // this.congifInfo.metastore_host = ''
          // this.congifInfo.fs_defaultFS = ''
          // this.congifInfo.spark_yarn_queue = ''
          // this.congifInfo.tez_queue_name = ''
          // this.congifInfo.mapreduce_job_queuename = ''
          this.ambarVisible = false
          this.disabled_prev = false
          this.ambarInfo.endpoint = ''
          this.ambarInfo.amberi_user = ''
          this.ambarInfo.amberi_passwd = ''
        }
      })
    },
    // 确认数据建设
    async submitDataBuild() {
      const params = {
        ...this.form,
        metaInfos: this.congifInfo,
        amberi_user: this.ambarInfo.amberi_user,
        amberi_passwd: this.ambarInfo.amberi_passwd,
        endpoind: this.checkData.endpoint
      }
      this.globalLoading()
      const res = await this.$simpleAsyncTo(getAddEngine(params), '新增失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$router.push({name: 'compute'})
      }
      this.globalLoading().close()
    },
    // 校验
    async checkHandle() {
      if (!this.thro_flag) {
        this.thro_flag = true
        const params = {
          endpoint: this.checkData.endpoint,
          amberi_user: this.ambarInfo.amberi_user,
          amberi_passwd: this.ambarInfo.amberi_passwd,
          engine_type: this.form.engine_type
        }
        this.globalLoading('校验中...')
        const res = await this.$simpleAsyncTo(getCheck(params), '校验失败')
        if (res) {
          this.check_show = true
          this.checkInfo = res.data
          let flag = res.data.every(e => {
            return e.state === true
          })
          if (flag) {
            this.disabled_next = false
            this.success_step1 = true
          } else {
            this.disabled_next = true
            this.success_step1 = false
          }
          this.thro_flag = false
        }
        this.globalLoading().close()
      }
    },
    // 获取计算引擎类型
    async getEngineType() {
      const res = await this.$simpleAsyncTo(getEngineType(), '获取计算引擎失败')
      if (res) {
        this.engineTypeList = res.data.engine_type
      }
    }
  }
}
</script>

<style lang="scss">
.add-sompute-set {
  padding: 15px 15px 0 15px;
  .animated {
    animation-duration: 0.3s;
  }
  .color {
    color: $grey5;
  }
  .f-size {
    font-size: 16px;
    text-align: start!important;
  }
  .steps-title {
    height: 40px;
    background: $grey10;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    >span:first-child,>span:last-child {
      i:first-child {
        font-size: 22px;
        color: $--color-primary;
        vertical-align: sub;
        &.active {
          color: $success;
        }
      }
      i:last-child {
        color: $grey5;
      }
      span {
        padding: 0 5px;
      }
    }
    >span:nth-child(2) {
      display: inline-block;
      width: 20%;
      border-bottom: 1px dashed $grey4;
      margin: 0 5px 3px 5px;
    }
  }
  .steps-content {
    padding: 30px 110px 30px 0px;
    text-align: center;
  }
  .step-3 {
    .steps-three {
      .data-type {
        flex-wrap: wrap;
        .item {
          width: 180px;
          height: 60px;
          background: $grey10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 20px;
          margin-bottom: 10px;
          color: $grey1;
          border: 2px solid transparent;
          >div {
            line-height: 40px;
            display: flex;
            padding-left: 10px;
            span {
              width: 40px;
              height: 40px;
              margin-right: 20px;
              background: $success;
              i {
                font-size: 40px;
                color: $grey10;
              }
            }
          }
          &:hover {
            border-color: $user1;
          }
          &.active {
            opacity: .3;
            cursor:not-allowed;
          }
        }
      }
      .steps-tip {
        font-size: 12px;
        i {
          font-size: 14px;
          color: $grey5;
        }
      }
      .check {
        .el-form-item__content {
          width: calc(100% - 100px);
        }
        .check-log {
          .log-item {
             span {
              font-size: 12px;
            }
            .c-success {
              color: $success;
            }
            .c-err {
              color: $error;
            }
          }
        }
      }
    }
  }
  .foot {
    text-align: center;
    padding-bottom: 20px;
    margin-top: 50px;
  }
}
</style>

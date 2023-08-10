<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-24 14:30:36
 * @LastEditTime: 2023-05-25 09:28:39
 * @Description:
-->
<template>
    <el-dialog :title="info.length > 1 ? '批量申请密钥权限' : info.length === 0 ? '申请密钥权限' : `申请密钥权限：${info[0].secretKeyName}`" :visible.sync="dialogVisible" @close="close" width="45%" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="info.length !== 1" label="申请密钥" prop="account">
            <el-select multiple v-model="form.account" placeholder="请选择">
                <el-option v-for="item in SecretKeysList" :key="item.secretKeyId" :value="item.owner" :label="item.owner"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="权限类型" prop="permissionType">
          <el-checkbox-group v-model="form.permissionType">
            <el-checkbox v-for="item in permissionTypeList" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="账号类型" prop="persionAccountEnable"> -->
          <el-form-item label="账号类型" prop="day">
            <!-- <el-checkbox-group v-model="form.persionAccountEnable"> -->
                <!-- <el-checkbox label="1" class="mr-20" style="width: 98%;"> -->
                    <div class="flex mt">
                        <div class="checkbox1">个人账号 </div>
                        <div class="item-dashed"></div>
                        <div class="flex item-to">
                            <div class="flex"> 
                              <div class="checkbox1">有效期至</div>
                                <!-- <el-form-item prop="day"> -->
                                    <el-select v-model="form.day" placeholder="请选择" class="days-select" @change="selectTime">
                                        <el-option v-for="item in daysList" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                <!-- </el-form-item> -->
                            </div>
                            <div class="mb-0">
                                <el-form-item prop="time">
                                    <el-date-picker v-model="form.time" type="date" placeholder="选择日期" class="time-select"  :disabled="customData !== 'custom'">
                            </el-date-picker>
                                </el-form-item>
                            </div>
                        </div>  
                    </div>
                <!-- </el-checkbox> -->
                <!-- <el-checkbox label="2" class="mr-20" style="width: 98%;">
                    <div class="flex">
                       <div class="flex">项目生产账号<P>(有效期为长期)</P></div>
                       <div class="item-dashed"></div>
                       <div class="flex">
                        <div>归属账号</div>
                            <div>
                            <el-select  placeholder="请选择" class="days-select">
                                <el-option v-for="item in accountList" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                       </div>  
                    </div>
                    
                </el-checkbox> -->
            <!-- </el-checkbox-group> -->
        </el-form-item>
        <el-form-item label="申请原因" prop="applyReason">
          <el-input type="textarea" v-model="form.applyReason" maxlength="128" show-word-limit placeholder="请填写续期原因，包含使用场景，使用频率等信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="SubmitEvent">确 定</el-button>
      </div>
    </el-dialog>
  </template>
  
  <script>
  import {getPermissionTypeData, getValidUntilData, permissionApply, getSecretKeysData } from '@/api/asset/security.js'
  import {dateFormat} from '@/libs/util.js'
  export default {
    name: 'Apply',
    props: {
      info: Array
    },
    data () {
      return {
        SecretKeysList: [],
        permissionTypeList: [],
        form: {
          account: [],
          permissionType: [],
          applyReason: '',
          day: '',
          time: '',
          persionAccountEnable: []
        },
        dialogVisible: true,
        rules: {
          account: [
            { required: true, message: '请选择用户', trigger: 'blur' }
          ],
          permissionType: [
            { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
          ],
          applyReason: [
            { required: true, message: '请填写申请原因', trigger: 'blur' }
          ],
          persionAccountEnable: [
            {type: 'array', required: true, message: '请至少选择一个账号类型', trigger: 'change'}
          ],
          day: [
            { required: true, message: '请选择个人账号有效期', trigger: 'change'}
          ],
        },
        daysList: [],
        customData: '',
        accountList: [],
        bodyHeight: 0,
      }
    },
    watch: {
      info: {
        immediate: true,
        handler(val) {
            if (val.length > 1) {
                this.form.account = val.map(item => item.secretKeyName)
            }
        //   if (val.length === 1) {
        //     this.form.permissionType.push(val[0].permissionType)
        //     this.form.day = val[0].persionAccountEnable
        //     this.form.time = val[0].validUntil
        //   }
        }
      }
    },
    mounted () {
      this.getPermissionTypeData()
      this.getValidUntilData()
      this.getSecretKeysData()
    },
    methods: {
      selectTime() {
        this.customData = this.form.day.split('d')[0]
        const start = new Date()
        this.form.time = start.setTime(start.getTime() + 3600 * 1000 * 24 * this.customData)
      },
      close () {
        this.$emit('applyClose')
      },
      SubmitEvent() {
        this.$refs.formRef.validate(valid => {
            if (valid) {
               this.permissionApply()
               this.$emit('submitApply') 
            }
        })
        
      },
      async getPermissionTypeData() {
        const res = await getPermissionTypeData()
        if (res) {
          this.permissionTypeList = res.data
        }
      },
      async getValidUntilData() {
        const res = await getValidUntilData() 
        if (res) {
          this.daysList = res.data
        }
      },
      async getSecretKeysData() {
        const params = {
          secretKeyId: '',
          secretKeyName: '',
          pageSize: 100,
          pageNo: 1 
        }
        const res = await getSecretKeysData(params)
        if (res) {
          this.SecretKeysList = res.data.totalList
        }
      },
      async permissionApply() {
        const secretKeyId = this.info.map(item => item.secretKeyId)
        let time = ''
        if (this.customData !== 'all') {
            time = dateFormat(new Date(this.form.time)) 
        } else {
            time = 'all'
        }
        const params = {
            secretKeyId: secretKeyId + '',
            permissionType: this.form.permissionType +'',
            personValidUntilType: this.form.day,
            personValidUntil: time,
            // personValidUntil: this.form.time,
            applyReason:this.form.applyReason,
            persionAccountEnable : '1',
            // produceAccountEnable: 0,
            produceValidUntilType: '',
            produceValidUntil: '',
            permissionSource: '0',

        }
        const res = await permissionApply(params)
        if (res) {
          const h = this.$createElement;
          this.$message({
            type: "success",
            duration:2000,
            message: h("div",{ style: "padding-right:20px display: flex;align-items: center;color:#00B42A" },[
                     h("span", null, `您已提交${this.info.length}个密钥${this.form.account}的权限申请,`),
                     h("span",{style: "color: blue",on: {click: () => {this.goToRenew();},},},"去任务中心查看>"),
                      ]
                      ),
                     });
        }
      },
      goToRenew() {
        this.$router.push({path: '/notice-center/task-center'})
      }
    }
  }
  </script>
  <style lang="scss" scoped>
  .checkbox1{
    min-width: 60px;
  }
  :deep(.el-checkbox__label){
    width: 98%;
    margin-top: -20px;
  }
  .mt{
    margin-top: -3px;
  }
  .mb-0{
    .el-form-item{
      margin-bottom: 0;
    }
  }

  .mr-20{
    // width: 98%;
    p{
        color: #D3D3D5;
    }
  }
  .item-to{
    margin-right: 0px;
  }
  .time-select {
      // width: 130px;
      width: 100%;
      min-width: 150px;
    }
  .days-select {
      width: 90px;
        // min-width: 90px;
        // margin-right: 5px;
  }
  .item-dashed{
    border: 1px dashed #D3D3D5;
    margin: 0 15px;
    width: 40%;
  }
  :deep(.el-dialog__body) {
    // padding-top: 20px;
    padding-bottom: 20px;
}
  </style>
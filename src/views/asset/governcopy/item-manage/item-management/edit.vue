<template>
  <section class="edit-wrapper">
    <div class="edit-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/asset/govern/item-manage/item-management' }">治理项管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑治理项</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="section-title">编辑治理项</div>
      <div class="section">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="right" label-suffix="：" class="basic-info">
          <el-row>
            <el-col :span="8">
              <el-form-item label="治理项基础配置" prop="type">
                <span>自定义治理项</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="section-title">治理项基础配置</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="right" label-suffix="：" class="basic-info">
        <el-row>
          <el-col :span="8">
            <el-form-item label="治理项名称" prop="field1">
              <span>大于1GB的表</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="治理对象" prop="field2">
              <span>物理表</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="展示字段" prop="fields">
              <el-checkbox-group v-model="form.fields">
                <el-checkbox v-for="(item,index) in fieldlist" :key="index" :label="item.name">{{item.name}}({{item.nameCn}})</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" plain @click="editField">编辑已有字段</el-button>
          </el-col>
          <el-col :span="24">
            <el-form-item label="治理操作" prop="opertaion">
              <el-checkbox-group v-model="form.opertaion">
                <el-checkbox label="移入回收站"></el-checkbox>
                <el-checkbox label="生命周期修改"></el-checkbox>
                <el-checkbox label="暂停表节点"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="治理领域" prop="field3">
              <span>存储</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="治理项说明" prop="field4">
              <el-input type="textarea" maxlength="256" placeholder="请输入" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="section-title">编辑治理项规则</div>
      <div class="section">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="right" label-suffix="：" class="basic-info">
          <el-row>
            <el-col :span="8">
              <el-form-item label="治理方式" prop="type">
                <span>规则配置</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="section-title">规则配置区</div>
      <div class="section">

      </div>
      <footer class="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </footer>
    </div>
  </section>
</template>
<script>

export default {
  name: 'LaunchPush',
  mixins: [],
  data () {
    return {
      form: {
        fields: [],
        opertaion: []
      },
      rules: {
        field1: [
          { required: true, message: '请输入治理项名称', trigger: 'blur' }
        ],
        field2: [
          { required: true, message: '请选择治理对象', trigger: 'blur' }
        ],
        field3: [
          { required: true, message: '请选择治理领域', trigger: 'blur' }
        ],
        field4: [
          { required: true, message: '请输入治理项说明', trigger: 'blur' }
        ]
      },
      radio: '1',
      tableData: [],
      fieldlist: [
        { name: 'table_name', nameCn: '表名' },
        { name: 'owner_name', nameCn: '负责人' },
        { name: 'health_score', nameCn: '健康分' },
        { name: 'pangu_file_size', nameCn: '存储大小' },
        { name: 'life_cycle', nameCn: '生命周期' },
        { name: 'max_bizdata_33', nameCn: '33天访问跨度' },
        { name: 'logical_project_name', nameCn: '项目名称' }
      ]
    }
  },
  methods: {
    // 编辑已有字段
    editField () {

    },
    cancel () {
      this.$router.push({ path: '/asset/govern/item-manage/item-management' })
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '治理项已提交成功 ')
              // h('i', { style: 'color: teal' }, 'VNode')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                done()
                this.$router.push({ path: '/asset/govern/item-manage/item-management' })
              } else {
                done()
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: 'action: ' + action
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-wrapper {
  .section-title {
    margin: 20px 0 10px 0;
  }
  .basic-info {
    background-color: #fff;
    padding-top: 20px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <el-dialog
    :title="`数据板块授权：${user}`"
    :visible.sync="dialogVisible"
    @close="close"
    width="45%"
    class="empower-dialog-datasource"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules">
      <el-form-item label=" " class="user">
        <template>
          <div slot="label"><span>*</span>授权用户：</div>
          <el-row class="mb-10">
            <el-col :span="10">
              <div class="flex">
                <div class="font-12 label-width">个人账号</div>
                <div>
                  <el-select v-model="form.name" filterable placeholder="搜索用户" class="user-select">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="flex">
                <div class="font-12 label-width">有效期至</div>
                <div>
                  <el-select v-model="form.day" placeholder="请选择" class="days-select">
                    <el-option
                      v-for="item in daysList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-date-picker
                    v-model="form.time"
                    type="date"
                    placeholder="选择日期" class="time-select">
                  </el-date-picker>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="flex">
                <div class="font-12 label-width">生产账号</div>
                <div>
                  <el-select v-model="form.name" filterable placeholder="搜索项目" class="user-select">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="逻辑表：" label-width="100px" prop="logicalTable">
        <el-autocomplete
          v-model="form.logicalTable"
          :fetch-suggestions="querySearchAsync"
          placeholder="搜索逻辑表"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="权限类型：" label-width="100px" prop="powerType">
        <el-checkbox-group v-model="form.powerType">
          <el-checkbox label="查表数据"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="授权原因：" label-width="100px" prop="reason">
        <el-input type="textarea" v-model="form.reason" placeholder="授权原因" maxlength="128" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EmpowerDialogDatasource',
  props: {
    user: String
  },
  data() {
    return {
      dialogVisible: true,
      form: {
        name: '',
        user: '',
        day: '1',
        time: '',
        logicalTable: '',
        powerType: [],
        reason: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        powerType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        logicalTable: [
          { required: true, message: '请选择逻辑表', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写授权原因', trigger: 'blur' }
        ]
      },
      userList: [],
      daysList: [
        {
          label: '30天',
          value: '1'
        }
      ],
      restaurants: [],
      timeout:  null
    }
  },
  mounted () {
    this.restaurants = this.loadAll();
  },
  methods: {
    close() {
      this.$emit('empowerClose')
    },
    loadAll() {
      return [
        { "value": "表一" },
        { "value": "表二" },
        { "value": "表三" },
        { "value": "逻辑表四" },
      ];
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
    }
  }
}
</script>

<style lang="scss">
.empower-dialog-datasource {
  .user {
    label {
      width: 100px;
      text-align: start;
      display: contents;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        color: red;
      }
    }
    .days-select {
      width: 90px;
      margin-right: 5px;
    }
    .time-select {
      width: 130px;
      margin: 0;
    }
    .label-width {
      width: 100px;
      text-align: center;
    }
  }
  .el-form-item {
    label {
      text-align: start;
    }
  }
}
</style>

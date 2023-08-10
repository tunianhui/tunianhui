<template>
  <el-dialog
    :title="`数据源权限回收：${user}`"
    :visible.sync="dialogVisible"
    @close="close"
    width="45%"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules">
      <el-form-item label="回收用户：" :label-width="formLabelWidth" prop="name">
        <el-select v-model="form.name" filterable placeholder="搜索用户">
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-form-item label="回收原因：" :label-width="formLabelWidth" prop="reason">
        <el-input type="textarea" v-model="form.reason" maxlength="128" show-word-limit placeholder="回收原因"></el-input>
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
  name: 'RecoveryDialogDatasource',
  props: {
    user: String
  },
  data() {
    return {
      form: {
        name: '',
        powerType: [],
        logicalTable: '',
        reason: ''
      },
      dialogVisible: true,
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        logicalTable: [
          { required: true, message: '请选择逻辑表', trigger: 'change' }
        ],
        powerType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写回收原因', trigger: 'blur' }
        ]
      },
      userList: [
        {
          value: '1',
          label: '用户一'
        },
        {
          value: '2',
          label: '用户二'
        },
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
      this.$emit('recoveryClose')
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

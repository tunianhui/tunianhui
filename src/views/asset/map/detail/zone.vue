<template>
  <div class="zone no-hover">
    <div class="animated fadeInRight">
      <div class="select-time mb-20">
        <span class="mr-10">分区</span>
        <span class="mr-10">结束分区日期</span>
        <el-date-picker
          v-model="currentTime"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="timeChangeHandle"
        >
        </el-date-picker>
      </div>
      <div class="select-field">
        <span class="mr-10">字段</span>
        <el-select
          v-model="currentField"
          multiple
          placeholder="请选择"
          size="medium"
          :clearable="true"
          @change="fieldChangeHandle"
        >
          <el-option
            v-for="item in fieldOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="field-date">
        <el-table stripe :data="tableData" v-loading="!!loading">
          <el-table-column
            prop="column_name"
            label="字段"
            width="180"
          ></el-table-column>
          <el-table-column :label="currentTime">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                placement="right"
                v-for="(item, index) in scope.row.partitions"
                :key="index"
              >
                <div slot="content">
                  <span class="mb-20" style="padding:5px 0"
                    >分区时间：{{ item.create_time }}</span
                  ><br />
                  <!-- <span style="margin-top:20px;">字段：{{scope.row.column_name}}</span><br/> -->
                  <span style="margin-top:20px;"
                    >表条数：{{ item.num_rows }}</span
                  ><br />
                  <span style="margin-top:20px;"
                    >表大小：{{ item.raw_size }}</span
                  ><br />
                  <span style="margin-top:20px;"
                    >hdfs大小：{{ item.hdfs_size }}</span
                  >
                </div>
                <span class="rect"></span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {get30Days} from '@/libs/util'
import {mapGetters} from 'vuex'
import {getPartitionInfo} from '@/api/asset/map'
export default {
  name: 'Zone',
  data() {
    return {
      currentTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      currentField: [],
      fieldOptions: [],
      tableData: [],
      timeLine: [],
      loading: 0
    }
  },
  watch: {
    currentTime: {
      handler(val) {
        let list = get30Days(val)
        this.timeLine = list.map(e => {
          return {zone: e, field: 'id'}
        })
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created() {
    this.getPartitionInfo()
  },
  updated() {},
  methods: {
    // 获取分区信息
    async getPartitionInfo() {
      this.loading++
      const params = {
        cube_id: this.cube_id,
        end_time: this.currentTime,
        column_name: JSON.stringify(this.currentField)
      }
      const res = await this.$simpleAsyncTo(getPartitionInfo(params))
      if (res) {
        this.fieldOptions = res.columns
        this.tableData = res.data
      }
      this.loading--
    },
    fieldChangeHandle(val) {
      this.currentField = val
      this.getPartitionInfo()
    },
    timeChangeHandle(val) {
      this.end_time = val
      this.getPartitionInfo()
    }
  }
}
</script>

<style lang="scss">
.zone {
  .animated {
    animation-duration: 0.3s;
  }
  > div {
    padding: 10px 0;
  }
  padding: 0 20px;
  font-size: 14px;
  .select-time {
    span:last-child {
      font-size: 12px;
      color: $grey4;
    }
  }
  .select-field {
    .el-select {
      width: calc(100% - 200px);
    }
  }
  .field-date {
    .rect {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: $waitRun;
      margin: 5px;
    }
  }
}
</style>

<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-20 11:18:01
 * @LastEditTime: 2023-01-10 10:35:45
 * @Description: 资产信息
-->
<template>
  <div class="info-detail">
    <h3>资产信息</h3>
    <div class="basic" v-if="tableInfo.object_type === 23">
      <h4 class="">项目概况</h4>
      <div>
        <span>总表数：</span>
        <OverflowTooltip class="basic-info">1</OverflowTooltip>
      </div>
      <div>
        <span>离线存储量：</span>
        <OverflowTooltip class="basic-info">--</OverflowTooltip>
      </div>
    </div>

    <div class="basic">
      <h4 class="">基础信息</h4>
      <template v-if="tableInfo.object_type === 22">
        <div>
          <span>函数名称：</span>
          <OverflowTooltip class="basic-info">isOneBelt</OverflowTooltip>
        </div>
        <div>
          <span>函数ID：</span>
          <OverflowTooltip class="basic-info">67048898833</OverflowTooltip>
        </div>
        <div>
          <span>函数类型：</span>
          <OverflowTooltip class="basic-info">字符串</OverflowTooltip>
        </div>
        <div>
          <span>函数来源：</span>
          <OverflowTooltip class="basic-info">自定义函数</OverflowTooltip>
        </div>
        <div>
          <span>所属项目：</span>
          <OverflowTooltip class="basic-info">v32_ul_automatic</OverflowTooltip>
        </div>
        <div>
          <span>创建人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.create_time}}</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 23">
        <div>
          <span>管理员：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.create_time}}</OverflowTooltip>
        </div>
        <div>
          <span>项目模式：</span>
          <OverflowTooltip class="basic-info">BASIC模式</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 24">
        <div>
          <span>创建人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.create_time}}</OverflowTooltip>
        </div>
        <div>
          <span>用途：</span>
          <OverflowTooltip class="basic-info">仅离线</OverflowTooltip>
        </div>
        <div>
          <span>环境：</span>
          <OverflowTooltip class="basic-info">生产环境</OverflowTooltip>
        </div>
        <div>
          <span>存储类型：</span>
          <OverflowTooltip class="basic-info">OSS</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 25">
        <div>
          <span>创建人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.create_time}}</OverflowTooltip>
        </div>
        <div>
          <span>所属分组：</span>
          <OverflowTooltip class="basic-info">unit_grp</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 26">
        <div>
          <span>原子指标：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.atomic_name}}</OverflowTooltip>
        </div>
        <div>
          <span>统计周期：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.cycle_name}}</OverflowTooltip>
        </div>
        <div>
          <span>业务限定：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.condition_name}}</OverflowTooltip>
        </div>
        <div>
          <span>统计粒度：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.dim_name}}</OverflowTooltip>
        </div>
        <div>
          <span>汇总逻辑表：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.sum_name}}</OverflowTooltip>
        </div>
        <!-- <div>
          <span>业务负责人：</span>
          <OverflowTooltip class="basic-info">test_001</OverflowTooltip>
        </div>
        <div>
          <span>创建人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div> -->
        <div>
          <span>所属项目：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.project_name}}</OverflowTooltip>
        </div>
        <div>
          <span>操作人：</span>
          <OverflowTooltip class="basic-info">{{asset_basic_data.oper_user}}</OverflowTooltip>
        </div>
        <!-- <div>
          <span>指标类型：</span>
          <OverflowTooltip class="basic-info">自动化编码</OverflowTooltip>
        </div> -->
      </template>
      <template v-else>
        <div>
          <span>环境：</span>
          <OverflowTooltip class="basic-info">生成环境</OverflowTooltip>
        </div>
        <div>
          <span>创建时间：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.create_time}}</OverflowTooltip>
        </div>
        <div>
          <span>项目：</span>
          <OverflowTooltip class="basic-info">v32_ul_automatic</OverflowTooltip>
        </div>
        <div>
          <span>创建人：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.oper_user}}</OverflowTooltip>
        </div>
        <div>
          <span>表类型：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.object_type | turnTableType}}</OverflowTooltip>
        </div>
        <div>
          <span>产出任务：</span>
          <el-button type="text">查看代码</el-button>
        </div>
      </template>
    </div>

    <div class="basic" v-if="tableInfo.object_type == 26">
      <!-- <h4 class="">计算逻辑</h4>
      <div>
        <span>计算逻辑：</span>
        <OverflowTooltip class="basic-info">--</OverflowTooltip>
      </div>
      <div>
        <span>数据类型：</span>
        <OverflowTooltip class="basic-info">bigint</OverflowTooltip>
      </div>
      <div>
        <span>度量单位：</span>
        <OverflowTooltip class="basic-info">其他</OverflowTooltip>
      </div>
      <div>
        <span>是否物化：</span>
        <OverflowTooltip class="basic-info">是</OverflowTooltip>
      </div> -->
    </div>

    <div class="basic" v-if="[100, 16, 19, 20, 21].includes(tableInfo.object_type)">
      <h4 class="">物理信息</h4>
      <template v-if="tableInfo.object_type == 100 || tableInfo.object_type === 16">
        <div>
          <span>存储量：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.storage_num}} B</OverflowTooltip>
        </div>
        <div>
          <span>生命周期：</span>
          <OverflowTooltip class="basic-info">360 天</OverflowTooltip>
        </div>
      </template>

      <template v-if="[19, 21].includes(tableInfo.object_type)">
        <div>
          <span>数据源：</span>
          <OverflowTooltip class="basic-info">test_crc_datahub</OverflowTooltip>
        </div>
        <div>
          <span>来源表：</span>
          <OverflowTooltip class="basic-info">test</OverflowTooltip>
        </div>
        <div>
          <span>存储类型：</span>
          <OverflowTooltip class="basic-info">test</OverflowTooltip>
        </div>
      </template>

      <template v-if="tableInfo.object_type === 20">
        <div>
          <span>关联离线表：</span>
          <OverflowTooltip class="basic-info">datahub_batch_read</OverflowTooltip>
        </div>
        <div>
          <span>关联实时表：</span>
          <OverflowTooltip class="basic-info">datahub_stream_read</OverflowTooltip>
        </div>
      </template>
    </div>

    <div class="basic" v-if="[100, 16, 19, 20, 21, 22, 24, 25].includes(tableInfo.object_type)">
      <h4 class="">使用信息</h4>
      <template v-if=" tableInfo.object_type===22">
        <div>
          <span>最近30天使用次数：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
      </template>
      <template v-else-if=" tableInfo.object_type===24">
        <div>
          <span>读取任务：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
        <div>
          <span>写入任务：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
      </template>
      <template v-else-if=" tableInfo.object_type===25">
        <div>
          <span>应用数：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
        <div>
          <span>调用次数：</span>
          <OverflowTooltip class="basic-info">0</OverflowTooltip>
        </div>
      </template>
      <template v-else>
        <div>
          <span>收藏次数：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.collect_num}}</OverflowTooltip>
        </div>
        <div>
          <span>读取次数：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.read_num}}</OverflowTooltip>
        </div>
      </template>
    </div>

    <div class="basic" v-if="[100, 16, 19, 20, 21, 22, 24, 25].includes(tableInfo.object_type)">
      <h4 class="">变更信息</h4>
      <template v-if="tableInfo.object_type === 22">
        <div>
          <span>函数最近更新时间：</span>
          <OverflowTooltip class="basic-info">2021-12-01 11:47:22</OverflowTooltip>
        </div>
        <div>
          <span>函数最近使用时间：</span>
          <OverflowTooltip class="basic-info">--</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 24">
        <div>
          <span>更新时间：</span>
          <OverflowTooltip class="basic-info">2021-12-01 11:47:22</OverflowTooltip>
        </div>
      </template>
      <template v-else-if="tableInfo.object_type === 25">
        <div>
          <span>更新频率：</span>
          <OverflowTooltip class="basic-info">每天</OverflowTooltip>
        </div>
        <div>
          <span>数据更新时间：</span>
          <OverflowTooltip class="basic-info">2021-12-01 11:47:22</OverflowTooltip>
        </div>
        <div>
          <span>最近发布时间：</span>
          <OverflowTooltip class="basic-info">2021-12-01 11:47:22</OverflowTooltip>
        </div>
      </template>
      <template v-else>
        <div>
          <span>DDL变更：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.ddl_change}}</OverflowTooltip>
        </div>
        <div>
          <span>数据变更：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.updata_data}}</OverflowTooltip>
        </div>
        <div>
          <span>最近访问：</span>
          <OverflowTooltip class="basic-info">{{tableInfo.lately_visit}}</OverflowTooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'asset-info',
  props: {
    tableInfo: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['asset_basic_data'])
  },
  filters: {
    turnTableType (v) {
      let a = {
        100: '物理表',
        11: '物理表',
        50: '物理表',
        10: '维度逻辑表',
        16: '维度逻辑表',
        17: '事实逻辑表',
        18: '汇总逻辑表',
        19: '元表',
        20: '镜像表',
        21: '字段',
        22: '函数',
        23: '项目',
        24: '数据源',
        25: '数据服务',
        26: '指标'
      }
      return a[v]
    }
  }
}
</script>
<style lang="scss">
.info-detail {
  background: $grey10;
  height: 100%;
  padding: 20px;
  .basic {
    padding: 0 10px;
    margin-top: 20px;
    > div {
      margin: 10px 10px;
      font-size: 12px;
      span:first-child {
        color: $grey4;
        text-align: end;
      }
    }
    .basic-info {
      width: calc(100% - 120px);
    }
  }
}
</style>

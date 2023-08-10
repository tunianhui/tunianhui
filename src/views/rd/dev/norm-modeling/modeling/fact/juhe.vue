<template>
	<el-dialog
		title="聚合"
		:visible="visible"
		@close="close"
		width="55%"
		top="8vh"
		class="new-field-juhe"
		ref="dialog"
		v-loading="loading"
  >
		<div style="display: flex;  height: 40px; align-items: center;">
			<span>是否开启：</span>
			<el-switch
				style="display: block"
				v-model="value"
				active-color="#13ce66"
				inactive-color="#ff4949"
				active-value="1"
				inactive-value="0"
				active-text="关"
  			inactive-text="开">
			</el-switch>
		</div>
		
		<el-table
      :data="tableData"
      style="width: 100%">
			<el-table-column
				:show-overflow-tooltip="true"
        prop="element_name"
        label="合并后名称">
				<template #default="scope">
					{{scope.row.col_func ? `${scope.row.col_func}(${scope.row.sql_context})` : scope.row.sql_context}}
				</template>
      </el-table-column>
      <el-table-column
        prop="col_func"
        label="函数">
				<template #default="scope">
					<el-select v-model="scope.row.col_func" placeholder="请选择" clearable>
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</template>
      </el-table-column>
      <el-table-column
        prop="sql_context"
        label="计算属性">
				<template #default="scope">
					<el-input v-model="scope.row.sql_context" placeholder="请输入计算属性"></el-input>
				</template>
      </el-table-column>
      <el-table-column
				:show-overflow-tooltip="true"
        prop="alias_element_code"
        label="字段名称">
      </el-table-column>
    </el-table>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
	</el-dialog>
</template>

<script>
import {
	getMeasureInfo,
	saveAggregationOper
} from '@/api/rd/fact-table'
export default {
	name: 'JuHe',
	props: {
		fact_logic_id: String
	},
	data() {
		return {
			value: false,
			visible: true,
			loading: false,
			tableData: [],
			options: [
				{
					label: 'sum',
					value: 'sum'
				},
				{
					label: 'count',
					value: 'count'
				},
				{
					label: 'max',
					value: 'max'
				},
				{
					label: 'min',
					value: 'min'
				},
				{
					label: 'avg',
					value: 'avg'
				}
			]
		}
	},
	mounted() {
		this._getMeasureInfo()
	},
	methods: {
		close() {
			this.$emit('close')
		},
		async _getMeasureInfo() {
			this.loading = true
			const res = await this.$simpleAsyncTo(getMeasureInfo({
				fact_logic_id: this.fact_logic_id
			}), '数据获取失败')
			if (res) {
				this.tableData = res.data.measures
				this.value = res.data.group_tag
			}
			this.loading = false
		},
		async submit() {
			const res = await this.$simpleAsyncTo(saveAggregationOper({
				measure: JSON.stringify(this.tableData),
				group_tag: this.value,
				fact_logic_id: this.fact_logic_id
			}), '保存失败')
			if (res) {
				this.$message({
          type: 'success',
          message: res.msg || '保存成功'
        })
				this.close()
			}
		}
	}
}
</script>

<style lang="scss">
.new-field-juhe {
	.el-switch__label--right {
		position: absolute;
    margin-left: 0;
    right: 6px;
    margin-top: 1px;
    color: #fff;
		font-size: 12px;
		&.is-active {
			display: none;
		}
	}
	.el-switch__label--left {
		position: absolute;
		margin-left: 0;
		left: 6px;
		z-index: 9;
		color: #fff;
		font-size: 12px;
		margin-top: 1px;
		&.is-active {
			display: none;
		}
	}
}
</style>
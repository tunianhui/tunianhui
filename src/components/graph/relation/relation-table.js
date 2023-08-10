import OverflowTooltip from '@c/overflow-tooltip'

export default {
  name: 'RelationTable',
  props: {
    data: {
      type: Array,
      default: _ => []
    },
    active: Object,
    placement: String,
    value: Number
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      prefix: 'relation-table',
      keyword: '',
      suggestionList: [],
      activeNode: {}
    }
  },
  render(h) {
    return this.data.length > 0 ? (
      <div class={`${this.prefix} ${this.prefix}-${this.placement}`}>
        <div class={`${this.prefix}-head`}>
          <el-autocomplete
            v-model={this.keyword}
            prefix-icon="el-icon-search"
            fetch-suggestions={this.filterSuggestionList}
            placeholder="搜索表名"
            trigger-on-focus={false}
            on-select={this.handleSelect}
          />
        </div>
        <div class={`${this.prefix}-body`}>
          <i
            class="el-icon-arrow-up"
            v-show={this.value !== 0 && this.data.length > 1}
            on-click={this.handlePrev}
          />
          <i
            class="el-icon-arrow-down"
            v-show={this.value !== this.data.length - 1 && this.data.length > 1}
            on-click={this.handleNext}
          />
          <div class="relation-table-list">{this.renderRelationTable(h)}</div>
        </div>
      </div>
    ) : null
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        val && val.length && this.getSuggestionList()
      }
    }
  },
  methods: {
    renderRelationTable(h) {
      return this.data.length && this.data[this.value].length
        ? this.data[this.value].map(item =>
          item.modelType === 4
            ? this.renderPhysicalTableNode(h, item)
            : this.renderLogicTableNode(h, item)
        )
        : null
    },
    renderPhysicalTableNode(h, data) {
      return (
        <div
          class="node-group node-physical"
          on-click={_ => this.handleClickTable(data)}
        >
          <div
            class={[
              'node',
              { 'is-active': this.isActive(data) }
            ]}
          >
            {this.placement === 'right' && (
              <i class="prefix-physical prefix-physical-big" />
            )}

            <OverflowTooltip>
              <span class="node-name">{data.tableName}</span>
            </OverflowTooltip>

            {this.placement === 'left' && (
              <i class="prefix-physical prefix-physical-big" />
            )}
          </div>
        </div>
      )
    },
    renderLogicTableNode(h, data) {
      return (
        <dl class="node-group node-logic">
          <dt>
            <OverflowTooltip>
              <span class="node-name">{data.tableName}</span>
            </OverflowTooltip>
            <span>（{data.count}字段）</span>
          </dt>
          {this.renderColumns(h, data)}
        </dl>
      )
    },
    renderColumns(h, data) {
      return data.columnNameList.map(item => (
        <dd
          class={['node', { 'is-active': this.isActive(data) }]}
          on-click={_ => this.handleClickCloumn(item, data)}
        >
          {this.placement === 'right' && (
            <i class="prefix-column prefix-column-big" />
          )}

          <OverflowTooltip popper-class="dark-popper">
            <span class="node-name">{item}</span>
          </OverflowTooltip>

          {this.placement === 'left' && (
            <i class="prefix-column prefix-column-big" />
          )}
        </dd>
      ))
    },
    isActive(node) {
      return this.active && this.active.modelId === node.modelId
    },
    handlePrev() {
      const value = Math.min(this.value - 1, this.data.length - 1)
      this.changeValue(value)
    },
    handleNext() {
      const value = Math.min(this.value + 1, this.data.length - 1)
      this.changeValue(value)
    },
    changeValue(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    getSuggestionList() {
      this.suggestionList = []
      this.data.forEach((page, pageNo) => {
        page.forEach(list => {
          if (list.modelType === 4) {
            this.suggestionList.push({
              value: list.tableName,
              pageNo,
              ...list
            })
          } else {
            list.columnNameList.forEach(item => {
              this.suggestionList.push({
                value: item,
                pageNo,
                ...list
              })
            })
          }
        })
      })
    },
    filterSuggestionList(val, cb) {
      const results = val
        ? this.suggestionList.filter(
          item => item.value.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
        : this.suggestionList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect(val) {
      this.activeNode = val
      this.changeValue(val.pageNo)
      this.nodeClick()
    },
    handleClickTable(table) {
      this.activeNode = {
        value: table.tableName,
        pageNo: this.value,
        ...table
      }
      this.nodeClick()
    },
    handleClickCloumn(column, table) {
      this.activeNode = {
        value: column,
        pageNo: this.value,
        ...table
      }
      this.nodeClick()
    },
    nodeClick() {
      this.$emit('node-click', {
        node: this.activeNode,
        page: this.data,
        pageNo: this.value
      })
    }
  }
}

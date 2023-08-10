<template>
  <section class="physical-config">
    <SimpleHead name="物理化配置"></SimpleHead>
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-width="150px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item
        label="存储生命周期(天)"
        prop="cycle_day"
        class="custom-item"
      >
        <el-input-number
          v-model.number="filter.cycle_day"
          class="fl"
          @change="cycleDayChange"
        ></el-input-number>
        <div class="fl custom-radio">
          <span>快速选择&nbsp;&nbsp;</span>
          <el-radio-group v-model="cycle_day" @change="cycleDayRadioChange">
            <el-radio-button
              v-for="item in cycleDayList"
              :key="item"
              :label="item"
              >{{ item }}</el-radio-button
            >
          </el-radio-group>
        </div>
      </el-form-item>
      <!-- <el-form-item label="选择分区字段" prop="physics_element">
        <el-select
          v-model="filter.physics_element"
          multiple
          filterable
          @change="changeField"
          @focus="visibleSortPanel = false"
        >
          <el-option
            v-for="(field, index) in curElementList.filter(item => item.visible)"
            :key="field.value + index"
            :label="field.label"
            :value="field.value"
          ></el-option>
        </el-select>
        <el-popover
          width="280"
          placement="bottom-end"
          :visible-arrow="false"
          popper-class="sortable-panel"
          v-model="visibleSortPanel"
        >
          <div class="sortable-wrapper">
            <p>分区字段排序（由上至下）</p>
            <ul class="sortable-body" ref="sortPanel">
              <li
                v-for="(item, index) in sortList"
                :key="item.value + index"
                :data-value="item.value"
                draggable
                @dragover.stop="dragover"
                @dragstart.stop="dragstart"
                @dragend.stop="dragend"
              >{{item.label}}</li>
            </ul>
            <el-button type="primary" plain @click="sortHandle">确定</el-button>
          </div>
          <el-button icon="el-icon-sort" slot="reference"></el-button>
        </el-popover>
      </el-form-item>-->
      <el-form-item label="计算逻辑" prop="exec_engine">
        <el-select
          v-model="filter.exec_engine"
          placeholder="请选择计算逻辑"
          filterable
        >
          <el-option
            v-for="field in dics.exec_engine"
            :key="field.value"
            :label="field.value"
            :value="field.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="无需物理化字段" prop="no_physics_element">
        <el-select
          v-model="filter.no_physics_element"
          multiple
          filterable
          @change="changeNoPhysicsElement"
        >
          <el-option
            v-for="(field, index) in noPhysicsElementList.filter(
              item => item.visible
            )"
            :key="field.value + index"
            :label="field.label"
            :value="field.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {insertAfter, addClass, removeClass, getData} from '@/libs/dom'
export default {
  name: 'PhysicalConfig',
  props: {
    fieldList: Array,
    data: Object
  },
  data() {
    return {
      filter: {
        cycle_day: 30,
        // physics_element: [],
        no_physics_element: [],
        exec_engine: '0'
      },
      rules: {
        cycle_day: {required: true, type: 'number', message: '必填项'},
        exec_engine: {required: true, message: '请选择计算逻辑'}
        // physics_element: {required: true, type: 'array', message: '必填项'}
      },
      cycle_day: 30,
      visibleSortPanel: false,
      cycleDayList: [7, 14, 30, 365],
      curElementList: [],
      noPhysicsElementList: [],
      sortList: [],
      prevPhysicsElement: []
    }
  },
  watch: {
    fieldList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        this.processFieldList(val)
      }
    },
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        const {
          cycle_day = 30,
          exec_engine = '0',
          no_physics_element = [],
          physics_element = [
            // this.curElementList.find(item => item.isPrimaryKey).value
          ]
        } = val
        this.filter.cycle_day = cycle_day
        this.cycle_day = cycle_day
        this.filter.physics_element = physics_element
        this.filter.exec_engine = exec_engine
        this.prevPhysicsElement = physics_element
        this.filter.no_physics_element = no_physics_element.map(
          item => item.element_id + ''
        )
      }
    }
  },
  methods: {
    processFieldList(data) {
      this.curElementList = []
      this.noPhysicsElementList = []
      // data.forEach(item => {
      // })
    },
    cycleDayChange(val) {
      if (!val) {
        this.filter.cycle_day = 0
      }
      this.cycle_day = val
    },
    cycleDayRadioChange(val) {
      this.filter.cycle_day = val
    },
    getData() {
      let data = false
      this.$refs.form.validate(valid => {
        if (valid) {
          const {cycle_day, no_physics_element, exec_engine} = this.filter
          data = {
            cycle_day,
            exec_engine,
            no_physics_element: no_physics_element.join('@'),
            id: this.data.id
          }
        }
      })
      return data
    },
    changeField(val) {
      if (val.length < this.prevPhysicsElement.length) {
        const flag = this.prevPhysicsElement.some(item => {
          if (!val.includes(item)) {
            const obj = this.curElementList.find(o => o.value === item)
            if (obj.isPrimaryKey) {
              this.$message({
                showClose: true,
                message: '系统字段，不可删除！',
                type: 'error'
              })
              this.filter.physics_element = this.prevPhysicsElement
              return true
            }
          }
        })
        if (flag) return
      }
      this.prevPhysicsElement = val
      this.noPhysicsElementList.forEach(item => {
        item.visible = !val.includes(item.value)
      })
      this.sortList = this.curElementList.filter(item =>
        val.includes(item.value)
      )
    },
    changeNoPhysicsElement(val) {
      this.curElementList.forEach(item => {
        item.visible = !val.includes(item.value)
      })
    },
    dragstart(event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      try {
        // setData is required for draggable to work in FireFox
        event.dataTransfer.setData('text/plain', '')
      } catch (e) {}
      this.draggingNode = event.target
      addClass(this.draggingNode, 'dragging')
    },
    dragend(event) {
      removeClass(this.draggingNode, 'dragging')
      this.draggingNode = null
    },
    dragover(event) {
      event.preventDefault()
      const dragoverNode = event.target,
        curNodePos = dragoverNode.getBoundingClientRect()
      if (dragoverNode === this.draggingNode) return
      const container = this.$refs.sortPanel
      if (curNodePos.top + curNodePos.height * 0.5 > event.clientY) {
        if (dragoverNode.previousSibling !== this.draggingNode) {
          container.removeChild(this.draggingNode)
          container.insertBefore(this.draggingNode, dragoverNode)
        }
      } else {
        if (dragoverNode.nextSibling !== this.draggingNode) {
          container.removeChild(this.draggingNode)
          insertAfter(this.draggingNode, dragoverNode)
        }
      }
    },
    sortHandle() {
      const list = []
      ;[].slice.call(this.$refs.sortPanel.children).forEach(item => {
        list.push(getData(item, 'value'))
      })
      this.filter.physics_element = list
      this.visibleSortPanel = false
    }
  }
}
</script>

<style lang="scss">
.physical-config {
  .custom-item {
    .custom-radio {
      margin-left: 25px;
      > span {
        color: $grey3;
      }
    }
  }
  .el-select {
    width: calc(100% - 50px);
    margin-right: 5px;
  }
}
.sortable-panel {
  p {
    font-size: 12px;
    color: $grey2;
  }
  ul.sortable-body {
    margin: 10px 0;

    li {
      background-color: $grey7;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      color: $grey2;
      cursor: pointer;
      user-select: none;
      transition: all 0.1s ease-in-out;
      &:not(:last-child) {
        margin-bottom: 10px;
      }

      &.dragging {
        transform: scale(1.05);
        box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
  .el-button {
    width: 100%;
  }
}
</style>

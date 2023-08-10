<template>
  <el-dialog
    :title="`${rowData.element_code} 血缘关系`"
    :visible.sync="bloodVisible"
    width="50%"
    :close-on-click-modal="false"
    class="blood-class"
    @close="close"
  >
  <!-- {{rowData}} -->
    <Relaltion :data="data" class="relation-graph"></Relaltion>
  </el-dialog>
</template>

<script>
import Relaltion from '@c/graph/relation'
import {mapGetters} from 'vuex'
export default {
  name: 'BloodRelDialog',
  components: {
    Relaltion
  },
  props: {
    rowData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  data() {
    return {
      bloodVisible: true,
      is_filter_table: '1',
      data: {
        id: ''
      }
    }
  },
  created() {
    this.data.id = this.cube_id
  },
  methods: {
    close() {
      this.$emit('close', 'blood')
    }
  }
}
</script>

<style lang="scss">
.blood-class {
  .el-dialog__body {
    min-height: 600px;
    .field,
    .wuli,
    .logic {
      position: relative;
      padding: 0 15px;
      font-size: 12px;
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: $warning;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -5px;
      }
    }
    .relation-graph {
      height: 500px;
    }
    .relation {
      height: calc(100% - 20px);
      .img {
        width: 100%;
        height: calc(100% - 20px);
        text-align: center;
        img {
          margin-top: 150px;
        }
        span {
          display: block;
          font-size: 14px;
        }
      }
    }
    .wuli::after {
      border-radius: 0;
      background: $editorLightSelectionBg;
    }
    .logic::after {
      width: 8px;
      height: 8px;
      border-radius: 3px;
      background: none;
      margin-top: -6px;
      border: 2px solid $warning;
    }
  }
}
</style>

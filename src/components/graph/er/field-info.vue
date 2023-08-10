<template>
  <section class="field-info">
    <p>
      <span class="label">字段英文名：</span>
      <span class="value">{{filter.element_code}}</span>
    </p>
    <p>
      <span class="label">字段名称：</span>
      <span class="value">{{filter.element_name}}</span>
    </p>
    <p>
      <span class="label">描述：</span>
      <span class="value">{{filter.comment}}</span>
    </p>
    <p>
      <span class="label">数据类型：</span>
      <span class="value">{{(filter.element_type || '').toUpperCase()}}</span>
    </p>
    <p>
      <span class="label">默认值：</span>
      <span class="value">{{filter.default}}</span>
    </p>
    <p>
      <span class="label">更新人/时间：</span>
      <span class="value">{{getValue(filter.oper_user, filter.update_time)}}</span>
    </p>
    <p>
      <span class="label">创建人/时间：</span>
      <span class="value">{{getValue(filter.oper_user, filter.oper_time)}}</span>
    </p>
  </section>
</template>

<script>
export default {
  name: 'FieldInfo1',
  props: {
    data: Object
  },
  data() {
    return {
      filter: {
        element_code: '',
        element_name: '',
        comment: '',
        element_type: 'string',
        default: '',
        update_person: '',
        update_time: '',
        create_person: '',
        create_time: ''
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        Object.assign(this.filter, val)
      }
    }
  },
  methods: {
    getValue(val1, val2) {
      if (val1 && val2) {
        return val1 + '/' + val2
      }
      return '未找到'
    }
  }
}
</script>

<style lang="scss">
.field-info {
  padding-bottom: 15px;
  p {
    height: 40px;
    line-height: 40px;
    display: flex;
  }
  .label {
    color: $grey4;
    width: 105px;
    text-align: right;
  }
  .value {
    color: $grey3;
    flex: 1;
  }
}
</style>

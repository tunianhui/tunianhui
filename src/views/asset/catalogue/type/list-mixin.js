export default {
  name: 'listMixin',
  props: {},
  components: {},
  data() {
    return {
      dataBaseList: [],
      row: {},
      visibleModify: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    searchBtn() {
      this.getTableList()
    },
    editHandle(row) {
      this.row = row
      this.visibleModify = true
    },
    closeModify() {
      this.visibleModify = false
    },
    refresh() {
      this.visibleModify = false
      this.getTableList()
    }
  }
}

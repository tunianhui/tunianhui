import {getMetaCubes, getMetaBusinessProcess} from '@/api/rd/dev'
import {mapGetters} from 'vuex'
// import {detailTypeList} from '@/config/dics'

export default {
  data() {
    return {
      processList: [],
      cubeList: [],
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        data_field_id: '',
        process_id: '',
        // detail_type: '',
        logic_fact_code: '',
        logic_fact_name: '',
        logic_fact_desc: '',
        cube_id: '',
        cube_code: '',
        is_define_key: '1',
        pk_code: '',
        pk_name: '',
        pk_type: '',
        sql_content: '',
        part_type: '1',
        part_ds: '',
        part_hour: '',
        part_hour_delay: '0'
      },
      rules: {
        data_field_id: [{required: true, message: '必填项'}],
        process_id: [{required: true, message: '必填项'}],
        // detail_type: [{required: true, message: '必填项'}],
        logic_fact_code: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        logic_fact_name: [{required: true, message: '必填项'}],
        cube_id: [{required: true, message: '必填项'}],
        cube_code: [{required: true, message: '必填项'}],
        pk_code: [
          {required: true, message: '必填项'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        pk_name: [{required: true, message: '必填项'}],
        pk_type: [{required: true, message: '必填项'}],
        pk_logic: [{required: true, message: '必填项'}]
      },
      logic_fact_code_prefix: 'dwd_'
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  mounted() {
    this.getMetaCubes()
    this.getMetaBusinessProcess()
  },
  methods: {
    changeMetadata(val) {
      const obj = this.metadata.find(item => item.data_field_id === val)
      Object.assign(this.filter, obj)
      const {data_field_code} = this.filter
      this.logic_fact_code_prefix = data_field_code
        ? `dwd_${data_field_code}_`
        : 'dwd_'
    },
    changeProcess(val) {
      const obj = this.processList.find(item => item.process_id === val)
      Object.assign(this.filter, obj)
      
    },
    changeCube(val) {
      const obj = this.cubeList.find(item => item.cube_id === val)
      Object.assign(this.filter, obj)
    },
    async getMetaCubes() {
      const res = await this.$simpleAsyncTo(getMetaCubes({project_id: this.project.project_id}), '获取来源主表失败')
      if (res) {
        this.cubeList = res.data
      }
    },
    async getMetaBusinessProcess() {
      const res = await this.$simpleAsyncTo(
        getMetaBusinessProcess(
          {
            business_field_id: this.project.business_field_id,
            project_id: this.project.project_id
          }
        ),
        '获取业务过程失败'
      )
      if (res) {
        this.processList = res.data
      }
    }
  }
}

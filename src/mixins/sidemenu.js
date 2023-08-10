import {mapGetters, mapMutations, mapActions} from 'vuex'
import storage from '@/libs/storage'

export default {
  data() {
    return {
      activeProject: '',
      visibleDialog: false,
      projectForm: {
        project: ''
      },
      rules: {
        project: {required: true, message: '请选择一个项目'}
      }
    }
  },
  computed: {
    ...mapGetters(['side_menu', 'projectList', 'project'])
  },
  watch: {
    project: {
      immediate: true,
      handler (val, oldVal) {
        // if (this.$route.path.indexOf('server') > -1) return
        if (this.$route.path.indexOf('standard') > -1) return
        if (!val.project_id || !oldVal) {
          const data = storage.get('project')
          if (data) {
            this.setProject(data)
          } else {
            this.visibleDialog = true
            // 重新进入欢迎页
            this.tabStore &&
              this.tabStore.states &&
              this.tabStore.states.list.length &&
              this.tabStore.commit('clear')
          }
        }
      }
    }
  },
  created() {
    // console.log(this.$route.path)
    if (this.$route.path.indexOf('standard') === -1) {
      this.getProjectList()
      if (this.$route.params.project_id) {
        this._setProject(this.$route.params.project_id)
        this.activeProject = this.$route.params.project_id
      } else {
        this.activeProject = this.project.project_id
      }
    }
  },
  methods: {
    ...mapMutations({
      setProject: 'SET_PROJECT'
    }),
    ...mapActions(['getProjectList', 'getMetadata']),
    _setProject(id) {
      const {
        business_field_name,
        business_field_id,
        project_name,
        space_type_id,
        space_type_name,
        project_code,
        skd_prj_id
      } = this.projectList.find(item => item.project_id === id) || {}
      // this.setProject(project)
      this.setProject({
        project_id: id,
        project_name,
        business_field_name,
        business_field_id,
        space_type_id,
        space_type_name,
        project_code,
        skd_prj_id
      })
      this.getMetadata()
    },
    selectProject() {
      this.$refs.projectForm.validate(valid => {
        this.visibleDialog = !valid
        if (valid) {
          const project = this.projectForm.project
          this._setProject(project)
          this.activeProject = project
        }
      })
    }
  }
}

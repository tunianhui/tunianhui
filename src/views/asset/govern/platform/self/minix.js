
export default {
    name: 'minix',
    data() {
        return {
            yarnTaskData: '',
            isFullVal: false,
        }
    },
    methods: {
        isFullfunc(val) {
          this.isFullVal = val
        },
    }
}
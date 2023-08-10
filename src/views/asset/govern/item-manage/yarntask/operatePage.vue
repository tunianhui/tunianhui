<template>
    <section class="operate_Page">
        <el-page-header @back="goBack" content="Executors日志">
        </el-page-header>
        <div id="tableEditor">
            <textarea :style="{height: getheight + 'px'}"  id="tableEditorContainer"  readonly v-model="getSparkData"></textarea>
        </div>
    </section>
</template>

<script>
export default {
    name: 'operatePage',
    props: {
        getSparkData:{
            type: String,
            default: '',
        },
        getheight: Number,
    },
    data() {
        return {
            editor: {}
        }
    },
    watch: {
        getSparkData: {
            immediate: true,
            handler(val) {
            }
        }
    },
    mounted() {
        this.$nextTick(_ => {
          this.initEditor()  
        })
    },
    methods: {
        goBack() {
            this.$emit('back')
        },
        initEditor() {
            const tmp = document.getElementById('tableEditorContainer').value
            const lines = tmp.split(/\r*\n/);
            const linesCount = lines.length - (navigator.userAgent.indexOf('MSIE') !== -1);
        },
    }

}
</script>
<style lang="less" scoped>
.el-page-header__content{
    font-size: 16px;
}
textarea{
    width: 99%;
    // height: 800px; 
    resize: none;
    background-color: #F8F8FA;
    border: 1px solid #F8F8FA;
    overflow: auto;
}
</style>
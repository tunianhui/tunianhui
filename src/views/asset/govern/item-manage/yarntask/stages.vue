<template>
    <section>
      <el-table :data="data" stripe style="width: 100%" border @row-click="rowClick">
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
          <!-- <el-table-column prop="applicationId" label="spark应用程序id" min-width="204px"></el-table-column> -->
          <el-table-column prop="stageId" label="stage id" min-width="69px"></el-table-column>
          <el-table-column prop="completedTasksNum" label="已完成的任务数" min-width="111px"></el-table-column>
          <el-table-column prop="failedTasksNum" label="失败的任务数" min-width="100px"></el-table-column>
          <el-table-column prop="executorRunTime" label="Executor执行时间(单位毫秒)" min-width="180px"></el-table-column>
          <el-table-column prop="inputRecords" label="输入条数" min-width="70px"></el-table-column>
          <el-table-column prop="outputBytes" label="输出字节数" min-width="85px"></el-table-column>
          <el-table-column prop="outputRecords" label="输出条数" min-width="70px"></el-table-column>
          <el-table-column prop="shuffleReadBytes" label="Shuff读取字节数" min-width="115px"></el-table-column>
          <el-table-column prop="shuffleReadRecords" label="Shuffle读取条数" min-width="110px"></el-table-column>
          <el-table-column prop="shuffleWriteBytes" label="Shuff写入字节数" min-width="115px"></el-table-column>
          <el-table-column prop="shuffleWriteRecords" label="Shuffle写入条数" min-width="110px"></el-table-column>
          <el-table-column prop="memoryBytesSpilled" label="Shuffle溢写内存字节数" min-width="150px"></el-table-column>
          <el-table-column prop="diskBytesSpilled" label="Shuffle溢写磁盘字节数" min-width="150px"></el-table-column>
          <el-table-column prop="name" label="stage名称" min-width="80px" :width="flexColumnWidth('name', data)"></el-table-column>
          <el-table-column prop="details" label="stagte描述" min-width="200">
            <template slot-scope="{row}">
                <el-popover
                placement="bottom"
                trigger="hover"
                popper-class="workorde-remark">
                <div>{{ row.details }}</div>
                <span slot="reference">{{ row.details.substr(0,25) + '...'  }}</span>
                </el-popover>
            </template>
            
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width=""></el-table-column>
          <el-table-column prop="submissionTime" label="提交时间" min-width="150px"></el-table-column>
          <el-table-column prop="firstTasklaunchedTime" label="第一个任务启动时间" min-width="160px"></el-table-column>
          <el-table-column prop="completionTime" label="完成时间" min-width="150px"></el-table-column>
      </el-table>
    </section>
  </template>
  
  <script>
  export default {
      name: 'stages',
      props: {
          data: Array,
      },
      methods: {
        flexColumnWidth(str, tableData, flag = 'max') {
            // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
            // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
            // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
            str = str + ''
            let columnContent = ''
            if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
                return
            }
            if (!str || !str.length || str.length === 0 || str === undefined) {
                return
            }
            // 获取该列中最长的数据(内容)
            let index = 0
            for (let i = 0; i < tableData.length; i++) {
            if (tableData[i][str] === null) {
                return
            }
            const now_temp = tableData[i][str] + ''
            const max_temp = tableData[index][str] + ''
            if (now_temp.length > max_temp.length) {
                index = i
            }
            }
            columnContent = tableData[index][str]
            // 以下分配的单位长度可根据实际需求进行调整
            let flexWidth = 0
            for (const char of columnContent) {
                if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                // 如果是英文字符，为字符分配8个单位宽度
                flexWidth += 8
                } else if (char >= '\u4e00' && char <= '\u9fa5') {
                // 如果是中文字符，为字符分配15个单位宽度
                flexWidth += 15
                } else {
                // 其他种类字符，为字符分配8个单位宽度
                flexWidth += 7
                }
            }
            return flexWidth + 'px'
        },
        rowClick(val) {
            this.$emit('sendClick', val)
        }
      }
  }
  </script>
  
  <style>

.workorde-remark{
    max-width: 50%;
    background-color: black;
    color: white;
    border-color: #000;
}
  </style>
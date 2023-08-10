<template>
  <section>
    <el-table :data="data" stripe style="width: 100%" border height="580">
      <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <!-- <el-table-column prop="applicationId" label="spark应用程序id" width="180"></el-table-column> -->
        <el-table-column prop="taskId" label="task id"></el-table-column>
        <el-table-column prop="stageId" label="stage id" width="180"></el-table-column>
        <el-table-column prop="launchTime" label="发送时间" min-width="105px"></el-table-column>
        <el-table-column prop="duration" label="运行时间(毫秒)" min-width="105px"></el-table-column>
        <el-table-column prop="executorId" label="executor id" min-width="86px"></el-table-column>
        <el-table-column prop="host" label="host"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="taskLocality" label="任务本地化级别" min-width="106px"></el-table-column>
        <el-table-column prop="speculative" label="是否是推断执行" min-width="106px"></el-table-column>
        <el-table-column prop="taskMetricsExecutorDeserializeTime" label="Executor反序列化时间(单位毫秒)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsExecutorDeserializeCpuTime" label="Executor cpu反序列化时间(单位毫秒)" min-width="230px"></el-table-column>
        <el-table-column prop="taskMetricsExecutorRunTime" label="executor执行时间(单位毫秒)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsExecutorCpuTime" label="Executor cpu执行时间(单位毫秒)" min-width="210px"></el-table-column>
        <el-table-column prop="taskMetricsResultSize" label="回传driver结果大小(单位字节)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsJvmGcTime" label="Jvm gc时间(单位毫秒)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsResultSerializationTime" label="结果序列化时间(单位毫秒)" min-width="225x"></el-table-column>
        <el-table-column prop="taskMetricsMemoryBytesSpilled" label="内存溢写数(单位字节)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsDiskBytesSpilled" label="磁盘溢写数(单位字节)" min-width="203px"></el-table-column>
        <el-table-column prop="taskMetricsInputMetricsBytesRead" label="读取字节数" min-width="96px"></el-table-column>
        <el-table-column prop="taskMetricsInputMetricsRecordsRead" label="读取记录条数" min-width="95px"></el-table-column>
        <el-table-column prop="taskMetricsOutputMetricsBytesWritten" label="写入字节数" min-width="86px"></el-table-column>
        <el-table-column prop="taskMetricsOutputMetricsRecordsWritten" label="写入记录条数" min-width="95px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsRemoteBlocksFetched" label="Shuffle read远程块读取数" min-width="163px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsLocalBlocksFetched" label="Shuffle read本地块读取数" min-width="163px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsFetchWaitTime" label="Shuffle read拉取等待时间(单位毫秒)" min-width="220px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsRemoteBytesRead" label="Shuffle 远程读取字节数" min-width="153px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsLocalBytesRead" label="Shuffle 本地读取字节数" min-width="153px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleReadMetricsRecordsRead" label="Shuffle 读取记录条数" min-width="140px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleWriteMetricsBytesWritten" label="Shuffle写入字节数" min-width="130px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleWriteMetricsWriteTime" label="Shuffle写入时间(单位毫秒)" min-width="170px"></el-table-column>
        <el-table-column prop="taskMetricsShuffleWriteMetricsRecordsWritten" label="Shuffle写入记录条数" min-width="140px"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
    name: 'tasks',
    props: {
        data: Array,
    }
}
</script>

<style>

</style>
<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-26 14:59:48
 * @LastEditTime: 2023-07-28 09:22:15
 * @Description:
-->

保存和修改这两个用了一个接口，修改把id传进去就行，然后流程

1.新建文件夹，没有改动(可省略)

2.新建业务流程，调用接口/developTask/bf/save，返回当前业务流程的创建信息，打开业务流程总体画布

2.拖动任务节点，新建任务节点，调用接口/developTask/bf/task/save，返回当前任务节点的创建信息，之后不需要打开对应的任务tab，还在总的流程画布显示新增的任务节点就可以 ---->

3.双击任务节点打开tab，配置相应配置项，配置完后再当前tab点击保存，保存当前任务节点配置信息，页面配置项的属性名跟之前相同，所有配置项存储到一个config字段里，json格式

4.创建完任务节点与关系后，在业务流程总体画布上点击保存，调用接口/developTask/ds/save，这个跟之前一样，数据格式不变

5.业务流程编辑只编辑名称和备注以及所属文件夹，双击业务流程节点才打开画布编辑流程信息

6.任务节点的编辑只编辑名称和所属文件夹，双击才打开配置信息tab

数据集成类型：
CHUNJUN

机器学习类型：
K8S
MLFLOW
Pytorch

数据处理类型：
Spark
Flink
HIVECLI

数据库类型：
sql

通用类型：
Shell
SUB_PROCESS
PROCEDURE
PYTHON
DEPENDENT
HTTP
CONDITIONS
SWITCH

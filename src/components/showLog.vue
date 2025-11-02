<template>
  <div class="logdiv">
      <div class="logtitle">
          <!-- 执行日志 -->
          <p>执行日志</p>
      </div>
      <!-- 进度条 -->
      <a-progress :percent="percent" status="active" />
      <!-- 日志 -->
      <div class="logtext" >
          <div v-for="(temp,index) in logtext" :key="'log'+index">
            <p v-if="typeof(logtext[index]) == 'object'" v-for="(content, j) in logtext[index]" :key="'text'+j">{{ content }}</p>
            <p v-else>{{ temp }}</p>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name:"showLog",
  props:{
    percent:{default:0},
    logtext:{
      default:() =>[["2023-08-14 14:50:40,289 [INFO]  Msg: [数据集获取]：获取imagenet数据集正常样本已完成.",
      "2023-08-14 14:50:40,290 [INFO]  Msg: [加载被解释模型]：准备加载被解释模型vgg11",
      "2023-08-14 14:50:50,767 [INFO]  Msg: [加载被解释模型]：被解释模型vgg11已加载完成"],
      ["2023-08-14 14:50:40,289 [INFO]  Msg: [数据集获取]：获取imagenet数据集正常样本已完成.",
      "2023-08-14 14:50:40,290 [INFO]  Msg: [加载被解释模型]：准备加载被解释模型vgg11",
      "2023-08-14 14:50:50,767 [INFO]  Msg: [加载被解释模型]：被解释模型vgg11已加载完成"]]
    }
  },
  data(){
      return{
          j:0,
      }
  }
}
</script>
<style scoped>
.logdiv{
  width: 1200px;
  height: 544px;
  background: #272C35;
  border-radius: 8px;
  margin-left: 360px;
  margin-top: 40px;
}
.logtitle{
  padding: 28px 32px;
  height: 88px;
  background: #191A1E;
  border-radius: 8px 8px 0px 0px;
}
.logtitle p{
  width: 96px;
  font-family: 'Microsoft YaHei';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.ant-progress-bg{
  height: 6px;
  background: #09CAD6;
  border-radius: 0px 3px 3px 0px;
}
.logtext{
  width: 1136px;
  height: 392px;
  font-family: 'Microsoft YaHei';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: left;
  margin: 11px 32px 32px 32px;
  overflow-y: auto;
}
.logtext p{
  margin-bottom: 0px;
}
</style>
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
          <p v-for="(temp,index) in logtext" :key="index">{{ temp }}</p>
      </div>
  </div>
</template>
<script>
export default {
  name:"showLog",
  props:["percent","logtext"],
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
  margin-bottom: 20px;
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
}
.logtext p{
  margin-bottom: 0px;
}
</style>
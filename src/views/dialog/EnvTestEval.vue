<template>
  <div class="dialog">
      <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
      <div class="dialog-cover back"  v-if="isShow" @click="closeMyself"></div>
      <!-- transition 这里可以加一些简单的动画效果 -->
      <transition name="drop">
          <!--style 通过props 控制内容的样式 -->
          <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
              <div class="dialog_head back">
                  <!--弹窗头部 title-->
                  <div class="close_button">
                      <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
                  </div>
                  <slot name="header">
                    <div class="dialog-title"><img src="../../assets/img/envTestIcon.png" style="width: 50px; height: 50px;">开发环境分析及框架适配</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <!-- <p class="result_annotation">当前操作系统架构：{{ result.result.EnvTest.detection_result['System Architecture'] }}，{{ result.result.EnvTest.detection_result['Version Message'] }}</p> -->
                            <p class="result_annotation">漏洞匹配机制：{{ postData.matchmethod }}</p>
                            <!-- <p class="result_annotation">当前系统Cuda版本：{{ result.result.EnvTest.detection_result['Current Cuda Version'] }}</p> -->
                            <p class="result_annotation">适配开发框架：{{ postData.frameworkname}} {{ postData.frameversion }}</p>
                        </div>
                       <div class="echart_title">
                           
                           <div class=" main_top_echarts_con_title ">完整漏洞报告</div>
                           
                       </div>
                       <div id="rdeva">
                           <!-- 图表 -->
                           <div class = 'bugShowDiv'>
                               <pre>{{ res.Risk }}</pre>
                           </div>
                           
                           <div class="conclusion">
                               <p class="result_text">{{ res.cons1 }}</p>
                               <p class="result_text">{{ res.cons2 }}</p>
                           </div>
                       </div>
                   </div>
                   <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                  </slot>
              </div>
          </div>
      </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  name:"envTestDialog",
  components: {
  },
  props: {
    isShow: {
    //弹窗组件是否显示 默认不显示
    type: Boolean,
    default: false,
    required:true, //必须
    },
    result:{},
    postData:{
    }
  },
  data() {
    return {
      htmlTitle:"模型公平性提升报告",
      res:{
        cons1:'',
        cons2:'',
        Risk:null
      }
    }
  },
  created(){
    console.log('EnvTest created:',this.result)
    if ("EnvTest" in this.result){
      this.resultPro()
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('EnvTest:',this.result)
      if ("EnvTest" in newValue){
        this.resultPro()
      }
    }
  },
  methods: {
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
    },
    resultPro(){
      // debugger;
      this.res.Risk =this.result.EnvTest.detection_result.Risk;
      // this.res.Risk=JSON.stringify(JSON.parse(this.res.Risk),null,4);
      if (this.result.EnvTest.detection_result['CVE Amount'] !=0){
          var temp = '编号分别为'+this.result.EnvTest.detection_result['CVE List'].join('、')+'，您可以在 https://cve.mitre.org/cve/search_cve_list.html 查询漏洞详细说明'
          this.res.cons1="1. 当前系统架构为"+this.result.EnvTest.detection_result['System Architecture']+"，共在当前系统环境中检测到"+this.result.EnvTest.detection_result['CVE Amount']+"个潜在的CVE漏洞问题,"+ temp;
      }else{
          var temp = "暂未检测到潜在的CVE漏洞问题";
          this.res.cons1="1. 当前系统架构为"+this.result.EnvTest.detection_result['System Architecture']+"，"+temp;
          this.res.Risk="已对目标环境内"+this.result.EnvTest.detection_result['Number Of Libs']+"个依赖库进行分析比对，暂未检测到潜在的CVE漏洞问题"
      }
      var temp2 = this.result.EnvTest.detection_result['Framework Adaptation Result'].indexOf("Not supported")==-1?'适配成功':'适配失败，请更新Cuda或者更新'+this.postData.frameworkname;
      this.res.cons2="2. 对于给定框架"+this.postData.frameworkname+"的版本"+this.postData.frameversion+"，目前适配结果为" + temp2;
    },
  }
}
</script>

<style scoped>
/* 最外层 设置position定位 */
.dialog {
position: relative;
color: #e7e5e6;
font-size: 16px;
}
/* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
.dialog-cover {
background: rgba(68, 68, 68, 0.8);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index:1;
}
.close_button{
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
.dialog-content{
position: fixed;
top: 10px;
width: 1080px;
left: 420px;
bottom: 5px;
/* 移动端使用felx布局 */
display: flex;
flex-direction: column;
justify-content: start;
align-items: center;
z-index: 2001;
color: rgb(0, 0, 0);
overflow: scroll;
background: #FFFFFF;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
}
/* 标题框样式 */
.dialog_head{
  width: 1080px;
  left: 0px;
  top: 1px;
  height: 88px;
  padding: 24px 18px 24px 24px;
  border-bottom: 1px solid #E0E3EB;
}

.dialog_main{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  position: absolute;
  width: 1080px;
  left: 0px;
  top: 39px;
}

.dialog-title{
  width: 320px;
  height: 36px;
  font-family: 'HONOR Sans CN';
  font-size: 24px;
  color: #333333;
  letter-spacing: 0;
  line-height: 48px;
  font-weight: 600;
}
.result-title {
  margin-top: 30px;
  font-family: 'HONOR Sans CN';
  font-size: 28px;
  color: #000;
  letter-spacing: 0;
  font-weight: 700;
  text-align: center;
}
.content_div{
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
    
}
/* 图表名称样式 */
.echart_title{
   display: flex;
flex-direction: column;
align-items: center;
padding: 0px 120px;
gap: 4px;
width: 960px;
flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
/* 漏洞展示报告 */
.bugShowDiv{
   display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 24px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    color: #FFFFFF;
    width: 960px;
    height: 776px;
    background: #3E4453;
    border-radius: 4px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
    overflow: auto;
}
.bugShowDiv pre{
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
 text-align: left;
}
/* 得分图div */
#rdeva{
   display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 24px;
width: 960px;
flex: none;
order: 1;
flex-grow: 0
}
</style>
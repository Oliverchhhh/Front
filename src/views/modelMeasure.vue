<template>
    <div>
       <a-layout>
           <!-- 顶部菜单栏 -->
       <a-layout-header>
           <!-- 导航栏 -->
           <navmodule/>
       </a-layout-header>
       <a-layout-content>
           <!-- 功能介绍 -->
           <func_introduce :funcDesText="funcDesText"></func_introduce>
           <!-- 参数配置 -->
           <div class="paramCon">
               <!-- 参数配置容器 -->
               <h2 class="subTitle" style="margin-top: -96px;">参数配置</h2>
               
               <div class="funcParam">
                   <div class="paramTitle" >
                       <!-- 功能标题和执行按钮 -->
                       <!-- icon展示 -->
                       <!-- <div class="paramIcom" icon="ui-icon-envTestIcon"></div> -->
                       <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                       <!-- 功能名称 -->
                       <h3>{{ funcDesText.name }}</h3>
                       <a-button class="DataEva" @click="dataEvaClick" :style="buttonBGColor" :disabled="disStatus">
                           <a-icon type="security-scan" />
                           评估
                       </a-button>
                   </div>
                   <a-divider />
                   <div class="inputdiv">
                       <!-- 选模型 -->
                       
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型类型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="AlexNet">AlexNet</a-radio>
                                    <a-radio :style="radioStyle" value="VGG16">VGG16</a-radio>
                                    <a-radio :style="radioStyle" value="ResNet18">ResNet18</a-radio>
                                    <a-radio :style="radioStyle" value="ResNet50">ResNet50</a-radio>
                                    <a-radio :style="radioStyle" value="InceptionV3">Inception V3</a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="datasetSelected">
                            <p class="mainParamName">请选择数据集</p>
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="CIFAR10" >
                                        CIFAR10
                                    </a-radio>
                                    <p class="matchedMethodText"><span>CIFAR10数据集：</span>是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in CIFAR10_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                    
                                </div>
                            </a-radio-group>
                        </div>
                   </div>
               </div>
           </div>
           <!-- 日志展示 -->
           <div v-if="logflag">
               <showLog :percent="percent" :logtext="logtext"></showLog>
           </div>
           <!-- 结果展示 -->
           <resultDialog  @on-close="closeDialog" 
               :isShow="isShowPublish" 
               v-show="isShowPublish"
               ref="report_pdf"
               >
               <div slot="header">
                   <div class="dialog_title">
                       <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                       <h1>开发环境分析及框架适配</h1>
                   </div>
               </div>
               <div class="dialog_publish_main" slot="main">
                   <!-- 图表 -->
                   <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <!-- <p class="result_annotation">当前操作系统架构：{{ result.result.EnvTest.detection_result['System Architecture'] }}，{{ result.result.EnvTest.detection_result['Version Message'] }}</p> -->
                            <p class="result_annotation">漏洞匹配机制：{{ matchedMethod }}</p>
                            <!-- <p class="result_annotation">当前系统Cuda版本：{{ result.result.EnvTest.detection_result['Current Cuda Version'] }}</p> -->
                            <p class="result_annotation">适配开发框架：{{ framework}} {{ frameversionInput }}</p>
                        </div>
                       <div class="echart_title">
                           
                           <div class=" main_top_echarts_con_title ">完整漏洞报告</div>
                           
                       </div>
                       <div id="rdeva">
                           <!-- 图表 -->
                           <div class = 'bugShowDiv'>
                               <pre>{{ Risk }}</pre>
                           </div>
                           
                           <div class="conclusion">
                               <p class="result_text">{{ result1 }}</p>
                               <p class="result_text">{{ result2 }}</p>
                           </div>
                       </div>
                   </div>
                   <button class="exportResultBtn" @click="exportResult"><a-icon type="upload" />导出报告内容</button>
               </div>
           
           </resultDialog>
       </a-layout-content>
       <a-layout-footer>

       </a-layout-footer>
       </a-layout>
    </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
import html2pdf from 'html2pdf.js'

/* 引入图片 */
import funcicon from "../assets/img/modelMeasure.png"
import bgimg from "../assets/img/modelEvaBackground.png"

const selectSvg = {
       template:`
       <svg t="1680138013828" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4354" width="128" height="128"><path d="M534.869333 490.496a1403.306667 1403.306667 0 0 0 50.858667-25.813333c16.042667-8.618667 29.013333-15.061333 38.570667-19.029334 9.557333-3.925333 17.066667-6.058667 22.869333-6.058666 9.557333 0 17.749333 3.2 24.917333 10.026666 6.826667 6.826667 10.581333 15.061333 10.581334 25.088 0 5.76-1.706667 11.818667-5.12 17.92-3.413333 6.101333-7.168 10.069333-10.922667 11.861334-35.157333 14.677333-74.410667 25.429333-116.736 31.872 7.850667 7.168 17.066667 17.237333 28.330667 29.781333 11.264 12.544 17.066667 18.986667 17.749333 20.053333 4.096 6.101333 9.898667 13.653333 17.408 22.613334 7.509333 8.96 12.629333 15.786667 15.36 20.778666 2.730667 5.034667 4.437333 11.093333 4.437333 18.304a33.706667 33.706667 0 0 1-9.898666 24.021334 33.834667 33.834667 0 0 1-25.6 10.410666c-10.24 0-22.186667-8.618667-35.157334-25.472-12.970667-16.512-30.037333-46.933333-50.517333-91.050666-20.821333 39.424-34.816 65.962667-41.642667 78.506666-7.168 12.544-13.994667 22.186667-20.48 28.672a30.976 30.976 0 0 1-22.528 9.685334 32.256 32.256 0 0 1-25.258666-11.093334 35.413333 35.413333 0 0 1-9.898667-23.68c0-7.893333 1.365333-13.653333 4.096-17.578666 25.258667-35.84 51.541333-67.413333 78.848-93.568a756.650667 756.650667 0 0 1-61.44-12.544 383.061333 383.061333 0 0 1-57.685333-20.48c-3.413333-1.749333-6.485333-5.717333-9.557334-11.818667a30.208 30.208 0 0 1-5.12-16.853333 32.426667 32.426667 0 0 1 10.581334-25.088 33.152 33.152 0 0 1 24.234666-10.026667c6.485333 0 14.677333 2.133333 24.576 6.101333 9.898667 4.266667 22.186667 10.026667 37.546667 18.261334 15.36 7.893333 32.426667 16.853333 51.882667 26.538666-3.413333-18.261333-6.485333-39.082667-8.874667-62.378666-2.389333-23.296-3.413333-39.424-3.413333-48.042667 0-10.752 3.072-19.712 9.557333-27.264A30.677333 30.677333 0 0 1 512.341333 341.333333c9.898667 0 18.090667 3.925333 24.576 11.477334 6.485333 7.893333 9.557333 17.92 9.557334 30.464 0 3.584-0.682667 10.410667-1.365334 20.48-0.682667 10.368-2.389333 22.570667-4.096 36.906666-2.048 14.677333-4.096 31.146667-6.144 49.834667z" fill="#FF3838" p-id="4355"></path></svg>
       `,
   };
   const selectIcon = {
       template: `
           <a-icon :component="selectSvg" />
       `,
       data() {
           return {
               selectSvg,
           };
       },
   }
export default {
   name:"envTest",
   components:{
       /* 注册组件 */
       navmodule:navmodule,
       func_introduce:func_introduce,
       showLog:showLog,
       resultDialog:resultDialog,
       selectIcon,
   },
   data(){
       return{
           /* 单选按钮样式 */
           radioStyle: {
               display: 'block',
               lineHeight: '30px',
               width: '100%'
           },
           CIFAR10_imgs:[
                {imgUrl:require('../assets/img/cifar100.jpg'),name:'mnist0'},
                {imgUrl:require("../assets/img/cifar101.jpg"),name:'mnist1'},
                {imgUrl:require("../assets/img/cifar102.jpg"),name:'mnist2'},
                {imgUrl:require("../assets/img/cifar103.jpg"),name:'mnist3'},
                {imgUrl:require("../assets/img/cifar104.jpg"),name:'mnist4'},
                {imgUrl:require("../assets/img/cifar105.jpg"),name:'mnist5'},
                {imgUrl:require("../assets/img/cifar106.jpg"),name:'mnist6'},
                {imgUrl:require("../assets/img/cifar107.jpg"),name:'mnist7'},
                {imgUrl:require("../assets/img/cifar108.jpg"),name:'mnist8'},
                {imgUrl:require("../assets/img/cifar109.jpg"),name:'mnist9'},
                ],
           /* 评估按钮样式和状态 */
           buttonBGColor:{
               background:"#0B55F4",
               color:"#FFFFFF"
           },
           // 按钮是否置灰
           disStatus:false,
           /* 日志框是否显示，false不显示，true显示，默认不显示 */
           logflag:false,
           /* 进度 */
           percent:1,
           /* 日志内容，调用日志接口获取 */
           logtext:[],
           /* 功能介绍模块信息 */
           funcDesText:{
               /* 功能名称 */
               name:"AI模型安全度量",
               /* 功能icon，需先引入 */
               imgpath:funcicon,
               /* 功能背景图片，需先引入 */
               bgimg:bgimg,
               /* 功能介绍下的总介绍 */
               destext:"xxx",
               /* 背景介绍 */
               backinfo:"xxx",
               /* 亮点介绍 */
               highlight:[
                   "xxx",
                   "xxx",
                   "xxx",
               ]
           },
           /* 结果弹窗状态信息 */
           isShowPublish:false,
           /* 评估结果 */
           result:{},
           /* 主任务id */ 
           tid:"",
           /* 子任务id */ 
           stid:"",
           /* 异步任务结果查循环clock */
           clk:"",
           /* 日志查询clock*/
           logclk:"", 
           }
       },
   watch:{
       /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
       isShowPublish:{
           immediate:true,
           handler(v){
               if(v){
                   this.noScroll();
               }else{
                   this.canScroll();
               }
           }
       }
   },
   created() {
       document.title = 'AI模型安全度量';
       },
   methods: { 
       /* 关闭结果窗口 */
       closeDialog(){
           this.isShowPublish=false;
           //把绑定的弹窗数组 设为false即可关闭弹窗
       },
       onMatchedMethodChange(e){
           // 修改匹配机制，待修改
           console.log('radio checked', e.target.value);
       },
       // 修改开发框架，待修改
       onFrameworkChange(e){
           console.log('radio checked', e.target.value);
       },
      exportResult(){
       // debugger
       if (confirm("您确认下载该pdf文件吗？") ){
           // 输出pdf尺寸为download_page大小
           var element = document.getElementById("download_page");
           // var element = this.$refs.report_pdf;
           const opt = {
               margin:[10, 20, 10, 20],
               filename:this.tid+'.pdf',
               image:{type:'jpeg',quality:1},
               html2canvas:{scale:5},
               jsPDF:{unit:'mm',format:'a4', orientation:'portrait'}
           };

           html2pdf().from(element).set(opt).save();

       }
       },
       /* result 处理*/
       resultPro(res){
           // debugger;
           var that = this;
       },
       /* 获取结果 */ 
       getData(){
           var that = this;
           that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
               console.log("dataget:",data);
               that.result=data;
           });
       },
       /* 获取日志 */ 
       getLog(){
           var that = this;
           if(that.percent < 99){
               that.percent += 1;
           }
           that.$axios.get('/Task/QueryLog', {params:{ Taskid: that.tid }}).then((data)=>{
               that.logtext = data.data.Log[that.stid];
           });
       },
       /* 停止结果获取循环 */ 
       stopTimer() {
           if (this.result.data.stop) {
               // 关闭日志显示
               this.percent=100
               this.logflag = false;
               // 关闭结果数据获取data
               clearInterval(this.clk);
               // 关闭日志获取结果获取
               clearInterval(this.logclk);
               // 显示结果窗口
               this.isShowPublish = true;
               // 处理结果
               this.result = this.result.data;
               this.resultPro(this.result);
           }
       },
       /* 更新结果*/ 
       update(){
           this.getData();
           try{
               this.stopTimer();
           }catch(err){}
       },
       /* 点击评估触发事件 */
       dataEvaClick(){
           /*判断选择*/

           var that=this;
           /* 调用创建主任务接口，需开启后端程序 */
           this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
               console.log(result);
               that.tid = result.data.Taskid;         
               /* 请求体 postdata*/
               const postdata={
                // 待修改
                   matchmethod:that.matchedMethod,
                   frameworkname:that.framework,
                   frameversion:frameworkVersion,
                   tid:that.tid};
               console.log(postdata)
               that.$axios.post("/EnvTest/ETParamSet", postdata).then((res) => { // 待修改
                   that.logflag = true;
                   // 异步任务
                   that.stid =  res.data.EnvTestid;
                   that.logclk = self.setInterval(that.getLog, 3000);
                   // that.stid="S20230224_1106_368e295"
                   that.clk = self.setInterval(that.update, 3000);
               }).catch((err) => {
                       console.log(err)
               });
           }).catch((err) => {
               console.log(err)
           });    
       }
   }
}
</script>
<!-- <style  scoped> -->
<style scoped>

.paramCon{
   width: 1200px;
   margin-left: 360px;
}
.funcParam{
/* 模型公平性评估 */
box-sizing: border-box;
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1200px;
height: 824px;
background: #FFFFFF;
border: 1px solid #E0E3EB;
margin: 0px 0px 40px 0px;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
flex: none;
order: 0;
flex-grow: 0;
text-align: left;
}
.paramTitle{
   height:80px;
   padding: 20px 24px 20px 26px;
   text-align: left;
   width: 1200px;
}
.paramTitle h3{
   /* height: 48px; */
   display: inline;
   margin-top: 38px;
   width: 279px;
   height: 36px;
   font-family: PingFangSC-Semibold;
   font-size: 24px;
   color: #333333;
   letter-spacing: 0;
   line-height: 48px;
   font-weight: 600;
}
/* 按钮样式 */
.DataEva{
   float: right;
   font-style: normal;
   font-weight: 400;
   font-size: 20px;
   line-height: 20px;
   padding: 0px 24px;
   font-family: 'Microsoft YaHei';
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   padding: 0px 24px;
   gap: 4px;
   width: 114px;
   height: 40px;
   background: #FFFFFF;
   border-radius: 6px;
}

.ant-divider-horizontal{
   margin: 0 0;
}
/* 输入模块div样式 */
.inputdiv{
   margin: 0px 48px;
   height: 700px;
   overflow: auto;
}
/* 匹配机制样式 */
.matchedSelected{
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   padding: 0px;
   /* gap: 16px; */

   width: 1104px;
   /* height: 228px; */


   /* Inside auto layout */

   flex: none;
   order: 1;
   align-self: stretch;
   flex-grow: 0;
}
.frameRadioGroup{
   display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

width: 1104px;
height: 632px;


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}
.frameworkDiv{
   display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 1104px;
height: 200px;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
/* 版本参数模块样式 */
.frameVersionInput{
   display: flex;
flex-direction: column;
align-items: flex-start;
padding: 12px 24px;
gap: 8px;

width: 1104px;
height: 94px;
flex: none;
order: 2;
flex-grow: 0;
}
.versionInput{
   height: 40px;
   padding: 0px 0px 0px 16px;
   font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* color: #B4B9C5; */
    color: #000000;
    background: #F2F4F9;
    border-radius: 4px;
    }
.frameVersionInput p{
   font-family: 'HONOR Sans CN';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 22px;
color: #3E4453;
margin-bottom: 0px;
}
/* 单选按钮width */
.ant-radio-group{
   width: 100%;
}

.matchedDes{
   display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 1104px;
height: 106px;

border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
.modelSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    /* gap: 16px; */
    width: 1104px;
    /* height: 228px; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}


.datasetSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    /* gap: 16px; */
    width: 1104px;
    /* height: 228px; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

/* 匹配机制解释样式 */
.matchedMethodText{
    /* display: flex; */
    display: block;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 24px;
    width: 1104px;
    /* height: 46px; */
    height:auto;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #3E4453;
    margin-bottom: 0px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.matchedMethodText span{
    color:#0B55F4
}

.demoData{
    display: flex;
    margin-left: 20px;
    gap: 10px;
    /* justify-content: space-around; */
    margin-bottom: 20px;
}
/* 开发框架样式 */
.frameworkSelected{
   display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
/* gap: 24px; */
margin-top: 24px;
width: 1104px;
height: 684px;
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
}
.ant-radio-wrapper{
   margin-bottom: 0px;
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
.dialog_publish_main{
align-items: center;
flex-direction: column;
position: absolute;
display: flex;
width: 1080px;
}
.result_div{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 60px;
    gap: 24px;

    width: 1080px;
    height: 1134px;


    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: auto;
}
/* 结果文字样式 */
.resultext{
   width: 100%;
   /* height: 22px; */
   font-family: PingFangSC-Regular;
   font-size: 16px;
   color: #000000;
   font-weight: 400;
   margin-top: -40px;
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

/* gray-2 */

background: #3E4453;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 1;
align-self: stretch;
flex-grow: 0;
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
/* 得分图echart */
.conclusion{
   box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: left;
padding: 24px;
gap: 8px;

width: 960px;
/* height: 144px; */

/* gray-7 */

background: #F2F4F9;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 2;
flex-grow: 0;
}
.result_text{
   width: 912px;
/* height: 96px; */

font-family: 'HONOR Sans CN';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
text-align: left;
color: #000000;
flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
</style>

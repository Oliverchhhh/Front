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
                       <!-- 选匹配机制 -->
                       <div class="frameworkSelected">
                           <p class="mainParamNameNotop">请选择测试开发框架（不少于3种）</p>
                           <a-checkbox-group v-model="framework" @change="onFrameworkChange">
                               <div class="matchedDes">
                                   <a-checkbox :style="radioStyle" value="TensorFlow" >
                                       TensorFlow
                                   </a-checkbox>
                                   <p class="matchedMethodText">Google推出的机器学习开源框架，主要用于进行机器学习和深度神经网络研究。</p>
                               </div>
                               <div class="matchedDes">
                                   <a-checkbox :style="radioStyle" value="PyTorch">
                                       PyTorch
                                   </a-checkbox>
                                   <p class="matchedMethodText">Facebook推出开源的Python机器学习库，专门针对 GPU 加速的深度神经网络编程。</p>
                               </div>
                               <div class="matchedDes">
                                   <a-checkbox :style="radioStyle" value="PaddlePaddle">
                                        PaddlePaddle
                                   </a-checkbox>
                                   <p class="matchedMethodText">百度研发的开源开放的深度学习平台，涵盖自然语言处理、计算机视觉、推荐引擎等多个领域。</p>
                               </div>
                               <div class="matchedDes">
                                   <a-checkbox :style="radioStyle" value="CNTK">
                                        CNTK
                                   </a-checkbox>
                                   <p class="matchedMethodText">微软开发的分布式深度学习工具包，可以实现跨多个 GPU 和服务器的自动微分和并行化随机梯度下降，为大规模数据下的生产与部署做好了准备</p>
                               </div>
                               <div class="matchedDes">
                                   <a-checkbox :style="radioStyle" value="Theano">
                                    Theano
                                   </a-checkbox>
                                   <p class="matchedMethodText">蒙特利尔大学开发的机器学习工具包，可以在CPU\GPU上高效地执行阵运算，是最早诞生的开源机器学习框架之一。</p>
                               </div>
                           </a-checkbox-group>
                       </div>
                       <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="VGG" >VGG</a-radio>
                                    <p class="matchedMethodText">vgg对应可触发框架安全漏洞的VGG10模型，相较VGG16标准模型，该模型层数较少。</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="ResNet" >ResNet</a-radio>
                                    <p class="matchedMethodText">ResNet对应可触发框架安全漏洞的ResNet34模型，相较ResNet50标准模型，该模型层数较少。</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="LeNet">LeNet</a-radio>
                                    <p class="matchedMethodText">LeNet对应可触发框架安全漏洞的LeNet5模型。</p>
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
                       <h1>开发框架安全结构度量</h1>
                   </div>
               </div>
               <div class="dialog_publish_main" slot="main" id="pdfDom">
                   <!-- 图表 -->
                   <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">检测框架：</p>
                            <div class="result_annotation result_pro"><p v-for="(item, index) in framework" :key="index">{{item}}</p></div>
                            <!-- <p class="result_annotation">当前系统Cuda版本：{{ result.result.EnvTest.detection_result['Current Cuda Version'] }}</p> -->
                            <p class="result_annotation">待检测模型：{{ modelChoice }}</p>
                        </div>
                       <div class="echart_title">         
                           <div class=" main_top_echarts_con_title ">触发漏洞样本展示</div>                    
                       </div>
                       <div>
                            <resultTable :tableHead="tablehead" :tableBody="tablebody"></resultTable>
                       </div>
                       <div class="echart_title">
                           <div class=" main_top_echarts_con_title ">模型漏洞层定位</div>
                       </div>
                       
                       <div id="rdeva">
                           <!-- 图表 -->
                           <div class="box">
                                <img id="model_img" :src="model_url">
                           </div>
                           <div class="conclusion">
                                <p>存在漏洞的开发框架为</p> <p v-for="(item, index) in bugger_backend" :key="index">{{ item }}</p><p>，</p>
                                <p>定位漏洞层为 {{ buggy_layer}}</p>
                           </div>
                       </div>
                   </div>
                   <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                    <!-- <button class="exportResultBtn" @click="exportResult"><a-icon type="upload" />导出报告内容</button> -->

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
import navmodule from "../components/nav_homme.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
import resultTable from "../components/resultsTable.vue"

/* 引入图片 */
import funcicon from "../assets/img/frameworkTestIcon.png"
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
   name:"frameworkTest",
   components:{
       /* 注册组件 */
       navmodule:navmodule,
       func_introduce:func_introduce,
       showLog:showLog,
       resultDialog:resultDialog,
       selectIcon,
       resultTable: resultTable
    //   ResultsTable,
   },
   data(){
       return{
            htmlTitle:"开发框架安全结构度量",
           /* 单选按钮样式 */
           radioStyle: {
               display: 'block',
               lineHeight: '30px',
               width: '100%'
           },
           /* 开发框架选中值*/
           framework:["PyTorch","TensorFlow","PaddlePaddle", "CNTK", "Theano"], 
           modelChoice:"VGG", 
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
           percent:10,
           /* 日志内容，调用日志接口获取 */
           logtext:[],
           /* 功能介绍模块信息 */
           funcDesText:{
               /* 功能名称 */
               name:"开发框架安全结构度量",
               /* 功能icon，需先引入 */
               imgpath:funcicon,
               /* 功能背景图片，需先引入 */
               bgimg:bgimg,
               /* 功能介绍下的总介绍 */
               destext:"检测开发框架漏洞，定位并可视化漏洞层",
               /* 背景介绍 */
               backinfo:"基于多AI开发框架对模型输出结果进行交叉验证，并对可能存在漏洞问题的开发框架进行判断。对于存在漏洞问题的开发框架，进行进一步的检测与分析，判断开发框架安全漏洞具体在模型的哪一层以及哪一个操作中，并对检测结果进行可视化输出。",
               /* 亮点介绍 */
               highlight:[
                   "利用CIFAR10数据集，3种深度学习模型VGG、ResNet与LeNet，实现了高通用性、高准确率、高效率的AI开发框架安全结构度量方法",
                   "开发框架安全结构度量支持主流开发框架5种：TensorFlow、CNTK、Theano、PaddlePaddle、PyTorch",
                   "AI框架漏洞检测平均误报率≤3%，优于现有国内外开发框架安全度量技术",
               ]
           },
           /* 结果弹窗状态信息 */
           isShowPublish:false,
           /* 评估结果 */
           result:{},
           res_tmp: {},
           normal_backend: {},
           bugger_backend: {},
           buggy_layer: "",
           model_url: "",
           tablehead: [],
           tablebody: [],
           /* 主任务id */ 
           tid:"",
           /* 子任务id */ 
           stidlist:"",
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
       document.title = '开发框架安全结构度量';
       },
   methods: { 
       /* 关闭结果窗口 */
       closeDialog(){
           this.isShowPublish=false;
           //把绑定的弹窗数组 设为false即可关闭弹窗
       },
       onModelChoiceChange(e){
           // 修改匹配机制
           console.log('radio checked', e.target.value);
       },
       // 修改开发框架
       onFrameworkChange(e){
           console.log('radio checked', e);
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
            debugger;
            var that = this;
            that.result = res.FrameworkTest;
            that.tablehead = ["触发样本", "正确标签",]
            that.tablebody = []
            var generate_fig_number = that.result.generate_figure.length;
            for(var i=0; i<generate_fig_number; i++) {
                var res = "figure-"+String(i);
                that.result[res]["path"] = 'static/output/'+that.result.out_path.split('output')[1] +"/"+ that.result[res]["path"].split("/")[1];
                var error_frame = that.result[res]["path"].split("bgbk")[1].slice(0,-6);
                // 构造表格【行】
                // var tablebody_tr = ["<img :src='{{that.result[res]['path']}}'>", that.result[res]["ground_truth"]];
                var tablebody_tr = [that.result[res]['path'], that.result[res]["ground_truth"]];
                for(var j=0;j<that.result.normal_backend.length;j++){
                    tablebody_tr.push(that.result[res]["normal_backend_result"]);
                };
                tablebody_tr.push(that.result[res]["buggy_backend_result"])
                // console.log(tablebody_tr);
                // 将表格【行】添加到表格主题中
                debugger;
                that.tablebody.push(tablebody_tr);
            };
            for(var i in that.result.normal_backend) {
                switch(that.result.normal_backend[i]) {
                    case 'torch':
                        that.result.normal_backend[i]='Pytorch';
                        break;
                    case 'theano':
                        that.result.normal_backend[i] = "Theano";
                        break;
                    case 'paddle':
                        that.result.normal_backend[i] = "PaddlePaddle";
                        break;
                    case 'tensorflow':
                        that.result.normal_backend[i] = 'TensorFlow';
                        break;
                    case 'cntk':
                        that.result.normal_backend[i] = 'CNTK';
                        break;
                }
                // 将所需值添加到tablehead
                that.tablehead.push(that.result.normal_backend[i]);
            }
            for(var i in that.result.buggy_backend) {
                var temp_var = that.result.buggy_backend[i];
                switch(that.result.buggy_backend[i]) {
                    case 'torch':
                        that.result.buggy_backend[i]='Pytorch';
                        break;
                    case 'theano':
                        that.result.buggy_backend[i] = "Theano";
                        break;
                    case 'paddle':
                        that.result.buggy_backend[i] = "PaddlePaddle";
                        break;
                    case 'tensorflow':
                        that.result.buggy_backend[i] = 'TensorFlow';
                        break;
                    case 'cntk':
                        that.result.buggy_backend[i] = 'CNTK';
                        break;
                }
                if (temp_var == error_frame) {
                that.tablehead.push(that.result.buggy_backend[i]);
                };
            };
            that.normal_backend = that.result.normal_backend;
            that.bugger_backend = that.result.buggy_backend;
            that.buggy_layer = that.result.buggy_layer["0"];
            that.model_url = 'static/output/'+that.result.out_path.split('output')[1]+"/model.png";       
        },
       /* 获取结果 */ 
       getData(){
           var that = this;
           that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
               console.log("dataget:",data);
               that.res_tmp=data;
           });
       },
       /* 获取日志 */ 
       getLog(){
           var that = this;
           if(that.percent < 99){
               that.percent += 1;
           }
           that.$axios.get('/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
                if (JSON.stringify(that.stidlist)=='{}'){
                    that.logtext = [Object.values(data.data.Log).slice(-1)[0]];
                }else{
                    that.logtext=[]
                    for(let temp in that.stidlist){
                        that.logtext.push(data.data.Log[that.stidlist[temp]]);
                    }
                }
            });
       },
       /* 停止结果获取循环 */ 
       stopTimer() {
           if (this.res_tmp.data.stop==1 && this.tid == this.res_tmp.data.result.tid) {
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
            //    this.result = this.result.data;
               this.resultPro(this.res_tmp.data.result);
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
           if(this.framework.length<3){
                alert("至少选择3种开发框架！");
           }
           var that=this;
           /* 调用创建主任务接口，需开启后端程序 */
           this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
               that.tid = result.data.Taskid;   
               /* 请求体 postdata*/
               const postdata={
                    framework:that.framework,
                    model: that.modelChoice, 
                    tid:that.tid};
            //    console.log(postdata)
               that.$axios.post("/FWTest/FrameworkTestParamSet", postdata).then((res) => {
                    // debugger;
                    that.logflag = true;
                   // 异步任务
                    that.stidlist =  {"frameworkTest":res.data.stid}
                    that.logclk = self.setInterval(that.getLog, 3000);
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
/* 匹配机制样式 */

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

.ant-radio-wrapper{
    margin-bottom: 0;
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
    height: 120px;

    border-radius: 4px;

    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
/* 匹配机制解释样式 */
.matchedMethodText{
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   padding: 12px 24px;
   width: 1104px;
   height: 46px;
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
/* 开发框架样式 */
    .frameworkSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    /* gap: 24px; */
    /* margin-top: 24px; */
    width: 1104px;
    height: 684px;
    flex: none;
    order: 2;
    align-self: stretch;
    flex-grow: 0;
    }

.ant-checkbox-wrapper{
    font-size: 20px;
    font-family:'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    color: #000000;
    line-height: 28px;
    background:#F2F4F9;
    height: 60px;
    border-radius: 4px;
    padding: 16px 32px 16px 24px;
}

.result_pro{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin: 0 0 0 -20px;
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
    /* height: 1134px; */


    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: auto;
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

.box{
    height: 350px;
    width: 960px;
    /* overflow: overlay; */
    overflow-y: scroll;
}
#model_img {
    height: auto;
    width: 500px;
    overflow: hidden;
}
 
/* 得分图echart */
.conclusion{
   box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: row;
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

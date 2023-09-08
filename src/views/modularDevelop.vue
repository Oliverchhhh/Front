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
                        <!-- 选模型搜索类型 -->
                        <div class="modelSelected">
                            <p class="mainParamNameNotop">请选择模型搜索方法</p>
                            <a-radio-group v-model="searchChoice" @change="onSearchChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="DREAM" >DREAM</a-radio>
                                    <p class="matchedMethodText">使用基于反馈的AutoML模型搜索方法， 高效率搜索并构建AI模型</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="DeepAlchemy" >DeepAlchemy</a-radio>
                                    <p class="matchedMethodText">使用Nelder-Mead算法与Hyperas算法的联合优化模型尺寸搜索方法</p>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="modelSelected" v-if="searchChoice == 'DREAM'">
                            <p class="mainParamName">请选择初始化方式</p>
                            <a-radio-group v-model="initChoice" @change="onInitChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="Normal" >Normal</a-radio>
                                    <p class="matchedMethodText">默认初始搜索范围</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="Large" >Large</a-radio>
                                    <p class="matchedMethodText">初始搜索范围较大</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="Random" >Random</a-radio>
                                    <p class="matchedMethodText">随机选取初始搜索范围</p>
                                </div>
                            </a-radio-group>
                        </div>
                        <!-- 输入迭代轮数 -->
                        <div class="runtimesSelected">
                            <p class="mainParamName">请输入搜索迭代轮数</p>
                            <a-input id="param_searchtimes" class="paramsInput" placeholder="模型搜索次数，输入范围[3,10]，建议值4" @change="onSearchTimesChange"/>
                        </div>
                        <!-- 选模型类型 -->
                       <div class="modelSelected">
                            <p class="mainParamName">请选择构建模型类型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="VGG" >VGG</a-radio>
                                    <p class="matchedMethodText">包含VGG16、VGG19等</p>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="ResNet" >ResNet</a-radio>
                                    <p class="matchedMethodText">包含ResNet50、ResNet101，ResNet 152等</p>
                                </div>
                                <div class="matchedDes" v-show="searchChoice == 'DREAM'">
                                    <a-radio :style="radioStyle" value="CNN">CNN</a-radio>
                                    <p class="matchedMethodText">普通卷积神经网络</p>
                                </div>
                                <div class="matchedDes" v-show="searchChoice == 'DeepAlchemy'">
                                    <a-radio :style="radioStyle" value="MobileNet">MobileNet</a-radio>
                                    <p class="matchedMethodText">MobileNet网络模型</p>
                                </div>
                            </a-radio-group>
                        </div>
                        <!-- 输入训练轮数 -->
                        <div class="runtimesSelected">
                            <p class="mainParamName">请输入每次搜索的训练轮数</p>
                            <a-input id="param_traintimes" class="paramsInput" placeholder="每次搜索迭代中训练次数，输入范围[3,10]，建议值4" @change="onTrainTimesChange"/>
                        </div>

                        <!-- 选数据集 -->
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
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="MNIST">
                                        MNIST
                                    </a-radio>
                                    <p class="matchedMethodText"><span>MNIST数据集：</span>是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in MNIST_imgs" :key="index">
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
                       <h1>AI模型模块化开发</h1>
                   </div>
               </div>
               <div class="dialog_publish_main" slot="main">
                   <!-- 图表 -->
                   <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：搜索方法、（初始化方法）、搜索迭代轮数、构建模型类型 -->
                            <p class="result_annotation">搜索方法：{{ searchChoice }}</p>
                            <p class="result_annotation" v-if="searchChoice == 'DREAM'">初始化方式：{{ initChoice }}</p>
                            <p class="result_annotation">搜索迭代轮数：{{ searchTimes }}</p>
                            <p class="result_annotation">构建模型类型：{{ modelChoice }}</p>
                            <p class="result_annotation">每次搜索训练轮数：{{ trainTimes }}</p>
                            <p class="result_annotation">数据集：{{ datasetChoice }}</p>
                        </div>
                        <div class="result_row"> 
                            <div class="echart_title">         
                                <div class=" main_top_echarts_con_title ">准确率曲线</div>     
                                <div id="acc_echart" class="box"> </div>               
                            </div>
                            <div class="echart_title">
                                <div class=" main_top_echarts_con_title ">损失曲线</div>
                                <div id="loss_echart" class="box"> </div>     
                            </div>
                        </div>
                        
                       <div id="rdeva">
                           <!-- 图表 -->
                           <div class="conclusion">
                               <p class="result_text">X轴代表每个方法迭代搜索的次数，左右两图纵轴分别是历史最优的准确率 {{  }}和损失函数数值 {{  }}</p>
                               <p class="result_text">两张图展示了各个搜索方法在不断迭代中逐渐找到准确率更高、损失更低的模型及参数等模块化的组合，最终为给定任务构造和开发一个性能优秀的模型。</p>
                           </div>
                       </div>
                    </div>
                    <div class="button_group">
                        <button class="downloadGenerationBtn" @click="PopDownloadShow"><a-icon type="download" />下载模型</button>
                        <button class="exportResultBtn" @click="exportResult"><a-icon type="upload" />导出报告内容</button>
                        <button class="downloadGenerationBtn" @click="PopInferenceShow">在线推理</button>
                    </div>
                    <popDialog :isShow="isShowPopDownload" v-show="isShowPopDownload" @on-close="closePopDownloadDialog">
                        <div slot="header" class="pop_text">下载模型</div>
                        <div slot="main">
                            <p  class="pop_content">请选择模型框架类型</p>
                            <div class="pop_button_group">
                            <button class="pop_button" @click="downloadGeneration"><a-icon type="download" />PyTorch</button>
                            <button class="pop_button" @click="downloadGeneration"><a-icon type="download" />TensorFlow</button>
                            <button class="pop_button" @click="downloadGeneration"><a-icon type="download" />PaddlePaddle</button>
                        </div>
                        </div>             
                    </popDialog>
                    <onlineProcess :isShow="isShowPopInfer" v-show="isShowPopInfer" @on-close="closePopInferenceDialog">
                        <div slot="header">
                            <p class="pop_text">模型推理</p>
                            <div class="pop_button_group_">
                                <button class="pop_button"  @click="onlineInference"><a-icon type="upload" />上传图片</button>
                                <button class="pop_button"  @click="onlineInference"><a-icon type="file-image" theme="twoTone" />添加图片到数据集</button>
                            </div>
                        </div>
                        <div slot="main">
                            <div class="pop_button_group_ inferclass">
                            <button class="upload_buuton" @click="onlineInference">+</button>
                            <button class="upload_buuton">预测结果{{  }}</button>
                        </div>
                        </div>             
                    </onlineProcess>
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
import popDialog from "../components/popDialog.vue"
import onlineProcess from "../components/onlineProcess.vue"
import {drawAcc_or_loss} from "../assets/js/drawEcharts.js"
import html2pdf from 'html2pdf.js'

/* 引入图片 */
import funcicon from "../assets/img/modularDevelopIcon.png"
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
   name:"modularDevelop",
   components:{
       /* 注册组件 */
       navmodule:navmodule,
       func_introduce:func_introduce,
       showLog:showLog,
       resultDialog:resultDialog,
       selectIcon, drawAcc_or_loss,
       popDialog: popDialog,
       onlineProcess: onlineProcess
   },
   data(){
       return{
           /* 单选按钮样式 */
           radioStyle: {
               display: 'block',
               lineHeight: '30px',
               width: '100%'
           },
           MNIST_imgs:[
                {imgUrl:require('../assets/img/mnist0.jpg'),name:'mnist0'},
                {imgUrl:require("../assets/img/mnist1.jpg"),name:'mnist1'},
                {imgUrl:require("../assets/img/mnist2.jpg"),name:'mnist2'},
                {imgUrl:require("../assets/img/mnist3.jpg"),name:'mnist3'},
                {imgUrl:require("../assets/img/mnist4.jpg"),name:'mnist4'},
                {imgUrl:require("../assets/img/mnist5.jpg"),name:'mnist5'},
                {imgUrl:require("../assets/img/mnist6.jpg"),name:'mnist6'},
                {imgUrl:require("../assets/img/mnist7.jpg"),name:'mnist7'},
                {imgUrl:require("../assets/img/mnist8.jpg"),name:'mnist8'},
                {imgUrl:require("../assets/img/mnist9.jpg"),name:'mnist9'},
                ],
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
            // 搜索方式
            searchChoice: "DREAM",
            // 搜索方式为DeepAlchemy时，需选择初始化方式
            initChoice:"Normal",
            // 搜索次数
            searchTimes: "4",
            // 每次搜索训练次数
            trainTimes: "4",
            // 训练模型
            modelChoice:"VGG", 
            // 所需数据集
            datasetChoice: "CIFAR10",
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
                name:"AI模型模块化开发",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"高效率选择并自动化构造AI模型",
                /* 背景介绍 */
                backinfo:"为提升AI系统开发效率，辅助开发者设计并获取高性能AI模型，基于模块化的思想，为给定任务选择合适的模型架构与模型以及训练中的详细超参数，功能进行组件式构建、自动化训练并保存模型，并可视化显示模型的各项性能指标。",
                /* 亮点介绍 */
                highlight:[
                    "支持构建深度学习模型5种，模型参数超过100万",
                    "实现高效通用化开发，覆盖开发框架3种：PyTorch、TensorFlow、PaddlePaddle",
                    "具备组件式系统建模、动态数据收集、功能结构验证能力，经AI模型模块化开发构造的模型开发效率提升≥30%",
                ]
           },
           /* 结果弹窗状态信息 */
           isShowPublish:false,
           /* 下载模型弹窗状态 */
           isShowPopDownload: false,
           /* 在线推理弹窗状态 */
           isShowPopInfer: false,
           /* 评估结果 */
           result:{
                acc_data:[[1,2,3,4,5,6,7,8,9],[3,3,5,7,9,0,8,6,4]],
                loss_data:[[1,2,3,4,5,6,7,8,9],[3,3,5,7,9,0,8,6,4]],
                data:{stop:true}
           },
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
       document.title = 'AI模型模块化开发';
       },
   methods: { 
       /* 关闭结果窗口 */
       closeDialog(){
           this.isShowPublish=false;
           //把绑定的弹窗数组 设为false即可关闭弹窗
       },
       /* 打开下载窗口 */
       PopDownloadShow(){
        this.isShowPopDownload=true;
       },
       /* 关闭下载窗口 */
       closePopDownloadDialog(){
           this.isShowPopDownload=false;
           //把绑定的弹窗数组 设为false即可关闭弹窗
       },
       /* 打开推理窗口 */
       PopInferenceShow(){
        this.isShowPopInfer=true;
       },
       /* 关闭推理窗口 */
       closePopInferenceDialog(){
           this.isShowPopInfer=false;
           //把绑定的弹窗数组 设为false即可关闭弹窗
       },
       // 修改搜索方法
       onSearchChoiceChange(e){
           console.log('radio checked', e.target.value);
       },
       // 修改初始化方式
       onInitChoiceChange(e){
           console.log('radio checked', e.target.value);
       },
       // 修改搜索次数
       onSearchTimesChange(e) {
            if (e.target.value != "") {
                console.log('input search times: ', e.target.value);
                this.searchTimes = e.target.value;   
            } 
            console.log(this.searchTimes); 
        },
       // 修改模型类型
       onModelChoiceChange(e){
           console.log('radio checked', e.target.value);
       },
       // 修改训练次数
       onTrainTimesChange(e) {
            if (e.target.value != "") {
                console.log('input search times: ', e.target.value);
                this.trainTimes = e.target.value;   
            } 
            console.log(this.trainTimes); 
        },
       // 修改数据集类型
       onDatasetChoiceChange(e){
           console.log('radio checked', e.target.value);
       },
        //下载搜索模型    
        downloadGeneration(){
            alert("下载模型接口开发中！");
       },
        //在线推理    
       onlineInference(){
            alert("在线推理接口开发中！");
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
            //    var that = this;
                drawAcc_or_loss("acc_echart", this.result.acc_data, ["训练准确率", "验证准确率"]);  
                drawAcc_or_loss("loss_echart", this.result.loss_data, ["训练损失", "验证损失"]);       
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
            if (this.result.data.stop==1) {
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
            if(this.trainTimes == "" | this.searchTimes == ""){
                this.$message.warning('请输入搜索迭代轮数和训练轮数',3);
                return 0;
            };
            var that=this;
            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;         
                /* 请求体 postdata*/
                const postdata={
                    matchmethod:that.matchedMethod,
                    frameworkname:that.framework,
                    frameversion:frameworkVersion,
                    tid:that.tid};
                console.log(postdata)
                that.$axios.post("/EnvTest/ETParamSet", postdata).then((res) => {
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

.demoData{
    display: flex;
    margin-left: 20px;
    gap: 10px;
    /* justify-content: space-around; */
    margin-bottom: 20px;
}
.demoData img{
    /* position: absolute; */
    width: 64px;
    height: 64px;
    left: 0px;
    top: 0px;
    /* background: url(../assets/img/mnist1.jpg); */
}

.matchedDes{
   display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 1104px;
    /* height: 120px; */

    border-radius: 4px;

    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
/* 匹配机制解释样式 */
.matchedMethodText{
   /* display: flex; */
   flex-direction: column;
   align-items: flex-start;
   padding: 12px 24px;
   width: 1104px;
   /* height: 46px; */
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
    gap: 10px;
    margin-bottom: 20px;
    width: 1080px;
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
    flex-wrap: wrap;
    
}
.result_annotation {
    width: 200px
} 

.result_row{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 5% 0;
}

/* 图表名称样式 */
.echart_title{
   display: flex;
flex-direction: column;
align-items: center;
padding: 0px 120px;
gap: 4px;
width: 500px;
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
    height: fit-content;


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
    width: 450px;
    /* overflow: overlay; */
    overflow-y: scroll;
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


/* pop下载模型与在线推理css */
.button_group{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 20px;
}

.pop_text{
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    width: 100px;
    height: 30px;
}

.pop_content{
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    width: 450px;
    height: 20px;
}

.pop_button{
    font-size: 16px;
    width: 150px;
    gap: 0;
    padding: 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 40px;
    left: calc(50% - 248px/2);
    bottom: 40px;
    background: #FFFFFF;
    border-radius: 6px;
    border-color: #0B55F4;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    /* font-size: 22px; */
    line-height: 22px;
    color: #0B55F4;
}

.upload_buuton{
    font-size: 16px;
    width: 200px;
    gap: 0;
    padding: 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 200px;
    left: calc(50% - 248px/2);
    bottom: 40px;
    background: #FFFFFF;
    border-radius: 6px;
    border-color: #0B55F4;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    /* font-size: 22px; */
    line-height: 22px;
    color: #0B55F4;
}
.pop_button_group{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 8px; 
    padding: 20px 0;
}


.pop_button_group_{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    /* gap: 8px; */
    /* padding: 20px 0; */
}

.pop_button_group_ .pop_button{
    width: 200px;
}
.pop_button_group_ button:first-of-type{
    background: #0B55F4;
    color: white;
}
.pop_button_group_ button:last-of-type{
    background: white;
    color: #0B55F4;
}

.inferclass {
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 20px;
}

.inferclass button:first-of-type {
    color: #0B55F4;
    background: #EEF5FF;
    border: dashed 1px #8DBBFB;
}

.inferclass button:last-of-type {
    color: #3E4453;
    background: #F2F4F9;
    border: dashed 1px #F2F4F9;
}

</style>

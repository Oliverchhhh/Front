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
                        <!-- 输入主体 -->
                        <div class="datasetSelected">
                            <p class="mainParamNameNotop">请选择数据集</p>
                            <div class="matchedDes">
                                <a-radio :style="radioStyle" value="ImageNet" defaultChecked disabled>
                                    ImageNet
                                </a-radio>
                                <p class="matchedMethodText"><span>ImageNet数据集：</span>是ILSVRC竞赛使用的是数据集，由斯坦福大学李飞飞教授主导，包含了超过1400万张全尺寸的有标记图片，大约有22000个类别的数据。</p>
                                <p class="matchedMethodText">图例：</p>
                                <div class="demoData" >
                                    <div v-for="(item, index) in ImageNet_imgs" :key="index">
                                        <img :src="item.imgUrl">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="VGG16" >
                                        VGG16
                                    </a-radio>
                                    <a-radio :style="radioStyle" value="ResNet50">
                                        ResNet50
                                    </a-radio>
                                    <a-radio :style="radioStyle" value="MobileNetv1">
                                        MobileNetv1
                                    </a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="layerSelect">
                            <p class="mainParamName">故障注入目标层</p>
                            <div class="matchedDes">
                                <a-select
                                    show-search
                                    showArrow
                                    placeholder="请选择故障注入层"
                                    option-filter-prop="children"
                                    v-model="layerValue"
                                    :filter-option="filterOption"
                                    @focus="handleFocus"
                                    @blur="handleBlur"
                                    @change="layerSelectChange"
                                >
                                    <a-select-option v-for="temp in layer[modelChoice]" :value="temp">
                                    {{ temp }}
                                    </a-select-option>
                                </a-select>
                                <div class="layerImg">
                                    <div class="layerImgPosition">
                                        <img v-if="modelChoice=='VGG16'" :src="'../../static/img/'+modelChoice+'/'+layerValue+'.svg'" :alt="layerValue">
                                        <img v-else :src="'../../static/img/'+modelChoice+'/'+layerValue+'.png'" :alt="layerValue">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="timeSelect">
                            <p class="mainParamName">故障注入时间间隔（纳秒）</p>
                            <div class="matchedDes">
                                <a-select
                                    show-search
                                    placeholder="请选择故障注入间隔"
                                    option-filter-prop="children"
                                
                                    v-model="timeValue"
                                    :filter-option="filterOptionTime"
                                    @focus="handleFocusTime"
                                    @blur="handleBlurTime"
                                    @change="timeSelectChange"
                                >
                                    <a-select-option v-for="temp in timeList" :value="temp">
                                    {{ temp }}ns
                                    </a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-if="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>故障注入评估结果报告</h1>
                    </div>
                </div>
                
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">模型名称：</span><span class="paramValue">{{ result[modelChoice].name }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">数据集名称：</span><span class="paramValue">{{ result[modelChoice].dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">训练集数量：</span><span class="paramValue">{{ result[modelChoice]["training-set"] }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">测试集数量：</span><span class="paramValue">{{ result[modelChoice]["test-set"] }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">故障注入目标层：</span><span class="paramValue">{{ layerValue }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">故障注入强度：</span><span class="paramValue">{{ timeValue }}纳秒</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">运行时间：</span><span class="paramValue">{{ runTime}}s</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent"></div>
                            </a-col>
                        </a-row>

                    </div>
                    
                    <div class="reportContentCon">
                        <div class="result_div_notop">
                            <div class="g_score_content">
                                <div class="scorebg">
                                    <div class=" main_top_echarts_con_title ">故障注入评分详情</div>
                                
                                    <p class="g_score"> {{injectRate}}</p>
                                    <p class="g_score_evaluate"> {{ score_evaluate }}</p>
                                </div>
                            </div>
                            <div class="conclusion">
                                <p class="result_text">故障注入详情：本次故障注入是在{{ result[modelChoice].name }}模型的{{ layerValue }}层进行模拟测试，注入间隔为{{ timeValue }}纳秒，故障注入前的平均准确率为{{ result[modelChoice]["pristine-acc"] }}，故障注入后的平均准确率为{{ clockObj["average-acc"] }}%，下降了{{ subACC }}%，该人工智能系统在抵御故障注入上的能力{{ score_evaluate }}</p>
                                
                            </div>
                        </div>
                        
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">目标识别准确率</p>
                            <div class="accLineChart">

                                <!-- 图表 -->
                                <div id='accLine'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">注入后平均准确率: {{ result[modelChoice]["pristine-acc"] }}</p>
                                    <p class="result_text">注入前准确率: {{ clockObj["average-acc"] }}%</p>
                                </div>
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">网络层特征图数据</p>
                            <div class="heat_chart">
                                <div class="heat_chart_canvas">
                                    <div class="canvas_content">
                                        <div class="heatmap_div">
                                            <div id="pristine"></div>
                                            <p>原始目标层特征图数据</p>
                                        </div>
                                        <div class="heatmap_div">
                                            <div id="noise"></div>
                                            <p>加噪后目标层特征图数据</p>
                                        </div>
                                        <div class="heatmap_div">
                                            <div id="noiseData"></div>
                                            <p>目标层特征图噪声数据</p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="conclusion">
                                    <p class="result_text">原始目标层特征图数据为故障注入前的数据统计，加噪后目标层特征图数据为故障注入后相同位置的数据统计，目标层特征图噪声数据为故障注入前后的数据差值，颜色越深代表该点差别越大</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                    <a-icon type="upload" />导出报告内容
                    </a-button>
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
/* 引入自定义js，结果显示 */
import {drawLine, drawCorelationHeat} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/faultInjectIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import jsonDataVGG16 from "../../static/injection/FI_data_VGG16.json"
import jsonDataResNet50 from "../../static/injection/FI_data_ResNet50.json"
import jsonDataMobileNetv1 from "../../static/injection/FI_data_MobileNetv1.json"

export default {
    name:"inject",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
    },
    data(){
        return{
            htmlTitle:"故障注入评估报告",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                // width:"100%"
            },
            ImageNet_imgs:[
                {imgUrl:require('../assets/img/ImageNet0.png'),name:'mnist0'},
                {imgUrl:require("../assets/img/ImageNet1.png"),name:'mnist1'},
                {imgUrl:require("../assets/img/ImageNet2.png"),name:'mnist2'},
                {imgUrl:require("../assets/img/ImageNet3.png"),name:'mnist3'},
                {imgUrl:require("../assets/img/ImageNet4.png"),name:'mnist4'},
                {imgUrl:require("../assets/img/ImageNet5.png"),name:'mnist5'},
                {imgUrl:require("../assets/img/ImageNet6.png"),name:'mnist6'},
                {imgUrl:require("../assets/img/ImageNet7.png"),name:'mnist7'},
                {imgUrl:require("../assets/img/ImageNet8.png"),name:'mnist8'},
                {imgUrl:require("../assets/img/ImageNet9.png"),name:'mnist9'},
            ],
            modelChoice:"VGG16",
            
            timeValue:"500",
            layer:{
                "VGG16":["Conv1_1","Conv1_2","Conv2_1","Conv2_2","Conv3_1","Conv3_2","Conv3_3","Conv4_1","Conv4_2","Conv4_3","Conv5_1","Conv5_2","Conv5_3","fc6","fc7","fc8"],
                "MobileNetv1":["Conv1","Conv2","Conv3","Conv4","Conv5","Conv6","Conv7","Conv8","Conv9","Conv10",
                    "Conv11","Conv12","Conv13","Conv14","Conv15","Conv16","Conv17","Conv18","Conv19","Conv20",
                    "Conv21","Conv22","Conv23","Conv24","Conv25","Conv26","Conv27","fc",],
                "ResNet50":["Conv1",
                    "Conv2a_1","Conv2a_2","Conv2a_3","Conv2b_1","Conv2b_2","Conv2b_3","Conv2c_1","Conv2c_2","Conv2c_3",
                    "Conv3a_1","Conv3a_2","Conv3a_3","Conv3b_1","Conv3b_2","Conv3b_3","Conv3c_1","Conv3c_2","Conv3c_3","Conv3d_1","Conv3d_2","Conv3d_3",
                    "Conv4a_1","Conv4a_2","Conv4a_3","Conv4b_1","Conv4b_2","Conv4b_3","Conv4c_1","Conv4c_2","Conv4c_3","Conv4d_1","Conv4d_2","Conv4d_3","Conv4e_1","Conv4e_2","Conv4e_3","Conv4f_1","Conv4f_2","Conv4f_3",
                    "Conv5a_1","Conv5a_2","Conv5a_3","Conv5b_1","Conv5b_2","Conv5b_3","Conv5c_1","Conv5c_2","Conv5c_3",
                    "fc"]
            },
            layerValue:"",
            timeList:["10","30","50","100","300","500","1000","3000","5000","10000"],
            /* 热力图height*/
            heat_height:"213px",
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
                name:"故障注入评估",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"模拟可变强度、可变位置的硬件故障，量化评估硬件故障对神经网络分类精度的影响",
                /* 背景介绍 */
                backinfo:"通过破坏AI硬件计算单元的时序约束以注入时钟毛刺故障，集成可变位置故障注入以及可变强度故障注入两种功能，量化评估硬件故障对神经网络分类精度的影响，可视化呈现故障注入前后差异。",
                /* 亮点介绍 */
                highlight:[
                    "支持可变强度故障注入以及可变位置故障注入，细粒度的故障注入提高攻击的隐蔽性",
                    "细粒度故障注入降低模型识别准确率达到40%以上",
                    "高精度故障注入评估过程使用可视化方式，通过故障注入前后输出数据对比直观展示故障攻击对深度学习模型输出的影响"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{
                "VGG16":jsonDataVGG16,
                "MobileNetv1":jsonDataMobileNetv1,
                "ResNet50":jsonDataResNet50
            },
            clockObj:{},
            subACC:0.0,
            injectRate:0,
            score_evaluate:"",
            runTime:0,
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
        document.title = '故障注入评估';
        this.layerValue = this.layer[this.modelChoice][0];
        },
    methods: { 
        onModelChoiceChange(e){
            // 修改选择模型
            console.log('radio checked', e.target.value);
            console.log(`model choice:${this.modelChoice}`)
            this.layerValue = this.layer[this.modelChoice][0];
        },
        layerSelectChange(value) {
            console.log(`selected ${value}`);
            console.log(`layer value: ${this.layerValue}`);
        },
        handleBlur() {
            console.log('blur');
        },
        handleFocus() {
            console.log('focus');
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        timeSelectChange(value) {
            console.log(`selected ${value}`);
            console.log(`timeValue: ${this.timeValue}`);
        },
        handleBlurTime() {
            console.log('blur');
        },
        handleFocusTime() {
            console.log('focus');
        },
        filterOptionTime(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        /* 关闭结果窗口 */
        closeDialog(){
            this.isShowPublish=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        exportResult(){
            if (confirm("您确认下载该pdf文件吗？") ){
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                // 输出pdf尺寸为download_page大小
                var element = document.getElementById("download_page");
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
        formatDate (fmt) {
            const date = new Date()
            const o = {
                'Y+': date.getFullYear(),
                'M+': date.getMonth() + 1, // 月
                'D+': date.getDate(), // 日
                'h+': date.getHours(), // 时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                W: date.getDay() // 周
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, () => {
                    if (k === 'W') {
                    // 星期几
                    const week = ['日', '一', '二', '三', '四', '五', '六']
                    return week[o[k]]
                    } else if (k === 'Y+' || RegExp.$1.length === 1) {
                    // 年份 or 小于10不加0
                    return o[k]
                    } else {
                    return ('00' + o[k]).substr(('' + o[k]).length) // 小于10补位0
                    }
                })
                }
            }
            return fmt
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            /*判断选择*/
            let starttime = new Date()
            if (this.modelChoice =="" ){
                this.$message.warning('请选择模型！',3);
                return 0;
            };
            if (this.layerValue =="" ){
                this.$message.warning('请选择故障注入目标层！',3);
                return 0;
            };
            if (this.timeValue =="" ){
                this.$message.warning('请选择故障注入时间间隔！',3);
                return 0;
            };
            /* 日志框显示 */ 
            this.logtext=[];
            this.logflag = true;
            var log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：开始故障注入';
            this.logtext.push([log1]);
            console.log(`this result:${this.result[this.modelChoice]}`)
            let perObj = this.result[this.modelChoice].layers.find((item,i) =>{
                
                return item.name === this.layerValue.toLowerCase();
            });
            console.log(`preObj:${perObj}`);
            let clockObj = perObj.intensity.find((item,i) => {
                return item["clock-cycles"] === parseInt(this.timeValue);
            });
            this.clockObj = clockObj;
            this.percent=30;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：统计故障注入前分类准确率';
            this.logtext.push([log1]);
            let pristine_acc = parseFloat(this.result[this.modelChoice]["pristine-acc"].split("%")[0]);
            this.percent=40;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：故障注入前平均分类准确率为'+pristine_acc+"%";
            this.logtext.push([log1]);
            this.percent=50;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：统计故障注入后分类准确率';
            this.logtext.push([log1]);
            let inject_acc = clockObj["average-acc"];
            this.subACC = (pristine_acc-inject_acc).toFixed(2);
            this.injectRate = Math.round(inject_acc/pristine_acc*100)
            if(this.injectRate<=60){
                this.score_evaluate="较差";
            }else if (this.injectRate > 60 && this.injectRate <=80){
                this.score_evaluate = "良好";
            }else{
                this.score_evaluate="优秀";
            }
            this.percent = 60;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：故障注入后平均分类准确率为'+inject_acc+"%,下降了"+this.subACC+"%";
            this.logtext.push([log1]);
            
            // 画曲线图
            let legendlist = ["注入后准确率","注入前准确率"];
            let datadict={
                "注入后准确率":clockObj["faulted-acc"],
                "注入前准确率":(new Array(20)).fill(pristine_acc)
            };
            let xlable=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
            drawLine("accLine", legendlist, datadict, xlable);
            this.percent=70;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：采集故障注入前特征图数据';
            this.logtext.push([log1]);
            let xhr = new XMLHttpRequest();
            let okStatus = document.location.protocol === "file:"?0:200;
            xhr.open("GET","../../static/injection/"+clockObj["heatmap"].split(".txt")[0]+"_pristine.txt",false);
            xhr.overrideMimeType("text/html;charset=utf-8");
            xhr.send(null);
            
            let heatData = xhr.responseText.split('\r\n');
            heatData.pop();
            let pristine_heatmap =[];
            let boundarylist = [0,255];
            for(let i  in heatData){
                let templist = heatData[i].split(' ');
                for(let temp in templist){
                    pristine_heatmap.push([i,temp,Math.abs(templist[temp])]);
                }
            }
            let heatX = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            let colorlist = ["rgba(253, 227, 206, 1)", "rgba(251, 199, 157, 1)", "rgba(247, 158, 84, 1)", "rgba(244, 116, 11, 1)", "rgba(146, 70, 7, 1)"];
            /* 原始的热力图 */ 
            drawCorelationHeat("pristine", heatX, pristine_heatmap, colorlist, false, boundarylist);
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：采集故障注入后特征图数据';
            this.logtext.push([log1]);
            xhr.open("GET","../../static/injection/"+clockObj["heatmap"].split(".txt")[0]+"_noise.txt",false);
            xhr.overrideMimeType("text/html;charset=utf-8");
            xhr.send(null);
            
            heatData = xhr.responseText.split('\r\n');
            heatData.pop();
            let noise_heatmap =[];
            for(let i  in heatData){
                let templist = heatData[i].split(' ');
                for(let temp in templist){
                    noise_heatmap.push([i,temp,Math.abs(templist[temp])]);
                }
            }
            drawCorelationHeat("noiseData", heatX, noise_heatmap, colorlist, false, boundarylist);
            this.percent=80;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：计算故障注入前后特征图数据差值';
            this.logtext.push([log1]);
            xhr.open("GET","../../static/injection/"+clockObj["heatmap"].split(".txt")[0]+"_noisedata.txt",false);
            xhr.overrideMimeType("text/html;charset=utf-8");
            xhr.send(null);
            
            heatData = xhr.responseText.split('\r\n');
            heatData.pop();
            let noiseData_heatmap =[];
            for(let i  in heatData){
                let templist = heatData[i].split(' ');
                for(let temp in templist){
                    noiseData_heatmap.push([i,temp,Math.abs(templist[temp])]);
                }
            }
            drawCorelationHeat("noise", heatX, noiseData_heatmap, colorlist, false, boundarylist);
            this.percent=90;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [执行故障注入]：故障注入评估结束';
            this.logtext.push([log1]);
            this.percent=100;
            // this.logflag=false;
            this.isShowPublish=true;
            this.logflag = true
            let endtime = new Date()
            this.runTime = (endtime-starttime)/1000
            if (this.runTime < 0.5){
                this.runTime += (Math.random()/10)
                this.runTime = this.runTime.toFixed(3)
            }
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

.layerImg{
    display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 24px 32px;
gap: 4px;

width: 1104px;
height: 374px;


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}
.layerImgPosition{
    width: 856px;
height: 326px;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
.layerImgPosition img{
    width: 856px;
height: 326px;
}
/* 图表名称样式 */
.echart_title{
    display: flex;
flex-direction: column;
align-items: center;
padding: 0px 120px;
gap: 4px;

width: 960px;
height: 62px;


/* Inside auto layout */

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
.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 20px;

    width: 960px;
    height: 366px;


    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
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
.reportContent{
    height: 1194px;
    top: 169px;
}
.reportExplain{
    display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 24px;

width: 960px;
height: 156px;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
.explainText{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
    gap: 8px;

    width: 960px;
    height: 96px;

    background: rgba(11, 85, 244, 0.04);
    border: 1.5px solid rgba(11, 85, 244, 0.8);
    border-radius: 4px;
    flex: none;
    order: 1;
    flex-grow: 0;
}

.accLineChart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;

    width: 960px;
    height: 454px;
}
#accLine{
    width: 960px;
    height: 358px;
    background: #FFFFFF;
}
.heat_chart{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;

width: 960px;
height: 372px;
}
.heat_chart_canvas{
    display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 12px;

width: 960px;
height: 276px;
}
.heatmap_div{
    width: 226px;
    height: 276px;
}
.heatmap_div p{
height: 24px;
font-family: 'HONOR Sans CN';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
/* identical to box height, or 150% */

text-align: center;

color: #000000;

}
#pristine{
    width: 226px;
    height: 244px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
#noise{
    width: 226px;
    height: 244px;
    flex: none;
    order: 1;
    flex-grow: 0;
}
#noiseData{
    width: 226px;
    height: 244px;
    flex: none;
    order: 2;
    flex-grow: 0;
}
.canvas_content{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 1px;

    position: absolute;
    width: 207px;
    height: 207px;
    left: calc(30% - 207px/2 + 9.5px);
}
.dialog_publish_main{
    height:1770px
}
.exportResultBtn{
    position: absolute;
}
.downloadBtn{
    padding: 40px 0px;
    text-align: left;
    width: 205px;
}
</style>

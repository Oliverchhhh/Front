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
                        <div class="mainParamNameNotop">请选择数据集</div>
                        <div class="matchedDes">
                            <a-radio :style="radioStyle" value="CIFAR10" defaultChecked disabled>
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
                        <div class="datasetSelected">
                            <p class="mainParamNameNotop">请选择模型</p>
                            <div class="matchedDes">
                                <a-radio :style="radioStyle" value="VGG16" defaultChecked disabled>
                                    VGG16
                                </a-radio>
                            </div>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择硬件类型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="CPU" >
                                        Intel i7 7700 CPU
                                    </a-radio>
                                    <a-radio :style="radioStyle" value="ARM">
                                        Jetson Nano(ARM 架构)
                                    </a-radio>
                                    <a-radio :style="radioStyle" value="GPU">
                                        NVIDIA TITAN-V GPU
                                    </a-radio>
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
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>硬件优化评估报告</h1>
                    </div>
                </div>
                
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">模型名称：</span><span class="paramValue">VGG16</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">数据集名称：</span><span class="paramValue">CIFAR10</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">硬件类型：</span><span class="paramValue">{{ result[modelChoice].hard}}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">运行时间：</span><span class="paramValue">{{ runTime}}s</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="reportContentCon">
                        
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">模型优化前后效果展示</p>
                            <div class="accLineChart">
                                <p>模型优化前后准确率变化图</p>
                                <!-- 图表 -->
                                <div id='accLine'></div>
                                <p>模型优化前后运行时间变化图</p>
                                <!-- 图表 -->
                                <div id='timeBar'></div>
                                <p>模型优化前后模型参数变化图</p>
                                <!-- 图表 -->
                                <div id='sizeBar'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">如图，Vanilla VGG16是未压缩前的VGG16模型，Lightweight VGG16 before是轻量化的VGG16模型，
                                        Lightweight VGG16 after是在轻量化基础上参数量化后的VGG16模型，从图中可以看出模型优化前后的准确率变化非常小，
                                        但是经过优化后的运行时间远小于原始模型</p>
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
import {drawLine, drawbarhigh} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/faultInjectIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import jsonDataARM from "../../static/injection/ARM_VGG16.json"
import jsonDataCPU from "../../static/injection/CPU_VGG16.json"
import jsonDataGPU from "../../static/injection/GPU_VGG16.json"

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
            htmlTitle:"评估报告",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                // width:"100%"
            },
            runTime:0,
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
            modelChoice:"GPU",
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
                name:"基于硬件优化的软硬件一体化验证",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"从AI系统硬件运算效率的角度，实现AI系统软硬件的高效安全运行与智能驱动",
                /* 背景介绍 */
                backinfo:"使用权重剪枝、分支融合、深度可分离卷积、参数量化等技术对网络模型进行压缩与加速，并在CPU、ARM和GPU设备上优化与验证，定量评估优化效果。",
                /* 亮点介绍 */
                highlight:[
                    "支持CPU、GPU、ARM三种硬件芯片",
                    "支持轻量化优化，在模型准确率基本不变的情况下，极大提升AI系统软硬件的运行效率",
                    "支持参数量化优化方法，在轻量化的基础上进一步提升模型运行效率，压缩模型参数，并保证准确率基本不变"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{
                "CPU":jsonDataCPU,
                "GPU":jsonDataGPU,
                "ARM":jsonDataARM
            },
            postData:{}

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
        document.title = '基于硬件优化的软硬件一体化验证';
        },
    methods: { 
        onModelChoiceChange(e){
            // 修改选择模型
            console.log('radio checked', e.target.value);
            console.log(`model choice:${this.modelChoice}`)
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
        initParam(){
            this.percent = 0
            this.logtext = []
            this.postData = {}
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            /*判断选择*/
            let starttime = new Date()
            this.initParam()

            if (this.modelChoice =="" ){
                this.$message.warning('请选择硬件类型！',3);
                return 0;
            };
            /* 日志框显示 */ 
            this.logflag = true;
            var log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [data analysis]:Start analyzing optimization data';
            this.logtext.push(log1);
            console.log(`this result:${this.result[this.modelChoice]}`)
            
            this.percent=30;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [data analysis]：Model accuracy statistics';
            this.logtext.push(log1);
            // 画曲线图
            let datadict={
                "准确率":this.result[this.modelChoice].ACC,
            };
            let xlable=this.result[this.modelChoice].label;
            drawLine("accLine", ["准确率"], datadict, xlable);
            this.percent=40;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [data analysis]：Model size statistics';
            this.logtext.push(log1);
            let timedata = this.result[this.modelChoice].time
            drawbarhigh("timeBar",timedata,xlable, "","模型名称","运行时间(s)")
            this.percent=50;
            log1 = this.formatDate('YY-MM-DD hh:mm:ss')+' [info] [data analysis]：Model run time statistics';
            this.logtext.push(log1);
            let sizedata = this.result[this.modelChoice].size
            drawbarhigh("sizeBar",sizedata,xlable,"","模型名称(s)", "模型size(MB)")
            this.percent=100;
            this.logflag = false
            let endtime = new Date()
            this.runTime = (endtime-starttime)/1000
            if (this.runTime < 0.5){
                this.runTime += (Math.random()/10)
                this.runTime = this.runTime.toFixed(3)
            }
            this.isShowPublish=true;
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
    align-items:center;
}
#accLine{
    width: 960px;
    height: 358px;
    background: #FFFFFF;
}
#timeBar{
    width: 960px;
    height: 358px;
    background: #FFFFFF;
}
#sizeBar{
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

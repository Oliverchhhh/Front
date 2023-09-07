<template>
    <div>
        <a-layout >
            <a-layout-header>
                <!-- 导航栏 -->
                <navmodule/>
            </a-layout-header>
            <a-layout-content>
                <!-- 功能介绍 -->
                <func_introduce :funcDesText="funcDesText"></func_introduce>
                <!-- 参数配置容器 -->
                <div class="paramCon">
                    <!-- 参数配置容器 -->
                    <h2 class="subTitle" style="margin-top: -96px;">参数配置</h2>
                    
                    <div class="funcParam">
                        <div class="paramTitle">
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
                            <DataSetCard style="width: 1104px;  margin-bottom: 16px;" v-for="(info, index) in dataSetInfo"
                                :key="'Dataset' + index" v-bind="info" :indexInParent="index" @selectDataset="changeDataset"
                                :checked="index == selectedDataset">
                            </DataSetCard>
                            <div class="mainParamName48">请选择模型</div>
                            <ModelCard style="width: 1104px; margin-bottom: 16px;" v-for="(info, index) in modelInfo" :key="'Model' + index"
                                v-bind="info" :indexInParent="index" @selectModel="changeModel"
                                :checked="index == selectedModel">
                            </ModelCard>
                            <div class="mainParamName48">请输入攻击样本数</div>
                            <a-input class="samplenumBox" v-model="sampleNum" style="height: 60px;padding:16px 24px;" placeholder="请在此输入攻击样本数，（输入范围1-1000，建议值50）" />
                            <div class="mainParamName48">攻击方法</div>
                            <a-radio :style="radioStyle" defaultChecked disabled>
                                BackdoorAttack
                            </a-radio>
                            <div class="mainParamName48">请选择防御方法（可多选）</div>
                            <div v-for="(methods, i) in defensemethodInfo" :key="i" style="margin-bottom: 16px;">
                                <a-row :gutter="16" style="height:60px;" type="flex">
                                    <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod">
                                        <a-button :id="'button' + i + j"  @click="changeMethods(i,j)"
                                            @mouseover="methodButtonOver(i, j)"
                                            @mouseleave="methodnButtonLeave(i, j)"
                                            >{{ method.name }}</a-button>
                                    </a-col>
                                </a-row>
                                <div v-if="methodHoverIndex==i" style="padding:24px"> {{ methodDescription }} </div>
                            </div>

                            <!-- <div style="margin-bottom: 20px;"></div> -->
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
                            <h1>后门防御评估报告</h1>
                        </div>
                    </div>
                    <div class="dialog_publish_main" slot="main" id="pdfDom">
                        <div class="paramShow1">
                            <div class="paramDiv">
                                <div class="column">
                                    <div class="paramNameDiv">
                                        <p class="resParamName">数据集：</p>
                                        <p class="resParamName">攻击样本数：</p>
                                    </div>
                                    <div class="paramValueDiv">
                                        <p class="paramValue">{{postData.adv_dataset}}</p>
                                        <p class="paramValue">{{postData.adv_nums}}</p>
                                    </div>
                                </div>
                                <div class="column">
                                    <div class="paramNameDiv">
                                        <p class="resParamName">攻击方法：</p>
                                    </div>
                                    <div class="paramNameDiv">
                                        <p class="paramValue">{{postData.adv_method}}</p>
                                    </div>
                                </div>
                                <div class="defenseParam">
                                    <p class="resParamName">
                                        防御方法：
                                    </p>
                                    <p class="paramValue" v-text="defenseShow(postData.defense_methods)">
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- 报告内容 -->
                        <div class="reportContentCon">
                            <div class="result_div_notop">
                                <!-- <p class="moduleTitle">攻击样本示例</p> -->
                                <p class="main_top_echarts_con_title">攻击样本示例</p>
                                <PictureTable key="pictable0" table-id="table0" :header="true" :headerRow="true" :headerColumn="true"
                                :have-border="true" :content="selectPicList" :single-output="true" :cellWidth="setCellWidth"
                                cellHeight="140px" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                                </PictureTable>
                               
                            </div>
                            <div class="result_div_notop">
                                <p class=" main_top_echarts_con_title ">后门攻击防御效果柱状图</p>
                                <div class='defenseResultBar'>
                                    <div id="defenseBarEchart"></div>
                                    <div class="conclusion">
                                        <p class="result_text">如上图所示为后门攻击防御效果图，其中{{ maxMethod }}后门检测效果最佳，检出率为{{ maxRate }}。</p>
                                    </div>
                                </div>
                            </div>
                            <div class="result_div_notop" v-if="NCisShow(postData.defense_methods)">
                                <p class=" main_top_echarts_con_title ">Neural Cleanse后门触发器示例</p>
                                <div class="sampleTable">
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                后门防御算法名称
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in NCres.name" :key="'name'+index">
                                            <div>
                                                <p class="sampleTitleText">
                                                {{ info }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                真实触发器
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in NCres.trueTrigger" :key="'trueTrigger'+index">
                                            <div>
                                                <img :src="info" >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                预测触发器
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in NCres.predictTrigger" :key="'predictTrigger'+index">
                                            <div>
                                                <img @error="noExistImg" :src="info" >
                                            </div>
                                        </div>
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
            <a-layout-footer class="layoutFooter">

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
/* 引入自定义js，结果显示 */
import {drawbar} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/backdoorDefenseIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import errorImg from "../assets/img/errorimg.svg"
import DataSetCard from "../components/card/DataSetCard.vue"
import ModelCard from "../components/card/ModelCard.vue"
import MethodCard from "../components/card/MethodCard.vue";
import PictureTable from "../components/pictureTable.vue";
const selectSvg = {
    template: `
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
    name: "backdoor",
    components: {
        /* 注册组件 */
        navmodule: navmodule,
        func_introduce: func_introduce,
        showLog: showLog,
        resultDialog: resultDialog,
        selectIcon,
        DataSetCard,
        ModelCard,
        MethodCard,
        PictureTable: PictureTable
    },
    data() {
        return {
            htmlTitle:"后门攻击防御报告",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            /* 评估按钮样式和状态 */
            buttonBGColor: {
                background: "#0B55F4",
                color: "#FFFFFF"
            },
            selectPicList:[["攻击方法", "加噪前", "噪声", "加噪后"],
            ["BackdoorAttack",[["./static/output/backdoor/0/clean.jpeg"], "pic"], [["./static/output/backdoor/1/clean.jpeg"], "pic"], [["./static/output/backdoor/2/clean.jpeg"], "pic"]],
            ["BackdoorAttack",["./static/output/backdoor/0/backdoor.jpeg", "pic"], ["./static/output/backdoor/1/backdoor.jpeg", "pic"], ["./static/output/backdoor/2/backdoor.jpeg", "pic"]],
            ["BackdoorAttack",["./static/output/backdoor/0/poisoned.jpeg", "pic"], ["./static/output/backdoor/1/poisoned.jpeg", "pic"], ["./static/output/backdoor/2/poisoned.jpeg", "pic"]],
        ],
        setCellWidth: [0.17, 0.16, 0.16,0.16,0.16,0.16],
            // 按钮是否置灰
            disStatus: false,
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag: false,
            /* 进度 */
            percent: 10,
            /* 日志内容，调用日志接口获取 */
            logtext: [],
            errorImg:errorImg,
            /* 功能介绍模块信息 */
            funcDesText: {
                /* 功能名称 */
                name: "后门攻击防御",
                /* 功能icon，需先引入 */
                imgpath: funcicon,
                /* 功能背景图片，需先引入 */
                bgimg: bgimg,
                /* 功能介绍下的总介绍 */
                destext: "后门攻击防御包括后门检测、后门逆向、后门清除，达到发现后门并还原后门的效果",
                /* 背景介绍 */
                backinfo: "后门攻击中，攻击者希望模型只对具有某种特定特征的数据做出错误判断。\
                通过毒化一小部分训练数据，后门攻击诱导了深度神经网络学习后门触发器和目标标签之间的相关性。\
                后门攻击防御从后门检测、后门逆向、后门清除三个角度降低后门攻击的威胁。",
                /* 亮点介绍 */
                highlight: [
                    "后门检测技术：后门检测算法包括STRIP，数据来源检测，激活值分析检测，光谱特征检测等，有效检出数据中的毒化数据",
                    "后门逆向技术：后门逆向算法包括Neural Cleanse的三种范数（L1、L2、Linf norm范数），通过模型后门逆向的方法有效识别后门并重建可能的后门",
                    "后门清除技术：后门清除算法SAGE提出基于自注意力蒸馏的后门清洗策略，解决了触发器未知条件下后门准确定位的难题"
                ]
            },
            // output路径需修改
            NCres:{
                name:["Neural Cleanse L1","Neural Cleanse L2","Neural Cleanse Linf"],
                trueTrigger:["./static/trigger/l1/trigger.jpeg", "./static/trigger/l2/trigger.jpeg", "./static/trigger/linf/trigger.jpeg"],
                predictTrigger:["./static/trigger/l1/trigger_predict.jpeg" ,"./static/trigger/l2/trigger_predict.jpeg", "./static/trigger/linf/trigger_predict.jpeg"]
            },
            /* 结果弹窗状态信息 */
            isShowPublish: false,
            /* 评估结果 */
            result: {},
            /* 主任务id */
            tid: "",
            /* 子任务id */
            stid: {},
            /* 日志查询clock*/
            logclk: "",
            // 数据集信息
            dataSetInfo: [
                {
                    name: "MNIST",
                    description: "是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。",
                    pictureSrcs: [
                        [require("../assets/img/mnist0.jpg"),
                        require('../assets/img/mnist1.jpg'),
                        require('../assets/img/mnist2.jpg'), 
                        require('../assets/img/mnist3.jpg'), 
                        require('../assets/img/mnist4.jpg'), 
                        require('../assets/img/mnist5.jpg'), 
                        require('../assets/img/mnist6.jpg'),
                        require('../assets/img/mnist7.jpg'),
                        require('../assets/img/mnist8.jpg'),
                        require('../assets/img/mnist9.jpg'),],
                    ],
                },
                {
                    name: "CIFAR10",
                    description: "是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。",
                    pictureSrcs: [
                        [require('../assets/img/cifar100.jpg'), 
                        require('../assets/img/cifar101.jpg'),
                        require('../assets/img/cifar102.jpg'), 
                        require('../assets/img/cifar103.jpg'), 
                        require('../assets/img/cifar104.jpg'), 
                        require('../assets/img/cifar105.jpg'), 
                        require('../assets/img/cifar106.jpg'),
                        require('../assets/img/cifar107.jpg'),
                        require('../assets/img/cifar108.jpg'),
                        require('../assets/img/cifar109.jpg')],
                        ],
                },
            ],
            selectedDataset: 0,
            modelInfo: [
            {
                    name: "SmallCNN",
                    disabled:false
                },
                {
                    name: "ResNet18",
                    disabled:true
                },
                {
                    name: "VGG16",
                    disabled:true
                },
            ],
            selectedModel: 0,
            sampleNum:"",
            methodInfo: [
                {
                    name: "BackdoorAttack",
                },
            ],
            defensemethodInfo: [
                [
                    {
                        name:"Detction based on activation analysis",
                        id:"Activation",
                        description:"中毒数据和合法数据的激活被分为两个不同的簇，而完全干净的数据集的激活未被分成两个不同的簇。通过对激活进行2-means聚类，并对聚类生成的两个簇进行进一步的分析可以检测和判断中毒簇。",
                    },
                    {
                        name:"Detction based on data provenance",
                        id:"Provenance",
                        description:"使用有关训练集中数据点的起源和转换的上下文信息来识别有毒数据。无论有没有可信的测试数据集，该方法都适用，可以在具有可靠来源信息的物联网环境中有效地检测和减轻投毒攻击。",
                    }
                ],
                [
                    {
                        name:"Detction based on spectral signature",
                        id:"Spectral Signature",
                        description:"利用所有已知后门攻击的一个新属性，频谱签名来通过强大的统计工具阻止对抗攻击。频谱签名在检测和删除真实图像集和最先进的神经网络架构上的中毒样本方面非常有用。",
                    },
                    {
                        name:"STRIP",
                        id:"STRIP",
                        description:"STRIP算法对每个输入样本进行强烈的扰动，从而检测出trigger input",
                    },
                    {
                        name:"Neural Cleanse L1",
                        id:"Neural Cleanse L1",
                        description:"第一个用于DNN后门攻击的强大且可推广的检测和缓解系统。可以识别后门并重建可能的触发器。通过输入过滤器、神经元修剪和遗忘来识别多种缓解技术。可以抵抗多种后门攻击变体。支持L1 norm范数。",
                    }
                ],
                [
                    {
                        name:"Neural Cleanse L2",
                        id:"Neural Cleanse L2",
                        description:"第一个用于DNN后门攻击的强大且可推广的检测和缓解系统。可以识别后门并重建可能的触发器。通过输入过滤器、神经元修剪和遗忘来识别多种缓解技术。可以抵抗多种后门攻击变体。支持L2 norm范数。",
                    },
                    {
                        name:"Neural Cleanse Linf",
                        id:"Neural Cleanse Linf",
                        description:"第一个用于DNN后门攻击的强大且可推广的检测和缓解系统。可以识别后门并重建可能的触发器。通过输入过滤器、神经元修剪和遗忘来识别多种缓解技术。可以抵抗多种后门攻击变体。支持Linf norm范数。",
                    },
                    {
                        name:"SAGE",
                        id:"SAGE",
                        description:"一种新的净化防御框架，利用自注意力蒸馏来清除后门模型。与需要教师模型监督蒸馏过程的传统注意力迁移机制不同，SAGE可以通过少量干净样品实现自净化。",
                    }
                ],

            ],
            selectedDefenseMethod: [],
            methodDescription:"",
            methodHoverIndex: -1,
            postData:{},
            maxRate:0,
            maxMethod:"",
        }
    },
    watch: {
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        isShowPublish: {
            immediate: true,
            handler(v) {
                if (v) {
                    this.noScroll();
                } else {
                    this.canScroll();
                }
            }
        }
    },
    created() {
       document.title = '后门攻击防御';
       },
    //在离开页面时执行
    beforeDestroy() {
        if(this.clk) { //如果定时器还在运行,关闭定时器
            window.clearInterval(this.clk); //关闭
        }
        if(this.logclk){
            window.clearInterval(this.logclk);
        }
    },
    methods: {
        /* 关闭结果窗口 */
        closeDialog() {
            this.isShowPublish = false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        noExistImg(e){
            e.target.src=this.errorImg;
        },
        /* 获取日志 */
        /* 获取日志 */ 
        getLog(){
            // debugger
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            that.$axios.get('/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
                // console.log("log:", data)
                if (JSON.stringify(that.stid)=='{}'){
                    that.logtext = [Object.values(data.data.Log).slice(-1)[0]];
                }else{
                    that.logtext=[]
                    for(let temp in that.stid){
                        that.logtext.push(data.data.Log[that.stid[temp]]);
                    }
                }
            });
        },
        // 防御方法参数显示
        defenseShow(method="[]"){
            let param = JSON.parse(method);
            return param.join('、');
        },
        NCisShow(method="[]"){
            // return true;
            if (method.indexOf("Neural Cleanse") > -1){
                return true;
            }else{
                return false;
            }
        },
        initParam(){
            this.logtext=[]
            this.percent=0
            this.postData={}
            this.result = {}
            this.tid=''
            if(this.clk != ''){
                window.clearInterval(this.clk)
                this.clk = ''
            }
            if(this.logclk != ''){
                window.clearInterval(this.logclk)
                this.logclk = ''
            }
            this.NCres.name = [];
            this.NCres.trueTrigger=[];
            this.NCres.predictTrigger=[];
        },
        /* 点击评估触发事件 */
        dataEvaClick() {
            // 判断选择
            this.initParam()
            let dataset = this.dataSetInfo[this.selectedDataset].name;
            let model = this.modelInfo[this.selectedModel].name
            if (1 <= this.sampleNum && this.sampleNum <= 1000 ){
            }
            else{
                this.$message.warning('请输入攻击样本数量，输入范围为1-1000，建议值50！',3);
                return 0;
            }
            if (this.selectedDefenseMethod.length == 0){
                this.$message.warning('请至少选择一项防御方法！',3);
                return 0;
            }
            
            this.logflag = true;
            
            var that = this;

            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask", { AttackAndDefenseTask: 0 }).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.logclk = window.setInterval(that.getLog, 6000);
                /* 请求体 postdata*/
                that.postData = {
                    adv_dataset: dataset,
                    adv_model: model,
                    adv_method: "backdoor",
                    adv_nums: this.sampleNum,
                    defense_methods: JSON.stringify(this.selectedDefenseMethod),
                    tid: that.tid
                };
                console.log(this.postData)
                that.$axios.post("/detect", that.postData).then((res) => {
                    that.logflag = false;
                    that.stid['backdoorDefense'] =  res.data.stid
                    that.result = res.data;
                    console.log(that.result);
                    window.clearInterval(that.logclk);
                    let label=[];
                    let rateList=[];
                    let noDefenseACC=[];
                    let maxRate = 0;
                    let maxMethod="";
                    for (let temp in that.result.detect_rates){
                        if (maxRate < that.result.detect_rates[temp]){
                            maxMethod = temp
                            maxRate = that.result.detect_rates[temp]
                        }
                        label.push(temp);
                        rateList.push(that.result.detect_rates[temp])
                        noDefenseACC.push(that.result.no_defense_accuracy)
                    }
                    that.maxRate = maxRate;
                    that.maxMethod = maxMethod
                    drawbar("defenseBarEchart",rateList,label, "", "检出率", "算法名称")
                    // output路径需修改
                    if ( label.indexOf("Neural Cleanse L1") > -1 ){
                        that.NCres.name.push("Neural Cleanse L1");
                        let imgpath = "./static/output/trigger/l1/"
                        // require('/static/img/output/sample00.png')
                        that.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                        that.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
                    }
                    if ( label.indexOf("Neural Cleanse L2") > -1 ){
                        that.NCres.name.push("Neural Cleanse L2");
                        let imgpath = "./static/output/trigger/l2/"
                        that.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                        that.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
                    }
                    if ( label.indexOf("Neural Cleanse Linf") > -1 ){
                        that.NCres.name.push("Neural Cleanse Linf");
                        let imgpath = "./static/output/trigger/linf/"
                        that.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                        that.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
                    }
                    that.isShowPublish = true;
                }).catch((err) => {
                    console.log(err);
                    window.clearInterval(that.logclk);
                });
            }).catch((err) => {
                console.log(err)
            });
        },
        // 更换数据集
        changeDataset(index) {
            this.selectedDataset = index
            if (this.selectedDataset == 0){
                this.selectedModel = 0
                this.modelInfo[0].disabled=false
                this.modelInfo[1].disabled=true
                this.modelInfo[2].disabled=true
            }else{
                if (this.selectedModel == 0){
                    this.selectedModel = 1
                }
                this.modelInfo[0].disabled=true
                this.modelInfo[1].disabled=false
                this.modelInfo[2].disabled=false
            }
        },
        // 更换模型
        changeModel(index) {
            this.selectedModel = index
        },
        methodButtonOver(i, j) {
            // let button = document.getElementById("button" + i + j)
            // button.style.background = "lightblue"
        },
        methodnButtonLeave(i, j) {
            // let button = document.getElementById("button" + i + j)
            // button.style.background = "#F2F4F9"
        },
        // 防御方法点击选中
        changeMethods(i, j) {
            // debugger;
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {
                this.methodHoverIndex = i
                this.methodDescription = this.defensemethodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#E7F0FD"
                this.selectedDefenseMethod.push(this.defensemethodInfo[i][j].id)
            } else {
                this.methodHoverIndex = -1
                this.methodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedDefenseMethod.splice(this.selectedDefenseMethod.indexOf(this.defensemethodInfo[i][j].id), 1 )
            }
        },
    }
}
</script>
<!-- <style  scoped> -->
<style scoped>
.paramCon {
    width: 1200px;
    margin-left: 360px;
}




.paramTitle {
    height: 80px;
    padding: 20px 24px 20px 26px;
    text-align: left;
    width: 1200px;
}

.layoutFooter{
    background: #FFFFFF;
}

.paramTitle h3 {
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
.DataEva {
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

.ant-divider-horizontal {
    margin: 0 0;
}

.samplenumBox{ 
    
    background-color: #F2F4F9;
    font-size: 18px;

}
.dialog_publish_main {
    align-items: center;
    flex-direction: column;
    position: absolute;
    display: flex;
    width: 1080px;
}
.paramDiv{
    display: flex;
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
}
.column{
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;
}
.defenseParam{
    display: flex;
    width: 540px;
    align-items: flex-start;
    gap: 8px;
}
.paramNameDiv{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}
.paramValueDiv{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 0 0;
}
.resParamName{
    color: var(--gray-3, #6C7385);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
}
.paramValue{
    color: #000;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
}
.defenseParam .resParamName{
    width: 80px;
}
.defenseParam .paramValue{
    flex: 1 0 0;
    text-align: left;
}
.reportContentCon{
    display: flex;
    width: 1080px;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    margin-top: 60px;
}
.sampleTable{
    display: flex;
    width: 960px;
    align-items: flex-start;
    border-radius: 4px;
    border: 1px solid #E0E3EB;
    background: #FFF;
}
.sampleColumn{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
}
.sampleTitleCol{
    display: flex;
    height: 68px;
    padding: 9px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: var(--gray-7, #F2F4F9);
}
.sampleTitleText{
    align-self: stretch;
    color: rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px; /* 140% */
}
.samplePicCol{
    display: flex;
    height: 128px;
    padding: 9px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: #FFF;
}
.samplePicCol div{
    display: flex;
    height: 48px;
    padding: 0px 0.5px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.samplePicCol div img{
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}
.defenseResultBar{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    align-self: stretch;
}
#defenseBarEchart{
    display: flex;
    height: 432px;
    width: 960px;
    padding: 32px 32px 0px 32px;
    flex-direction: column;
    align-items: flex-start;
}

.denfenseMethod .ant-btn{
    width: 100%;
    background-color: #F2F4F9;
    font-size:20px;
    height:60px;
    color:#000;
    border:0px;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; 
}
.logdiv{
    margin-top: 32px;
}
</style>

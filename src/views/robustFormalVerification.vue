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
                        <!-- 选数据集 -->
                        <div class="datasetSelected">
                            <p class="mainParamNameNotop">请选择数据集</p>
                            <a-radio-group v-model="dataset" @change="onFrameworkChange" class="datasetRadioGroup">
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="mnist" >
                                        MNIST
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：5-10" v-model="mnist_dataset" :disabled="dataset==='mnist'?false:true"/>
                                    </div>

                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="cifar10" >
                                        CIFAR10
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="cifar10_dataset" :disabled="dataset=='cifar10'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="gtsrb" >
                                        GTSRB
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：5-10" v-model="gtstb_dataset" :disabled="dataset=='gtsrb'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="mtfl" >
                                        MTFL
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="mtfl_dataset" :disabled="dataset=='mtfl'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="sst2" >
                                        SST2
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="sst2_dataset" :disabled="dataset=='sst2'?false:true"/>
                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="ai_model" @change="onAiModelChange">
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="cnn" :disabled="['mnist'].indexOf(dataset) > -1? false: true" > CNN </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="resnet18" :disabled="['cifar10', 'mtfl', 'gtsrb'].indexOf(dataset) > -1? false: true" >  ResNet18 </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="densenet" :disabled="['cifar10'].indexOf(dataset) > -1? false: true" >  DenseNet </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="lstm" :disabled="['sst2'].indexOf(dataset) > -1? false: true" > LSTM </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="transformer" :disabled="['sst2'].indexOf(dataset) > -1? false: true" > Transformer </a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <!-- 最大扰动值 -->
                        <div class="epsInput">
                            <p class="mainParamName">请设置最大扰动</p>
                                <a-input class="paramsInput" placeholder="请输入最大扰动值，建议输入：0.02-0.08之间" v-model="maxEps" />
                        </div>

                        <!-- 最小扰动值 -->
                        <div class="epsInput">
                            <p class="mainParamName">请设置最小扰动</p>
                            <a-input class="paramsInput" placeholder="请输入最小扰动值，建议输入：0.02-0.08之间" v-model="minEps" />
                        </div>

                        <!-- 最大扰动值 -->
                        <div class="epsInput">
                            <p class="mainParamName">请设置扰动次数</p>
                            <a-input class="paramsInput" placeholder="请输入扰动次数，建议输入4-6次" v-model="epsCnt" />
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
                        <h1>鲁棒性形式化验证评估结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- <div class="paramShow">
                        <div class="col">
                            <div>
                                <p><span class="paramName">数据集：</span><span class="paramValue">{{ result[modelChoice].name }}</span></p>
                            </div>
                        </div>
                    </div> -->
                    <!-- 总评分 -->
                    <div class="result_div">
                        <div class="g_score_content">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">鲁棒性形式化验证总评分</div>
                                <!-- 显示分数 -->
                                <p class="g_score"> {{result_score.toFixed(0)}}</p>
                                <!-- 显示评估结果 -->
                                <p class="g_score_evaluate"> {{ resultEvaluate }}</p>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text"> 模型综合评分为{{result_score.toFixed(0)}}，是一个{{ resultScon }}的模型</p>
                            <p class="result_annotation">通过鲁棒性分析，在指定输入和扰动空间下，该模型可成功抵御对抗攻击的概率为{{result_score.toFixed(0)}}%。</p>
                        </div>
                    </div>
                    
                    <!-- 图表 -->
                    <div class="result_div">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">鲁棒性分析结果</div>
                            <!-- <p class="title_annotation">标题说明，可无</p> -->
                            
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <div id = 'conseva'></div>
                            <div class="conclusion">
                                <!-- <p class="result_text">图表结论</p> -->
                                <p class="result_annotation">图表中auto_LiRPA曲线展示了在不同扰动大小下，使用auto_LiRPA算法分析所得AI模型被对抗样本成功攻击的概率。</p>
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
import navmodule from "../components/nav.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
/* 引入自定义js，结果显示 */
import {drawStackedLine} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/modelEvaIcon.png"
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
    name:"robustFormalVerification",
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
            htmlTitle:"鲁棒性形式化验证报告",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                width: '100%'
            },
            modelStyle: {
                display: 'block',
                lineHeight: '10px',
                width: '100%'
            },
            /* 数据集选中的值 */
            dataset: 'mnist', 
            /* 数据集类型 */
            mnist_dataset: "",
            cifar10_dataset: "",
            gtstb_dataset: "",
            mtfl_dataset: "",
            sst2_dataset: "",
            
            /* 模型选择 */
            ai_model: 'cnn',
            /* 最大扰动值 */
            maxEps: "",
            /* 最小扰动值 */
            minEps: "",
            /* 扰动次数 */
            epsCnt: "",
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
                name:"模型形式化验证",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"基于区间边界传播算法从形式化验证角度对AI模型的鲁棒性进行分析",
                /* 背景介绍 */
                backinfo:"通过分析特定样本在指定区间的扰动范围内模型输出的上下边界，评估模型在特定扰动空间内针对指定输入数据的鲁棒性。",
                /* 亮点介绍 */
                highlight:[
                    "从形式化验证的角度分析模型鲁棒性，分析结果的可解释性较强；",
                    "覆盖图片分类、情感识别、智能交通、人脸识别等多种在通用场景；",
                    "支持CNN、ResNet、DesNet、LSTM、以及Transformer等多种深度神经网络。"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{},
            result_score : 0.9,
            resultScon: "",
            resultEvaluate: "",
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
        document.title = '鲁棒性形式化验证';
        },
    methods: { 
        /* 关闭结果窗口 */
        closeDialog(){
            this.isShowPublish=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
         // 修改数据集与模型的对应关系
         onFrameworkChange(e){
            // this.ai_model = 'lstm';

            var currentDataset = e.target.value;
            if (currentDataset == 'mnist' && this.ai_model != 'cnn') {
                this.ai_model = 'cnn';
            }
            if (currentDataset == 'cifar10' && ['resnet18', 'desnet'].indexOf(this.ai_model) == -1) {
                this.ai_model = 'resnet18';
            }
            if (['mtfl', 'gtsrb'].indexOf(currentDataset) > -1 && this.ai_model != 'resnet18') {
                this.ai_model = 'resnet18';
            }
            if (currentDataset == 'sst2' && ['lstm', 'transformer'].indexOf(this.ai_model) == -1) {
                this.ai_model = 'lstm';
            }
            console.log('radio checked', e.target.value);
         },
         // 选择模型
         onAiModelChange(e){
            console.log('radio checked', e.target.value);
         },
        /* result 处理*/
        resultPro(res){
            // debugger;
            var that = this;
            // 总分判断
            var allRates = res.LiRPA.rates;
            var sum = 0;
            var avgRates = 0;
            for (let v of allRates) {
                avgRates += v;
            }
            avgRates /= allRates.length;
            that.result_score = 100 - avgRates * 100;
            console.log("Avg rates is : ", that.result_score)
            if(that.result_score > 80){
                that.resultEvaluate = "优秀";
                that.resultScon = "鲁棒";
            }else if(that.result_score > 60 && that.result_score <=80){
                that.resultEvaluate = "良好";
                that.resultScon = "较鲁棒";
            }else{
                that.resultEvaluate = "差";
                that.resultScon = "较不鲁棒";
            }
            var disLabel = res.LiRPA.eps;
            var disData = [];
            var legendInfo = [];
            console.log("result_data is : ", res)
            for (let disKey in res) {
                var tmpData = res[disKey];
                disData.push(tmpData.rates)
                legendInfo.push(tmpData.name)
            }
            drawStackedLine('conseva', disData, legendInfo, disLabel, '')
            
        },
        /* 获取结果 */ 
        getData(){
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                that.result=data.data.result.formal_verification;
            });
        },
        /* 获取日志 */ 
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
            if (this.result.stop) {
                this.percent=100;
                // 关闭日志显示
                // this.logflag = false;
                // 关闭结果数据获取data
                clearInterval(this.clk);
                // 关闭日志获取结果获取
                clearInterval(this.logclk);
                
                // 处理结果
                
                this.resultPro(this.result.output_param);
                // 显示结果窗口
                this.isShowPublish = true;
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
                var that=this;
                that.percent=10;
                that.result={};
                var data_size = 0

            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                if (this.dataset == 'mnist') {
                    data_size = this.mnist_dataset;
                } else if (this.dataset == 'cifar10') {
                    data_size = this.cifar10_dataset;
                } else if (this.dataset == 'mtfl') {
                    data_size = this.mtfl_dataset;
                } else if (this.dataset == 'gtsrb') {
                    data_size = this.gtstb_dataset;
                }else if (this.dataset == 'sst2') {
                    data_size = this.sst2_dataset;
                }
                if(data_size == ""){
                    that.$message.warning('请输入数据集大小',3);
                    return 0;
                }
                if(that.maxEps == ""){
                    that.$message.warning('请输入最大扰动值',3);
                    return 0;
                }
                if(that.minEps == ""){
                    that.$message.warning('请输入最小扰动值',3);
                    return 0;
                }
                if(that.epsCnt == ""){
                    that.$message.warning('请输入扰动次数',3);
                    return 0;
                }
                /* 请求体 postdata*/
                const postdata={
                    'dataset': this.dataset,
                    'model': this.ai_model,
                    'size': data_size,
                    'up_eps': this.maxEps,
                    'down_eps': this.minEps,
                    'steps': this.epsCnt,
                    'task_id':that.tid
                };
                console.log(postdata)
                // 异步任务
                // that.stid =  res.data.stid;
                that.logflag = false;
                that.logtext.length = 0;
                // 
                // 启动任务
                that.$axios.post("/FormalVerification", postdata).then((res) => {
                    that.stidlist =  {"formalverfy":res.data.stid};
                    that.logclk = self.setInterval(that.getLog, 1000);
                    that.logflag = true;
                    that.clk = self.setInterval(that.update, 6000);
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
.paramTitle{
    height:80px;
    padding: 20px 24px 20px 26px;
    text-align: left;
    width: 1200px;
}
.methodDes{
    height: 100px;
    width: 960px;
    background-color: aquamarine;
}
/* 公式样式 */
.formula_Y{
    height:24px;
    width:15px;
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
/* 得分图div */
#rdeva{
    display: flex;
flex-direction: column;
align-items: center;
padding: 0px;

width: 960px;
height: 414px;


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 800px;
    height:800px;
}
/* 仪表盘中的文字 */
.conseva_label{
    margin-top: -85px;
    margin-bottom: 85px;
    width: 86px;
height: 16px;

font-family: 'Helvetica Neue';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 16px;
/* identical to box height, or 100% */

text-align: center;

/* gray-1 */

color: #000000;


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}
/* 群体公平性 */
.group_echarts_div{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;
margin-top: 32px;
width: 960px;
/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}
/* 群体-单个属性框样式 */
.attr_echarts_div{
    display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 0px;

width: 960px;

/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
/* 群体-属性标题框样式 */
.attr_title_div{
    display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 0px;
gap: 4px;

width: 960px;
height: 64px;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
.attr_title_div h3{
    font-family: 'HONORSansCN-Bold';
    flex-direction: column;
    margin-bottom: 0px;
font-size: 28px;
line-height: 36px;
/* identical to box height, or 129% */

display: flex;
align-items: center;
text-align: center;

color: rgba(0, 0, 0, 0.9);


/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
.attr_title_div p{
    font-family: 'HONOR Sans CN';
    flex-direction: column;
    margin-bottom: 0px;
font-size: 14px;
line-height: 24px;
/* identical to box height, or 171% */

display: flex;
align-items: center;
text-align: center;

/* gray-3 */

color: #6C7385;


/* Inside auto layout */

flex: none;
order: 1;
align-self: stretch;
flex-grow: 0;
}
.group_echart_content{
    display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0px;

width: 960px;
height: 358px;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
}
/* 左边直方图 */
.group_left_echart{
    width: 480px;
    height: 358px;
    float: left;

}
/* 右边直方图 */
.group_right_echart{
    width: 480px;
    height: 358px;
    float: right;
}
/* 热力图框总样式 */
.heat_content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 16px;

    width: 960px;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
}
/* 热力图标题样式 */
.heat_content h3{
font-family: 'HONOR Sans CN';
font-size: 24px;
line-height: 32px;
font-weight: 700;
margin-top:24px;
/* identical to box height, or 133% */

display: flex;
align-items: center;
text-align: center;

/* 文字色/light/fontgray4-title */

color: rgba(0, 0, 0, 0.9);


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 1;
}
/* 热力图画布大小 */
.heat_canvas{
    width: 960px;
    /* max-height: 930px;
    min-height: 213px; */
}
/* 占比图画布大小 */
#pro_tree{
    width: 960px;
    height: 600px;
    /* min-height: 200px;
    max-height: 600px; */
}

.datasetDiv{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 1104px;
flex: none;
order: 0;
flex-grow: 0;
}
.modelDiv{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1104px;
height: 76px;
border-radius: 4px;
flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}

.sizeInput{
    height: 40px;
    padding: 0px 0px 0px 16px;
    font-family: 'HONOR Sans CN';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
color: #B4B9C5;
background: #F2F4F9;
border-radius: 4px;
}

.epsValueInput{
    height: 40px;
    padding: 0px 0px 0px 16px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    /* line-height: 24px; */
    color: #B4B9C5;
    background: #F2F4F9;
    border-radius: 4px;
}
.ant-radio-wrapper{
    margin-bottom: 0px;
}
.datasetSelected{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1104px;
height: 896px;
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
}
.epsInput{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
/* gap: 24px; */
margin-top: 8px;
width: 1104px;
/* height: 1084px; */
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
}
.modelSelected{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
/* gap: 24px; */
margin-top: 24px;
width: 1104px;
/* height: 684px; */
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
}

.datasetRadioGroup{
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
.epsInputGroup{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

width: 1104px;
/* height: 632px; */


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}


.datasetSizeInput{
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
.epsInfoInput{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 24px 12px 24px;
    gap: 8px;

    width: 1104px;
    /* height: 94px; */
    flex: none;
    order: 2;
    flex-grow: 0;
}

</style>

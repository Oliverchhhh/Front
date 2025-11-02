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
                            <div class="selectWithupload"> 
                                <p class="mainParamNameNotop">请选择能耗文件</p>
                                <a-button class="uploadDatasetBtn" name="table" >
                                    <!-- @click="dataUploadButton" -->
                                    <a-icon type="upload" style="color: #0B55F4;" />上传数据
                                </a-button>
                            </div>
                            
                            <a-radio-group v-model="dataChoice" @change="onDataChoiceChange">
                                <div class="matchedDes" v-for="(item, index) in dataChoiceList" :key="index">
                                    <a-radio :style="radioStyle" :value="index" :disabled="methodFilter(dataChoice)">{{ item.name }}.trs</a-radio>
                                </div>
                               
                            </a-radio-group>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择能耗分析方法</p>
                            <a-radio-group v-model="methodChoice" @change="onMethodChoiceChange">
                                <div class="matchedDes" v-for="(item, index) in methodChoiceList" :key="index"> 
                                    <a-radio :style="radioStyle" :value="index" :disabled="item.disindex"> {{ item.name }}</a-radio>
                                    <!-- <p v-show="methodChoice==index" class="matchedMethodText" >{{ item.des }}</p> -->
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
                        <h1>侧信道分析结果报告</h1>
                    </div>
                </div>
                
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">能耗文件：</span><span class="paramValue">{{ dataChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">能耗分析方法：</span><span class="paramValue">{{ methodChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent"></div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent"></div>
                            </a-col>
                        </a-row>

                    </div>
                    
                    <div class="reportContentCon">
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">能耗分析结果</p>
                            <div class="accLineChart">

                                <!-- 图表 -->
                                <div class="g_score_content" id="score"></div>
                                
                                <div class="conclusion">
                                    <p v-show="methodChoice!='HPA'" class="result_text">{{ result.text1 }}存在阈值>4.5的值，说明{{ result.text2 }}泄露</p>
                                    <p v-show="methodChoice=='HPA'" class="result_text">{{ result.text3 }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="result_div_notop" v-show="methodChoice=='SPA'">
                            <p class=" main_top_echarts_con_title ">原模型示意图</p>
                            <div class="g_score_content" id="ori_network"></div>
                            <p class=" main_top_echarts_con_title ">模型恢复示意图</p>
                            <div class="g_score_content" id="res_network"></div>
                            <div class="conclusion">
                                <p class="result_text">根据SPA攻击的相关性系数曲线特征，可以直接区分出模型各层结构。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
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
import {drawside, drawTtest, drawALLPA} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/sideIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"


export default {
    name:"inject",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        drawside, drawTtest, drawALLPA
    },
    data(){
        return{
            htmlTitle:"侧信道分析",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                // width:"100%"
            },
            buttonBGColor:{
                background:"#0B55F4",
                color:"#FFFFFF"
            },
            dataChoice: "",
            dataChoiceList: {
                'trace1':{'name': 'Trace1', 'value': 'trace1', 'id':'(022.108.112.-9)elmotracegaus_cpa_-9.trs','disindex':false},
                'trace2':{'name': 'Trace2', 'value': 'trace2', 'id':'(022.112.116.-9)elmotracegaus_hpa_-9.trs','disindex':false},
                'trace3':{'name': 'Trace3', 'value': 'trace3', 'id':'(2122.108.112.47)elmotracegaus_cpa_47.trs','disindex':false},
                'trace4':{'name': 'Trace4', 'value': 'trace4', 'id':'(2122.108.112.47)elmotracegaus_hpa_47.trs','disindex':false},
                'trace5':{'name': 'Trace5', 'value': 'trace5', 'id':'(7522.108.112.2)elmotracegaus_cpa_2.trs','disindex':false},
                'trace6':{'name': 'Trace6', 'value': 'trace6', 'id':'(7522.112.116.2)elmotracegaus_hpa_2.trs','disindex':false},
                // 'trace7':{'name': 'Trace7', 'value': 'trace7', 'id':'','disindex':false},
            },
            methodChoice: "",
            methodChoiceList: {
                'CPA':{'name': 'CPA', 'value': 'cpa','disindex':false, 'des': 'CPA方法描述描述'},
                'DPA':{'name': 'DPA','value': 'dpa','disindex':false, 'des': 'DPA方法描述'},
                'HPA':{'name': 'HPA','value': 'hpa','disindex':false, 'des': 'HPA方法描述'},
                // 'SPA':{'name': 'SPA', 'value': 'SPA','disindex':false, 'des': 'SPA方法描述'},
                'T-test':{'name': 'T-test','value': 'ttest','disindex':false, 'des': 'T-test方法描述'},
                'X2-test':{'name': 'X²-Test', 'value': 'x2test','disindex':false, 'des': 'X²-Test方法描述'},
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
                name:"侧信道分析",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"使用模型运行时的功耗/电磁数据，评估硬件性能",
                /* 背景介绍 */
                backinfo:"采集目标模型在目标平台上运行产生的功耗/电磁信息，形成曲线数据。输入功耗/电磁曲线数据文件，分别进行不同的侧信道攻击",
                /* 亮点介绍 */
                highlight:[
                    "支持对目标模型使用T-test、X^2-test分析进行泄漏检测，根据阈值判断是否存在泄漏",
                    "对目标模型进行DPA分析及HPA分析，并得到相关性系数，输出相关性曲线图展示攻击结果及不同能耗分析攻击方法的特点",
                    "内置不同trs文件，支持上传用户自己定义数据"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{
                text1:"",
                text2:"",
                text3:""
            },
            res_tmp:{},
            /* 主任务id */ 
            tid:"",
            /* 子任务id */ 
            stidlist:{},
            /* 异步任务结果查循环clock */
            clk:null,
            /* 日志查询clock*/
            logclk:null, 
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
        document.title = '侧信道分析';
        },
    methods: { 
        onDataChoiceChange(e){
            // 修改选择能耗文件
            this.dataChoice = e.target.value;
            // 待替换trs的曲线json
            // this.$axios.get("../../static/output/"+this.dataChoice+".json").then(res=>{
            //     drawside(e.target.value, res.data);
            // });
        },
        onMethodChoiceChange(e){
            // 修改选择分析方法
            console.log('radio checked', e.target.value);
            // 需要对data进行判断
            // if (this.methodChoiceList[this.dataChoice] in ) 
        },
        methodFilter(data){
            // debugger;
            if (['trace1'].includes(data)) {
                this.methodChoiceList['CPA']['disindex']=false;
                this.methodChoiceList['DPA']['disindex']=false;
                this.methodChoiceList['HPA']['disindex']=true;
                this.methodChoiceList['T-test']['disindex']=false;
                this.methodChoiceList['X2-test']['disindex']=false;
            }else if (['trace5'].includes(data)) {
                this.methodChoiceList['CPA']['disindex']=false;
                this.methodChoiceList['DPA']['disindex']=true;
                this.methodChoiceList['HPA']['disindex']=true;
                this.methodChoiceList['T-test']['disindex']=false;
                this.methodChoiceList['X2-test']['disindex']=false;
            } else if (['trace2', 'trace4', 'trace6'].includes(data)) {
                this.methodChoiceList['CPA']['disindex']=true;
                this.methodChoiceList['DPA']['disindex']=true;
                this.methodChoiceList['HPA']['disindex']=false;
                this.methodChoiceList['T-test']['disindex']=true;
                this.methodChoiceList['X2-test']['disindex']=true;
            } else if(data=='trace3') {
                this.methodChoiceList['CPA']['disindex']=false;
                this.methodChoiceList['DPA']['disindex']=false;
                this.methodChoiceList['HPA']['disindex']=true;
                this.methodChoiceList['T-test']['disindex']=false;
                this.methodChoiceList['X2-test']['disindex']=true;
            }
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
        resultPro(res){
            debugger;
            res = res.result.side;
            if ('ttest' in res) {
                drawTtest('score',res.ttest.X, res.ttest.Y[0]);
                if(Math.max.apply(Math, res.ttest.Y[0])>4.5 || Math.min.apply(Math, res.ttest.Y[0])<-4.5){
                    this.result.text1 = "";
                    this.result.text2 = "有"
                } else {
                    this.result.text1 = "不";
                    this.result.text2 = "无"
                }
                return
            }
            // 根据情况是否保留x2test
            if ('x2test' in res) {
                drawTtest('score',res.x2test.X, res.x2test.Y[0]);
                if(Math.max.apply(Math, res.x2test.Y[0])>4.5 || Math.min.apply(Math, res.x2test.Y[0])<-4.5){
                    this.result.text1 = "";
                    this.result.text2 = "有"
                } else {
                    this.result.text1 = "不";
                    this.result.text2 = "无"
                }
                return
            }
            if (this.methodChoice == 'HPA') {
                let echart_legend = [];
                let echart_X = res.hpa.X;
                let echarts_y = []
                for(var i = 0; i < res.hpa.Y.length; i++){
                    echart_legend.push("错误值");
                    let temp = {};
                    temp['symbol'] = 'none';
                    temp['name'] = echart_legend[i];
                    temp['type'] = 'line';
                    temp['data'] = res.hpa.Y[i];
                    echarts_y.push(temp);
                }
                echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.hpa.false });
                echart_legend.push("错误值");
                echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.hpa.true });
                echart_legend.push("正确值");
                drawALLPA('score', echart_legend, echart_X, echarts_y);
                if(Math.max(Math.max.apply(Math, res.hpa.Y),Math.max.apply(Math, res.hpa.false)) < Math.min.apply(Math, res.hpa.true)){
                    this.result.text3 = "正确值相关性与错误值相关性差值大且稳定，说明侧信道攻击成功"
                } else {
                    this.result.text3 = "正确值相关性与错误值相关性差值小或不稳定，说明侧信道攻击失败"
                }
                
            }
            if (this.methodChoice == 'SPA') {
                // 待定
                drawALLPA('score', res.spa.X, res.spa.Y, res.spa.false, res.spa.true);
            }
            if (this.methodChoice == 'DPA') {
                let echart_legend = [];
                let echart_X = res.dpa.X;
                let echarts_y = []
                for(var i = 0; i < res.dpa.Y.length; i++){
                    echart_legend.push("错误值");
                    let temp = {};
                    temp['symbol'] = 'none';
                    temp['name'] = echart_legend[i];
                    temp['type'] = 'line';
                    temp['data'] = res.dpa.Y[i];
                    echarts_y.push(temp);
                }
                echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.dpa.false });
                echart_legend.push("错误值");
                echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.dpa.true });
                echart_legend.push("正确值");
                drawALLPA('score', echart_legend, echart_X, echarts_y);
            }
            if (this.methodChoice == 'CPA') {
                let echart_legend = [];
                let echart_X = res.cpa.X;
                let echarts_y = []
                for(var i = 0; i < res.cpa.Y.length; i++){
                    echart_legend.push("错误值");
                    let temp = {};
                    temp['symbol'] = 'none';
                    temp['name'] = echart_legend[i];
                    temp['type'] = 'line';
                    temp['data'] = res.cpa.Y[i];
                    echarts_y.push(temp);
                }
                echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.cpa.false });
                echart_legend.push("错误值");
                echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.cpa.true });
                echart_legend.push("正确值");
                drawALLPA('score', echart_legend, echart_X, echarts_y);
            }   
        },
        /* 获取结果 */ 
        getData(){
            // debugger
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                // hpa
            // that.$axios.get('../../static/output/S20230914_1608_2c7bb25_result.json').then((data)=>{
                // cpa dpa
            // that.$axios.get('../../static/output/S20230914_1613_bbd9a33_result.json').then((data)=>{   
                // ttest 
            // that.$axios.get('../../static/output/S20230914_1610_6e8eb3b_result.json').then((data)=>{
                console.log("dataget:",data);
                that.res_tmp = data;
            });
        },
        /* 获取日志 */ 
        getLog(){
            // debugger;
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
            // debugger;
            // var that = this;
            if (this.res_tmp.data.stop==1 && this.tid == this.res_tmp.data.result.tid) {
                // 关闭日志显示
                this.percent=100
                // this.logflag = false;
                // 关闭结果数据获取data
                window.clearInterval(this.clk);
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                // this.resultPro(this.res_tmp.data.result);
                // 适配json
                this.resultPro(this.res_tmp.data);
            }
        },
        /* 更新结果*/ 
        update(){
            // debugger;
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            /*判断选择*/
            window.clearInterval(this.clk);
            // 关闭日志获取结果获取
            window.clearInterval(this.logclk);
            if (this.dataChoice =="" | this.methodChoice=='' ){
                this.$message.warning('请选择能耗文件与分析方法！',3);
                return 0;
            };
            /* 备份 */ 
            var that = this;
            that.res_tmp = {};
            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                that.tid = result.data.Taskid;
                /* 请求体 postdata*/
                const postdata={
                    trs_file:that.dataChoiceList[that.dataChoice].id,
                    methods:that.methodChoiceList[that.methodChoice].value,
                    tid:that.tid};
                that.$axios.post("/SideAnalysis", postdata).then((res) => {
                    that.logflag = true;
                    that.stidlist = {"SideAnalysis": res.data.stid};
                    that.logclk = window.setInterval(that.getLog, 300);
                    that.clk = window.setInterval(that.update, 300);
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

.selectWithupload {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}

.ant-divider-horizontal{
    margin: 0 0;
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
    height:fit-content
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

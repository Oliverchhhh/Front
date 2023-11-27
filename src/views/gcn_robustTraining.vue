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
                <div class="labelSelection">
                    <router-link to="/robust_advTraining"><button class="labelunselected">CNN对抗训练</button></router-link>
                    <router-link to="/gcn_robustTraining"><button class="labelselected">GCN可认证鲁棒训练</button></router-link>
                    <router-link to="/featurescatter_robustTraining"><button class="labelunselected">特征散射鲁棒性训练</button></router-link>
                    <router-link to="/seat_robustTraining"><button class="labelunselected">异常感知鲁棒性训练</button></router-link>
                    <router-link to="/smoothing_robustTraining"><button class="labelunselected">随机平滑鲁棒性训练</button></router-link>
                </div>
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
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange" v-for="(item,index) in dataname" :key="index">
                                <a-radio :style="radioStyle" :value="index">
                                    {{ item }}
                                </a-radio>
                                <div class="matchedDes" >
                                    <datatable v-show="datasetChoice==index" :tabledata="datainfo[item].tabledata" style="margin-bottom: 2%;"></datatable>                                   
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="datasetSelected">
                            <p class="mainParamNameNotop">请设置数据集参数</p>
                            <div class="paramsSelected">
                                <div>
                                    <p class="matchedMethodText paramblock">批处理大小：</p> 
                                    <el-input-number :min="1" :max="1000" v-model="batch_size"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">训练集比例：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.1" v-model="train_size"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">测试集比例：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.1" v-model="test_size"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">验证集比例：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.1" v-model="val_size"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">随机数种子：</p> 
                                    <el-input-number :min="1" :max="1000"  v-model="random_state"></el-input-number>
                                </div>
                            </div>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="GCN" :disabled=true>图神经网络（Graph Neural Networks）</a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请设置训练参数</p>
                            <div class="paramsSelected">
                                <div>
                                    <p class="matchedMethodText paramblock">最大迭代次数：</p> 
                                    <el-input-number :min="1" :max="2000" v-model="n_iters"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">全局扰动数量：</p> 
                                    <el-input-number :min="1" :max="100"  v-model="train_Q"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">鲁棒损失梯度迭代次数：</p> 
                                    <el-input-number :min="1" :max="100"  v-model="margin_iters"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">属性扰动数量：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.01" v-model="q_ratio"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">未优化鲁棒损失迭代次数：</p> 
                                    <el-input-number :min="0" :max="1000" v-model="burn_in"></el-input-number>
                                </div>
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
            <resultDialog  @on-close="closeDialog" 
               :isShow="isShowPublish" 
               v-show="isShowPublish"
               ref="report_pdf"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>GCN可信鲁棒训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ dataname[datasetChoice] }}</p>
                            <p class="result_annotation">批处理大小：{{ batch_size }}</p>
                            <p class="result_annotation">训练集比例：{{ train_size }}</p>
                            <p class="result_annotation">测试集比例：{{ test_size }}</p>
                            <p class="result_annotation">验证集比例：{{ val_size }}</p>  <br>
                            <p class="result_annotation">随机数种子：{{ random_state }}</p>
                            <p class="result_annotation">模型：{{ modelChoice }}</p>
                            <p class="result_annotation">最大迭代次数：{{ n_iters }}</p>
                            <p class="result_annotation">全局扰动数量：{{ train_Q }}</p>
                            <p class="result_annotation">鲁棒损失梯度迭代次数：{{ margin_iters }}</p>
                            <p class="result_annotation">属性扰动数量：{{ q_ratio }}</p>
                            <p class="result_annotation">未优化鲁棒损失迭代次数：{{ burn_in }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">GCN可认证鲁棒训练效果</div>
                        <div style="width: 1000px; height: 450px;" id="adv_robust_result"></div>
                        <!-- <div class=" main_top_echarts_con_title ">非鲁棒性训练</div> -->
                        <div style="width: 1000px; height: 400px;" id="unadv_robust_result"></div>
                        <div class="conclusion">
                            <p class="result_text">通过鲁棒性训练，系统中抗扰动节点与总节点数量的比例得到提升，表明本鲁棒性训练算法能极大提升系统的鲁棒性和抗攻击性。{{ modelChoice }}模型、{{ dataname[datasetChoice] }}数据集，用可信鲁棒训练方法进行GCN模型鲁棒性训练，鲁棒性提升了{{result.up}}%。</p>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
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
/* 引入组件，数据集表格 */
import datatable from "../components/dataTable.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
import {initGraph1, initGraph2} from "../assets/js/drawEcharts.js"
/* 引入自定义js，结果显示 */

/* 引入图片 */
import funcicon from "../assets/img/robustTrainingIcon.png"
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
    name:"coverage_layer",
    components:{
        /* 注册组件 */
    navmodule: navmodule,
    func_introduce: func_introduce,
    datatable:datatable,
    showLog: showLog,
    resultDialog: resultDialog,
    selectIcon
    },
    data(){
        return{
            htmlTitle:"GNN可认证鲁棒训练",
            /* 单选按钮样式 */
            methodHoverIndex:-1,
            methodDescription:"",
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            datasetChoice:0,
            dataname: ['CiteSeer','Cora_ml', 'PubMed'],
            datainfo:{
                    CiteSeer:{
                        name:"CiteSeer数据集",
                        tabledata:[
                            {name:"数据集内容",value:"科技论文"},
                            {name:"数据条目类型",value:"One-Hot编码"},
                            {name:"类别数",value:"6"},
                            {name:"节点数量",value:"3312"},
                            {name:"连边数量",value:"4732"}
                        ]
                    },
                    Cora_ml:{
                        name:"Cora_ml数据集",
                        tabledata:[
                            {name:"数据集内容",value:"机器学习论文"},
                            {name:"数据条目类型",value:"One-Hot编码"},
                            {name:"类别数",value:"7"},
                            {name:"节点数量",value:"2708"},
                            {name:"连边数量",value:"5429"}
                        ],
                    },
                    PubMed:{
                        name:"PubMed数据集",
                        tabledata:[
                            {name:"数据集内容",value:"糖尿病论文"},
                            {name:"数据条目类型",value:"TF-IDF编码"},
                            {name:"类别数",value:"3"},
                            {name:"节点数量",value:"19717"},
                            {name:"连边数量",value:"44338"}
                        ],
                    }
                },
            datasetParam:[
                {name: "批处理大小", value: 8, min:1, max:1000},
                {name: "测试集比例", value: 0.1, min:0, max:1},
                {name: "训练集比例", value: 0.8, min:0, max:1},
                {name: "验证集比例", value: 0.1, min:0, max:1}
            ],
            batch_size: 8,
            train_size:0.8,
            test_size:0.1,
            val_size:0.1,
            n_iters:500,
            train_Q:12,
            margin_iters:5,
            q_ratio:0.01,
            burn_in:100,
            modelChoice: "GCN",
            random_state:123,
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
                name:"模型鲁棒性训练",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"提升模型在对抗样本攻击下的鲁棒性",
                /* 背景介绍 */
                backinfo:"对抗攻击对于模型危害巨大，轻则造成模型失效，重则影响人工智能安全性。通过可认证鲁棒训练、对抗训练等方式来对AI模型进行安全加固，提升模型在对抗样本攻击下的鲁棒性。",
                /* 亮点介绍 */
                highlight:[
                    "鲁棒性训练方法5种，满足多任务类型模型的鲁棒性提升需求；",
                    "面向GCN的可认证鲁棒训练，能够有效提升图神经网络模型的鲁棒性；",
                    "面向CNN的对抗训练、基于特征散射的鲁棒性训练、基于异常感知的鲁棒性训练以及基于随机平滑的鲁棒性训练，能够有效提升卷积神经网络的鲁棒性。"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{
                "before":0.75,
                "after":0.92,
                "paca": 0.88
            },
            res_tmp:{},
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
        document.title = '模型鲁棒性训练';
        },
    methods: { 
        /* 关闭结果窗口 */
        closeDialog(){
            this.isShowPublish=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        onDatasetChoiceChange(e){
            // 修改选择数据集
            console.log('radio checked', e.target.value);
        },
        onModelChoiceChange(e){
            // 修改选择模型
            console.log('radio checked', e.target.value);
        },
        exportResult(){
            if (confirm("您确认下载该pdf文件吗？") ){
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
        /* result 处理*/
        resultPro(res){
            debugger;
            initGraph1("adv_robust_result",res.AdvTraining_GNN); 
            initGraph2("unadv_robust_result",res.AdvTraining_GNN);
            this.result.up = (res.AdvTraining_GNN.data.robust_test_result.robust_method-res.AdvTraining_GNN.data.robust_test_result.normal_method).toFixed(2)
        },
        /* 获取结果 */ 
        getData(){
            // debugger
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                that.res_tmp = data;
            });
        },
        /* 获取日志 */ 
        getLog(){
            // debugger;
            var that = this;
            if (that.percent<99){
                that.percent+=1;
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
                this.logflag = false;
                // 关闭结果数据获取data
                clearInterval(this.clk);
                // 关闭日志获取结果获取
                clearInterval(this.logclk);
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                // console.log(this.result.data.result)
                this.resultPro(this.res_tmp.data.result);
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
        // 切换页面
        changeSelectPage(){

        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            // debugger

            /* 备份 */ 
            var that = this;
            that.tid = "20231024_1512_6993cb5";
            that.stidlist =  {"AdvTraing":"S20231024_1512_e49f6e5"};
            that.clk = window.setInterval(() => {
                                that.update();
                            }, 300)
                return
            /* 调用创建主任务接口，需开启后端程序 */
            // this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
            //     that.tid = result.data.Taskid;
                
            //     /* 请求体 postdata*/
            //     const postdata={
            //         dataset:that.dataname[that.datasetChoice],
            //         // model:that.modelChoice,
            //         batch_size : that.batch_size,
            //         train_size : that.train_size,
            //         test_size : that.test_size,
            //         val_size : that.val_size,
            //         n_iters : that.n_iters,
            //         train_Q : that.train_Q,
            //         margin_iters : that.margin_iters,
            //         q_ratio : that.q_ratio,
            //         burn_in : that.burn_in,
            //         random_state : that.random_state,
            //         tid:that.tid};
            //     that.$axios.post("/Defense/AdvTraining_GNN", postdata).then((res) => {
            //         that.logflag = true;
            //         // 异步任务
            //         that.stidlist =  {"AdvTraing":res.data.stid}
            //         that.logclk = self.setInterval(that.getLog, 3000);
            //         that.clk = self.setInterval(that.update, 3000);
            //     }).catch((err) => {
            //             console.log(err)
            //     });
            // }).catch((err) => {
            //     console.log(err)
            // });    
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
/* 单神经元覆盖准则 */
box-sizing: border-box;
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1200px;
height: 824px;
background: #FFFFFF;
border: 1px solid #E0E3EB;
margin: 30px 0px 40px 0px;
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

.paramsSelected{
    display: flex;
}

.matchedDes{
    display: flex;
    flex-direction: column;
    /* align-items: flex-start; */
    padding: 0px;
    width: 1104px;
    /* height: 106px; */
    border-radius: 4px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
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

.paramblock {
    width: 220px;
    padding: 12px 0px;
}

.matchedMethodText span{
    color:#0B55F4
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
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
}

.result_div{
    margin-top: 0;
}


.dialog_publish_main{
align-items: center;
flex-direction: column;
position: absolute;
display: flex;
width: 1080px;
height: fit-content;
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

/* 得分图div */
#rdeva{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;

    width: 960px;
    /* height: 414px; */
    height: auto;
    /* Inside auto layout */

    flex: none;
    order: 1;
    flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 300px;
    height:300px;
}
</style>

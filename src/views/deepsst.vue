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
                    <router-link to="/coverage_neural"><button class="labelunselected">单神经元覆盖准则</button></router-link>
                    <router-link to="/coverage_layer"><button class="labelunselected">神经元层覆盖准则</button></router-link>
                    <router-link to="/coverage_importance"><button class="labelunselected">重要神经元覆盖准则</button></router-link>
                    <router-link to="/deepsst"><button class="labelselected">敏感神经元测试准则</button></router-link>
                    <router-link to="/deeplogic"><button class="labelunselected">逻辑神经元测试准则</button></router-link>
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
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
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
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="LeNet5">LeNet5</a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="npyfile">
                            <p class="mainParamName">选择/上传敏感度文件</p>
                            <a-checkbox-group v-model="fileChoice">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="npp.npy" checked>npp.npy</a-radio>
                                    <a-radio :style="radioStyle" value="mnn.npy" checked>mnn.npy</a-radio>
                                </div>
                            </a-checkbox-group>
                        </div>
                        <div class="sliderSelected">
                            <div class="sliderParams">
                                <p class="mainParamName">请选择修改神经元比例</p>
                                <a-row>
                                    <a-slider v-model="PertubeChoice" :min="0.01" :max="0.3" :step="0.01"  :marks="marks"/>
                                    <a-input-number v-model="PertubeChoice" :min="0.01" :max="0.3" :step="0.01" :formatter="(value) => `${100*value}%`"/>
                                </a-row>
                                
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
                        <h1>敏感神经元测试准则</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ datasetChoice }}</p>
                            <p class="result_annotation">模型：{{ modelChoice }}</p>
                            <p class="result_annotation">敏感度文件：{{ fileChoice }}</p>
                            <p class="result_annotation">修改神经元比例：{{ PertubeChoice*100 }}%</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">敏感神经元测试样例</div>
                        <div id="rdeva">
                            <div class="box">
                                <div class="graph_show" v-for="(item, index) in result.img_list" :key="index">
                                    <img :src="item" alt="">
                                </div>
                            </div>
                            <div class="conclusion">
                                <p class="result_text">共生成测试样例{{ result.number }}张，模型鲁棒性{{ result.res}} </p>
                                <p class="result_text">*生成样本越多，鲁棒性越差(500以内算优，500到5000算中，5000以外算差)</p>
                            </div>
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
<!-- 画卷积神经网络convnetdraw -->
<!-- <script src="../assets/js/convnetdraw.js"></script> -->
<script type="text/javascript">

</script>
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

/* 引入图片 */
import funcicon from "../assets/img/coverageneuralIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import { defineComponent, ref } from 'vue';

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

const marks = ref({
                0.01:"1%",
                0.3:"30%"
            })

export default {
    name:"deepsst",
    components:{
    /* 注册组件 */
    navmodule: navmodule,
    func_introduce: func_introduce,
    showLog: showLog,
    resultDialog: resultDialog,
    selectIcon,marks
    },
    // setup(){
        
    // },
    data(){
        return{
            htmlTitle:"敏感神经元测试准则",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            datasetChoice: "MNIST",
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
            modelChoice: "LeNet5",
            fileChoice: ["npp.npy", "mnn.npy"],
            PertubeChoice:0.05,
            marks,
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
                name:"标准化单元测试",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"多测试准则的标准化AI模型单元测试方法",
                /* 背景介绍 */
                backinfo:"评估模型训练效果时，由于测试数据有限，容易出现模型行中的某些行为无法被测试到的情况；平台开发标准化单元测试模块，提出制定多测试准则的标准化AI模型单元测试方法，全面评估模型训练效果。",
                /* 亮点介绍 */
                highlight:[
                    "测试准则5种，满足模型鲁棒性评估与测试数据充分性评估需求",
                    "多粒度神经元覆盖准则（包含单神经元和神经层覆盖测试准则）与重要神经元覆盖准则从不同角度评估测试数据集的充分性",
                    "敏感神经元测试准则用于评估模型鲁棒性、逻辑神经元测试准则用于评估模型安全性"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{},
            mark:0,
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
        document.title = '标准化单元测试';
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
        onImagesNumberChange(e) {
            // 修改测试图像数量
            if (e.target.value != "") {
                console.log('ImagesNumber: ', e.target.value);
                this.imageNumber = e.target.value;   
            } 
        },
        downloadGeneration(){
            if (confirm("您确认下载生成测试样本？") ) {
                // 下载生成测试样本
                var that = this;
                alert("开发中，敬请期待！")
            }
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
            // this.PertubeChoice = parseInt(100*this.PertubeChoice)
            this.result.number = res.DeepSst.SampleNum;
            if(this.result.number<500) {
                this.result.res = "强"
            } else if(this.result.number<5000) {
                this.result.res = "中等"
            } else {
                this.result.res = "差"
            }
            this.result.img_list  = res.DeepSst.SampleForPre;
            for(var i in this.result.img_list){
                this.result.img_list[i] = 'static/output'+this.result.img_list[i].split('output')[1];
            }
        },

        /* 获取结果 */ 
        getData(){
            // debugger
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                // that.result=data;
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
        /* 点击评估触发事件 */
        dataEvaClick(){
            // debugger
            /*判断选择*/

            /* 备份 */ 
            var that = this;
            
            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                that.tid = result.data.Taskid;
                                
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    model:that.modelChoice,
                    pertube: that.PertubeChoice,
                    m_dir: "",
                    tid:that.tid};
                that.$axios.post("/UnitTest/DeepSstParamSet", postdata).then((res) => {
                    
                    that.logflag = true;
                    // console.log(res);
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示，异步任务返回stid */
                    // 同步任务
                    // that.logflag = false;
                    // that.isShowPublish = true;
                    // that.result = res.data;
                    // that.resultPro(res.data);
                    // 异步任务
                    that.stidlist =  {"DeepSst":res.data.stid}
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
.demoData img{
    /* position: absolute; */
    width: 64px;
    height: 64px;
    left: 0px;
    top: 0px;
    /* background: url(../assets/img/mnist1.jpg); */
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

.npyfile{
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

.ant-row{
    width: 50%;
    /* margin:10px; */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: nowrap;
}

.ant-slider{
    width: 50%;
    margin: 10px 20px;
}
.ant-input-number{
    width: 15%;
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

.box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 900px;
    margin-top: 5%;
}

.graph_show {
    width: 250px;
    height: 150px;
}

.graph_show img{
    width: 100px;
}

.title_annotation{
    /* width: 217px;
    height: 24px; */

    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    display: flex;
    align-items: center;
    text-align: center;

    /* Untitled/gray-1 */

    color: #000000;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
}

/* 图表名称样式 */
.echart_title{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px;
    gap: 10px;
    isolation: isolate;

    width: 960px;
    height: auto;
    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
}

.resultchart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    isolation: isolate;
    margin-bottom: 10px;
    width: 960px;
    height: auto;
    flex: none;
    order: 1;
    flex-grow: 0;
}
.table{
    width: 960px;
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

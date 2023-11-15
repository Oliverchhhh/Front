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
                        <!-- 选数据 -->
                        <fairnessDataset :dataname="dataname" @clientDatasetSelect="clientDatasetSelect"></fairnessDataset>
                        
                        <!-- 选优化算法 -->
                        <div class="selectDebiasMethod">
                            <p class="mainParamName"><select-icon :stlye="{width:'4px'}" />请选择公平性提升算法</p>
                            <a-radio-group v-model="debiasMethodValue"  @change="onChangeDebiasMethod($event)">
                                <div class="debiasModule" v-for="(temp,index) in debiasMethod" :key="index">
                                    <a-radio :style="radioStyle" :value="index" :disabled="debiasDisabled[index]" >
                                        {{ temp.name }}
                                    </a-radio>
                                    <div class="formulaDes" v-if="debiasMethodValue===index">
                                        {{temp.name}}：{{ temp.des }}

                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-show="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>数据集公平性提升结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.dataname}}</div>

                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">优化算法:</div>
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.datamethod}}</div>
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div_notop">
                        <div class="g_score_content">
                            <div class=" main_top_echarts_con_title ">数据集公平性提升效果</div>
                            <div class="debias_res">
                                <div class="debias_res_score">
                                    <img src="../assets/img/beforeDebias.png" style="width: 360px;margin-top: -40px;"/>
                                    <p class="g_score"> {{res.score.bef}}</p>
                                    <p class="g_score_evaluate"> {{ res.score_evaluate.bef }}</p>
                                    <p class="debias_state">提升前</p>
                                </div>
                                <div class="to_aft">
                                    <img src="../assets/img/toAfter.svg" style="margin-top: -40px;"/>
                                </div>
                                <div class="debias_res_score">
                                    <img src="../assets/img/afterDebias.png" style="width: 360px;margin-top: -40px;"/>
                                    <p class="g_score"> {{res.score.aft}}</p>
                                    <p class="g_score_evaluate"> {{ res.score_evaluate.aft }}</p>
                                    <p class="debias_state">提升后</p>
                                </div>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text">数据集综合评分为{{res.score.aft}}，是一个{{ res.score_con.aft }}的数据集</p>
                            <p class="result_annotation">综合评分计算来源是个体公平性和群体公平性两个维度上的评分</p>
                        </div>
                    </div>
                    <!-- 评分详情 -->
                    <div class="result_div_notop">
                        <div class=" main_top_echarts_con_title ">公平性评分详情</div>
                        <div class="two_score">
                            <div class="left_score_label">
                                <P class="score_text">{{ res.consistency_score.aft }}</P>
                                <p class="score_lable">个体公平性评估</p>
                            </div>
                            <div class="center_score_label">
                                <div class="process_bg" ><div class="left_pro" :style="'width:'+res.consistency_score.aft/100*210 +'px'"></div></div>
                                <div class="process_bg" style="margin-left: -4px;"><div class="right_pro" :style="'width:'+res.group_score.aft/100*210 +'px'"></div></div>
                            </div>
                            <div class="right_score_label">
                                <P class="score_text">{{ res.group_score.aft }}</P>
                                <p class="score_lable">群体公平性评估</p>
                            </div>
                        </div>
                        <div class="two_score_res">
                            <div class="conclusion" style="height: 80px;">
                                <div class="score_description">
                                    <div class="con_score">{{ res.consistency_score.aft }}</div>
                                    <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">数据集个体公平性指标为{{ res.Consistency.aft }}</div>
                                </div>
                                
                            </div>
                            <div class="conclusion" style="height: 80px;">
                                <div class="score_description">
                                    <div class="con_score">{{ res.group_score.aft }}</div>
                                    <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">数据集中经 Favorable Rate Difference、Favorable Rate Ratio 算法评估后，综合得分为{{ res.group_score.aft }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 个体得分图 -->
                    <div class="result_div_notop">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">个体公平性提升得分</div>
                            <p class="title_annotation">个体公平性是统计数据集中相似的个体是否有相似的标签或预测结果</p>
                            
                        </div>
                        <div>
                            <div class="cons_echart_div">
                                <div id = 'consevaBef'></div>
                                <div id = 'consevaAft'></div>
                            </div>
                            <div class="conclusion">
                                <p class="result_text">{{ res.consText }}</p>
                                <p class="result_annotation">个体公平性指标越接近1，模型越公平。</p>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                    <!-- 群体 -->
                    <div class="result_div_notop">
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">数据集群体公平性提升</div>
                            <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                            
                        </div>
                        <div class="group_echarts_div">

                            <div v-for="(temp,index) in senAttrList" class="attr_echarts_div" :key="index">
                                <div class="attr_title_div">
                                    <h3>{{ temp }}</h3>
                                    <p>敏感属性</p>
                                </div>
                                <div class="group_echart_content">
                                    <div  class="group_left_echart"  :id="temp+'Difference'"></div>
                                    <div class="group_right_echart"  :id="temp+'Ratio'"></div>
                                </div>
                                <div class="conclusion">
                                    <p class="result_text">{{ res.groupText[temp] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <a-divider>With Text</a-divider> -->
                    <!-- 数据占比 -->
                    <div class="result_div_notop">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">数据集中各属性的占比</div>
                        </div>
                        <div id="pro_tree"></div>   
                        <div class="conclusion">
                                    <p class="result_text">各属性的占比越均匀，数据集越公平</p>
                                    <p class="result_annotation">子节点面积大小代表占比多少</p>
                        </div>           
                    </div>
                    <!-- 相关性 -->
                    <div class="result_div_notop">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">数据集的各属性之间的相关性</div>
                            <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                        </div>
                        <div class="heat_content">
                            <h3>互信息系数</h3>
                            <div id="NMI" class="heat_canvas" :style="{height:heat_height}"></div>
                            <div class="conclusion">
                                <p class="result_text">互信息的值大于等于0，值越大表示两个变量之间的依赖关系越强。互信息为0时，表示两个变量相互独立。但是需要注意的是，互信息值的上限取决于两个变量的熵，因此互信息值本身并不具有直接的对比意义。可以使用归一化互信息（Normalized Mutual Information，NMI）进行归一化处理，将其值映射到0到1之间。</p>
                            </div>
                        </div>
                        <div class="heat_content">
                            <h3>Pearson相关系数</h3>
                            <div id="person" class="heat_canvas" :style="{height:heat_height}"></div>
                            <div class="conclusion">
                                <p class="result_text ">Pearson相关系数的取值范围为-1到1。1表示完全正相关，0表示无关，-1表示完全负相关。</p>
                            </div>
                        </div>
                        <div class="heat_content">
                        <h3>Spearman秩相关系数</h3>
                            <div id="spearman" class="heat_canvas" :style="{height:heat_height}"></div>
                            <div class="conclusion" >
                                <p class="result_text ">Spearman秩相关系数的取值范围也为-1到1。1表示完全正单调关系，0表示无单调关系，-1表示完全负单调关系。</p>
                            </div>
                        </div>
                        <div class="heat_content">
                            <h3>Kendall Tau相关系数</h3>
                            <div id="Kendall" class="heat_canvas" :style="{height:heat_height}"></div>
                            <div class="conclusion">
                                <p class="result_text ">Kendall Tau相关系数的取值范围也为-1到1。1表示完全正序关系，0表示无序关系，-1表示完全负序关系。</p>
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
/* 引入组件，公平性数据集选择 */
import fairnessDataset from "../components/fairnessDatasetSelect.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
/* 引入自定义js，结果显示 */
import {drawconseva1, drawbarimproved, drawCorelationHeat, drawPopGraph} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/modelFairDebiasIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import centerPng from "../assets/img/center.png"
import secondPng from "../assets/img/second.png"
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
    name:"modelfairnesseva",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        fairnessDataset:fairnessDataset,
        selectIcon,
    },
    data(){
        return{
            htmlTitle: '数据集公平性提升报告',
            /* 评估行 */
            rowkey:0,
            colkey:0,
            /* 选中的提升算法值 */ 
            debiasMethodValue:"",               
            /* 提升算法 */ 
            debiasMethod:{
                "LFR":{'name':'Learn Fair Representations','des':'Learn Fair Representations（公平表征学习算法）一种预处理技术，可以找到一种潜在表示既能对数据进行良好编码，同时混淆关于受保护的属性的信息。','class':['table']},
                "Reweighing":{'name':'Reweighing','des':'Reweighing(数据重赋权)一种预处理技术，它赋予每个(种群, 标签) 组合中的样本不同的权重，保证在开始分类任务前的数据公平性。','class':['pic','table']},
            },
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                width:'100%'
            },
            /* 热力图height*/
            heat_height:"213px",
            /* 评估按钮样式和状态 */
            buttonBGColor:{
                background:"#0B55F4",
                color:"#FFFFFF"
            },
            disStatus:false,
            /* 数据占比结论 */
            propTextsub:"",
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag:false,
            /* 进度 */
            percent:10,
            /* 日志内容 */
            logtext:[],
            // dataname:["German","Adult","Compas","Cifar10-S","CelebA"],
            dataname:["German","Adult","Compas"],
            /* 选中数据集序号 */
            dataNameValue:0,
            /* 选中敏感属性列表 */
            senAttrList:[],
            /* 选中目标属性列表 */
            tarAttrList:[],
            /* 选中统计属性列表 */
            staAttrList:[],
            /* 功能介绍模块信息 */
            funcDesText:{
                /* 功能名称 */
                name:"数据集公平性提升",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"数据集中往往存在偏见，通过公平性提升功能，对数据集进行纠偏",
                /* 背景介绍 */
                backinfo:"数据集公平性提升功能通过公平表征学习和数据重赋权等方法对数据集进行纠偏，从群体和个体公平性两个维度对提升前后的数据集进行公平性评估，直观展示提升效果",
                /* 亮点介绍 */
                highlight:[
                    "支持表格数据集和图片数据集，表格数据集：German，Adult，Compas；图片数据集：CelebA，Cifar10-S",
                    "支持从群体公平性、个体公平性两大维度对比数据集公平性提升效果，同时提供数据集分布、属性相关系数表来分析数据集",
                    "支持公平表征学习（Learn Fair Representations）和数据重赋权（Reweighing）等主流的数据集公平性提升算法"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 处理后的结果数据 */
            res:{
                // 总评分
                "score":{"bef":null,"aft":null},
                // 个体公平性评分
                "consistency_score":{"bef":null,"aft":null},
                // 群体公平性评分
                "group_score":{"bef":null,"aft":null},
                // 评估结论
                "score_con":{"bef":null,"aft":null},
                // 评分段
                "score_evaluate":{"bef":null,"aft":null},
                // 个体公平性得分
                "Consistency":{"bef":null,"aft":null},
                // 个体公平性结论
                "consText":"",
                // 群体公平性得分
                "diflist":{
                    "bef":{},
                    "aft":{}
                },
                "ratiolist":{
                    "bef":{},
                    "aft":{}
                },
                // 群体公平性评估算法
                "labels":[],
                // 群体公平性结论
                "groupText":{},
            },
            /* 公平性结果 */
            result:{},
            /* 评估算法选择结果*/
            evaCheckedValues:[],
            /* 日志查询clock*/
            logclk:"", 
            /*主任务id*/ 
            tid:"",
            stidlist:{},
            /* 公平性提升算法disable */
            debiasDisabled:{
                "LFR":false,
                "Reweighing":false,
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
        document.title = '数据集公平性提升';
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
    mounted(){
        let that=this;
        
    },
    methods: {
        /* 获取日志 */ 
        getLog(){
            debugger
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
        getData(){
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                that.result=data;
            });
        },
        /* 停止结果获取循环 */ 
        stopTimer() {
            if (this.result.data.stop==1) {
                // 关闭日志显示
                this.percent=100
                this.logflag = false;
                // 关闭结果数据获取data
                window.clearInterval(this.clk);
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                this.result = this.result.data.result.data_debias;
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
        /* 关闭结果窗口 */
        closeDialog(){
        this.isShowPublish=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        onChangeEvaMethod(checkedValues){
            console.log('checked = ', checkedValues);
            this.evaCheckedValues = checkedValues
        },
        onChangeDebiasMethod(event){
            console.log("debiasMethodValue:", this.debiasMethodValue);
        },
        /* 监听数据集选择 */
        clientDatasetSelect(value, senAttrList, tarAttrList, staAttrList){
            this.dataNameValue = value;
            this.senAttrList = senAttrList;
            this.tarAttrList = tarAttrList;
            this.staAttrList = staAttrList;
            if(senAttrList.length==0 || tarAttrList.length==0 || staAttrList.length==0){
                this.buttonBGColor.background = "#C8DCFB";
            }else{
                this.buttonBGColor.background = "#0B55F4";
            };
            this.debiasDisabled={
                "LFR":false,
                "Reweighing":false
            };
            if( ["Cifar10-S","CelebA"].indexOf(this.dataname[value]) != -1){
                this.debiasDisabled["LFR"] = true;
            }
            console.log("this.dataname:",value);
            console.log("this.debiasDisabled:",this.debiasDisabled);
        },
        /* result 处理*/
        resultPro(res1){
            var that = this;
            that.percent=100;
            that.res["score"]["bef"] = that.result["Overall fairness"][0].toFixed(2)*100;
            that.res["score"]["aft"] = that.result["Overall fairness"][1].toFixed(2)*100;
            that.res["consistency_score"]['bef'] = that.result["Overall individual fairness"][0].toFixed(2)*100;
            that.res["consistency_score"]['aft'] = that.result["Overall individual fairness"][1].toFixed(2)*100;
            that.res["group_score"]['bef'] =  that.result["Overall group fairness"][0].toFixed(2)*100;
            that.res["group_score"]['aft'] =  that.result["Overall group fairness"][1].toFixed(2)*100;
            // 总分判断
            if(that.res.score.bef > 80){
                that.res.score_evaluate['bef'] = "优秀";
                that.res.score_con['bef'] = "公平";
            }else if(that.res.score.bef > 60 && that.res.score.bef <=80){
                that.res.score_evaluate['bef'] = "良好";
                that.res.score_con['bef'] = "较公平";
            }else{
                that.res.score_evaluate['bef'] = "差";
                that.res.score_con['bef'] = "较不公平";
            }
            // 提升后总分判断
            if(that.res.score.aft > 80){
                that.res.score_evaluate['aft'] = "优秀";
                that.res.score_con['aft'] = "公平";
            }else if(that.res.score.aft > 60 && that.res.score.aft <=80){
                that.res.score_evaluate['aft'] = "良好";
                that.res.score_con['aft'] = "较公平";
            }else{
                that.res.score_evaluate['aft'] = "差";
                that.res.score_con['aft'] = "较不公平";
            }

            that.res["Consistency"]['bef']=(that.result.Consistency[0]*100).toFixed(2);
            that.res["Consistency"]['aft']=(that.result.Consistency[1]*100).toFixed(2);
            that.res["Proportion"]=that.result.Proportion;
            let cons_sub = (that.res["Consistency"]['aft'] - that.res["Consistency"]['bef']).toFixed(2);
            //得分图
            drawconseva1("consevaBef",that.res["Consistency"]["bef"],"#0B55F4", "Original");
            drawconseva1("consevaAft",that.res["Consistency"]["aft"],"#0B55F4", "Improved");
            
            that.res.consText = "模型个体公平性提升前得分为" + that.res.Consistency.bef + "，提升后的得分为" + that.res.Consistency.aft + "，共提升了" + cons_sub + "分。";
           
            //直方图
            // 初始化群体公平性
            for(let attrTemp of that.senAttrList){
                that.res.diflist['bef'][attrTemp] = [];
                that.res.diflist['aft'][attrTemp] = [];
                that.res.ratiolist['bef'][attrTemp] = [];
                that.res.ratiolist['aft'][attrTemp] = [];
            };
            // 群体评估数据整合
            that.res.labels = []
            for(let temp1 in that.result["Favorable Rate Difference"]){
                that.res.labels.push(temp1)

                for(let attrTemp of that.senAttrList){
                    that.res.diflist.bef[attrTemp].push(that.result["Favorable Rate Difference"][temp1][0][attrTemp].toFixed(2))
                    that.res.diflist.aft[attrTemp].push(that.result["Favorable Rate Difference"][temp1][1][attrTemp].toFixed(2))
                    that.res.ratiolist.bef[attrTemp].push(that.result["Favorable Rate Ratio"][temp1][0][attrTemp].toFixed(2))
                    that.res.ratiolist.aft[attrTemp].push(that.result["Favorable Rate Ratio"][temp1][1][attrTemp].toFixed(2))
                }
            };
            // 画图
            for(let attrTemp of that.senAttrList){
                drawbarimproved(attrTemp+"Difference",that.res.diflist.bef[attrTemp],that.res.diflist.aft[attrTemp],that.res.labels,"Favorable Rate Difference");
                drawbarimproved(attrTemp+"Ratio",that.res.ratiolist.bef[attrTemp], that.res.ratiolist.aft[attrTemp],that.res.labels,"Favorable Rate Ratio");
                that.res.groupText[attrTemp]="本次测试敏感属性为"+attrTemp+"，目标属性为"+that.res.labels.toString()+"\
                左上直方图为使用favorable rate ratio的统计结果，表示不同"+attrTemp+"对目标属性结果预测的影响，\
                值越接近1则表示则敏感属性对目标属性的影响越小，\
                右上图直方图为使用favorable rate difference的统计结果，值越小则敏感属性"+attrTemp+"对目标属性的影响越小。"
            }
            // 占比图
            var data = {
                id: "center_"+that.dataname[that.dataNameValue],
                label: that.dataname[that.dataNameValue],
                population: 1,
                children: []};
            
            for (let key in that.result.Proportion){
                var second_children={
                    id:"second_"+key,
                    label:key,
                    population:1,
                    children:[]
                };
                for( let key1 in that.result.Proportion[key]){
                    var third_children={
                    id:key+'_'+key1,
                    label:key1,
                    population:that.result.Proportion[key][key1].toFixed(3),
                    isLeaf: true,
                    };
                    second_children["children"].push(third_children);
                }
                data["children"].push(second_children);
            }
            drawPopGraph("pro_tree", data, centerPng, secondPng)
            // 热力图
            var heatX=[];
            var X_index={}
            var personData=[];
            var spearmanData=[];
            var kendallData=[];
            var NMIData=[];
            var x_num = 0
            for(let temp of that.result["Corelation coefficients"] ){
                if(heatX.indexOf(temp["attr"]) == -1){
                    X_index[temp["attr"]] = x_num;
                    heatX.push(temp["attr"])
                    x_num += 1;
                }
                if(heatX.indexOf(temp["target"]) == -1){
                    X_index[temp["target"]] = x_num;
                    heatX.push(temp["target"])
                    x_num += 1;
                }
                if(temp.values.pearson != null){
                    personData.push([X_index[temp["attr"]],X_index[temp["target"]],temp.values.pearson.toFixed(3)])
                }
                if(temp.values.spearman != null){
                    spearmanData.push([X_index[temp["attr"]],X_index[temp["target"]],temp.values.spearman.toFixed(3)])
                }
                if(temp.values.kendalltau != null){
                    kendallData.push([X_index[temp["attr"]],X_index[temp["target"]],temp.values.kendalltau.toFixed(3)])
                }
                if(temp.values.mutual_info != null){
                    NMIData.push([X_index[temp["attr"]],X_index[temp["target"]],temp.values.mutual_info.toFixed(3)])
                }
            };
            if(x_num > 5){
                that.heat_height = 48 * x_num + "px";
            }
            var NMIColorList=["rgba(206, 221, 253, 1)", "rgba(157, 187, 251, 1)", "rgba(60, 119, 246, 1)", "rgba(11, 85, 244, 1)", "rgba(7, 51, 146, 1)"];
            var spearmanColorList=["rgba(223, 206, 253, 1)", "rgba(191, 157, 251, 1)", "rgba(142, 84, 247, 1)" ,"rgba(94, 11, 244, 1)", "rgba(56, 7, 146, 1)"];
            var kendallColorList=["rgba(253, 227, 206, 1)", "rgba(251, 199, 157, 1)", "rgba(247, 158, 84, 1)", "rgba(244, 116, 11, 1)", "rgba(146, 70, 7, 1)"];
            var personColorList=["rgba(253, 206, 236, 1)", "rgba(251, 157, 218, 1)", "rgba(247, 84, 190, 1)", "rgba(244, 11, 162, 1)", "rgba(195, 9, 130, 1)"];
            // person热力图
            drawCorelationHeat("NMI", heatX, NMIData, NMIColorList);
            drawCorelationHeat("person", heatX, personData, personColorList);
            drawCorelationHeat("spearman", heatX, spearmanData, spearmanColorList);
            drawCorelationHeat("Kendall", heatX, kendallData, kendallColorList);
            
        },
        initParam(){
            this.logtext=[]
            this.percent=0
            this.postData={}
            this.result = {}
            this.tid=''
            this.stidlist = {}
            if(this.clk != ''){
                window.clearInterval(this.clk)
                this.clk = ''
            }
            if(this.logclk != ''){
                window.clearInterval(this.logclk)
                this.logclk = ''
            }
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            this.initParam()
            /*判断选择*/
            if (this.senAttrList.length ==0 ){
                this.$message.warning('请在数据集里面至少选择一项敏感属性！',3);
                return 0;
            };
            if (this.tarAttrList.length ==0 ){
                this.$message.warning('请在数据集里面选择一项目标属性！',3);
                return 0;
            };
            if (this.staAttrList.length ==0 ){
                this.$message.warning('请在数据集里面至少选择一项统计属性！',3);
                return 0;
            };
            if (this.debiasMethodValue == ""){
                this.$message.warning('请在提升算法中至少选择一项提升算法！',3);
                return 0;
            }
            this.logflag = true;
            var that=this;
            that.percent = 20;
            // that.tid = "20230821_1423_c77c72f"
            // that.postData={
            //     dataname:that.dataname[that.dataNameValue],
            //     senAttrList:JSON.stringify(that.senAttrList),
            //     tarAttrList:JSON.stringify(that.tarAttrList),
            //     staAttrList:JSON.stringify(that.staAttrList),
            //     datamethod:that.debiasMethodValue,
            //     tid:that.tid};
            // that.stidlist =  {"DataFairnessDebias":"S20230821_1423_3c57e77"};
            // that.clk = window.setInterval(() => {
            //     that.update();
            // },60)
            // return
            /* 调用创建主任务接口 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.postData={
                dataname:that.dataname[that.dataNameValue],
                senAttrList:JSON.stringify(that.senAttrList),
                tarAttrList:JSON.stringify(that.tarAttrList),
                staAttrList:JSON.stringify(that.staAttrList),
                datamethod:that.debiasMethodValue,
                tid:that.tid};
                that.percent = 40;
                that.$axios.post("/DataFairnessDebias",that.postData).then((res) => {
                    that.logflag = true;
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示 */
                    that.stidlist =  {"DataFairnessDebias":res.data.stid};
                    that.logclk = window.setInterval(() => {
                        that.getLog();
                    },2000)
                    that.clk = window.setInterval(() => {
                            that.update();
                        },6000)
                    console.log(that.logflag);
                }).catch((err) => {
                        console.log(err)
                        window.clearInterval(this.clk); 
                        window.clearInterval(this.logclk); 
                });
            }).catch((err) => {
                console.log(err)
                window.clearInterval(this.logclk); 
            });    
        }
    }
}
</script>
<!-- <style  scoped> -->
<style  scoped>

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
    width: 1104px;
    height: 714px;
    text-align: center;
}
.checkboxdiv{
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    gap: 16px;

    width: 360px;
    height: 60px;
    background: #F2F4F9;
    border-radius: 4px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    margin-right: 8px;
}
.checkboxdivlen{
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    gap: 16px;

    width: 544px;
    height: 60px;
    background: #F2F4F9;
    border-radius: 4px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    margin-right: 8px;
}
/* 提升算法模块样式 */
.debiasMethodDes{
    /* Auto layout */

display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

width: 1104px;
height: 516px;
flex: none;
order: 1;
align-self: stretch;
flex-grow: 0;
}
.debiasModule{
    width: 1104px;
}
.conclusion{
    margin-bottom: 0px;
}
.two_score_res{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    align-self: stretch;
}
.cons_echart_div{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 84px;
    align-self: stretch;
}

.debias_state{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-top: 100px;
}

.ant-checkbox-wrapper-checked .checkboxdiv{
    background: #E7F0FD;
    color: #0B55F4;
}

.ant-checkbox-wrapper-checked .checkboxdivlen{
    background: #E7F0FD;
    color: #0B55F4;
}
/* 复选框间距 */
.ant-checkbox-wrapper{
    margin-bottom: 16px;
}
/* 公式样式 */
.formulaDes{
    padding: 0px 20px;
    margin-bottom: 10px;
}

.formula{
    height:24px;
    width:15px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
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
gap: 60px;
}
.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    align-self: stretch;
}
.g_score{
    margin-top: -280px;
}
.g_score_evaluate{
    margin-left: 156px;
}
.debias_res{
    display: flex;
    width: 814px;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    row-gap: 20px;
    flex-wrap: wrap;
}
.debias_res_score{
    width: 360px;
    height: 321px;
    flex-shrink: 0;
}
.to_aft{
    width: 78px;
    height: 35px;
    flex-shrink: 0;
}
#consevaBef{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
}
#consevaAft{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
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
flex: none;
order: 1;
flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 300px;
    height:300px;
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
    text-align: center;
    color: #000000;
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
#consevaBef{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
}
#consevaAft{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
}
.debias_res_score{
    width: 360px;
    height: 321px;
    flex-shrink: 0;
}
.debias_res{
    display: flex;
    width: 814px;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    row-gap: 20px;
    flex-wrap: wrap;
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
.model_group_echart{
    width: 960px;
    height: 358px;
}
/* .fade-enter-active{
    animation: move 1s;
}
.fade-leave-active{
    animation: move 1s reverse;
} */
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
</style>
